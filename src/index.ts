/*
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as path from 'path';
import * as os from 'os';

import { ExecOptions as ActionsExecOptions } from '@actions/exec/lib/interfaces';
import { getExecOutput } from '@actions/exec';
import { HttpClient } from '@actions/http-client';
import * as core from '@actions/core';
import * as toolCache from '@actions/tool-cache';
import * as semver from 'semver';
import { errorMessage } from '@google-github-actions/actions-utils';

import { buildReleaseURL } from './format-url';
import { downloadAndExtractTool } from './download-util';

// Do not listen to the linter - this can NOT be rewritten as an ES6 import statement.
const { version: appVersion } = require('../package.json');

// versionsURL is the URL to the artifact where version information is stored.
const versionsURL = `https://raw.githubusercontent.com/google-github-actions/setup-cloud-sdk/main/data/versions.json`;

/**
 * userAgentString is the UA to use for this installation. It dynamically pulls
 * the app version from the package declaration.
 */
export const userAgentString = `google-github-actions:setup-cloud-sdk/${appVersion}`;

/**
 * Checks if gcloud is installed.
 *
 * @param version - (Optional) Cloud SDK version.
 * @returns true if gcloud is found in toolpath.
 */
export function isInstalled(version?: string): boolean {
  let toolPath;
  if (version) {
    toolPath = toolCache.find('gcloud', version);
    return toolPath != undefined && toolPath !== '';
  }
  toolPath = toolCache.findAllVersions('gcloud');
  return toolPath.length > 0;
}

/**
 * Returns the correct gcloud command for OS.
 *
 * @returns gcloud command.
 */
export function getToolCommand(): string {
  // A workaround for https://github.com/actions/toolkit/issues/229
  // Currently exec on windows runs as cmd shell.
  let toolCommand = 'gcloud';
  if (process.platform == 'win32') {
    toolCommand = 'gcloud.cmd';
  }
  return toolCommand;
}

/**
 * ExecOptions is a type alias to core/exec ExecOptions.
 */
export type ExecOptions = ActionsExecOptions;

/**
 * ExecOutput is the output returned from a gcloud exec.
 */
export type ExecOutput = {
  stderr: string;
  stdout: string;
  output: string;
};

/**
 * gcloudRun executes the given gcloud command using actions/exec under the
 * hood. It handles non-zero exit codes and throws a more semantic error on
 * failure.
 *
 * @param cmd The command to run.
 * @param options Any options.
 *
 * @return ExecOutput
 */
export async function gcloudRun(cmd: string[], options?: ExecOptions): Promise<ExecOutput> {
  const toolCommand = getToolCommand();
  const opts = Object.assign({}, { silent: true, ignoreReturnCode: true }, options);
  const commandString = `${toolCommand} ${cmd.join(' ')}`;
  core.debug(`Running command: ${commandString}`);

  const result = await getExecOutput(toolCommand, cmd, opts);
  if (result.exitCode !== 0) {
    const errMsg = result.stderr || `command exited ${result.exitCode}, but stderr had no output`;
    throw new Error(`failed to execute command \`${commandString}\`: ${errMsg}`);
  }

  return {
    stderr: result.stderr,
    stdout: result.stdout,
    output: result.stdout + '\n' + result.stderr,
  };
}

/**
 * gcloudRunJSON runs the gcloud command with JSON output and parses the result
 * as JSON. If the parsing fails, it throws an error.
 *
 * @param cmd The command to run.
 * @param options Any options.
 *
 * @return Parsed JSON as an object (or array).
 */
export async function gcloudRunJSON(cmd: string[], options?: ExecOptions): Promise<any> {
  const jsonCmd = ['--format', 'json'].concat(cmd);
  const output = await gcloudRun(jsonCmd, options);

  try {
    const parsed = JSON.parse(output.stdout);
    return parsed;
  } catch (err) {
    throw new Error(
      `failed to parse output as JSON: ${err}\n\nstdout:\n${output.stdout}\n\nstderr:\n${output.stderr}`,
    );
  }
}

/**
 * Checks if the project Id is set in the gcloud config.
 *
 * @returns true is project Id is set.
 */
export async function isProjectIdSet(): Promise<boolean> {
  const result = await gcloudRun(['config', 'get-value', 'project']);
  return !result.output.includes('unset');
}

/**
 * Checks if gcloud is authenticated.
 *
 * @returns true is gcloud is authenticated.
 */
export async function isAuthenticated(): Promise<boolean> {
  const result = await gcloudRun(['auth', 'list']);
  return !result.output.includes('No credentialed accounts.');
}

/**
 * Installs the gcloud SDK into the actions environment.
 *
 * @param version - The version or version specification to install. If a
 * specification is given, the most recent version that still matches the
 * specification is installed.
 * @returns The path of the installed tool.
 */
export async function installGcloudSDK(version: string): Promise<string> {
  // Retrieve the release corresponding to the specified version and OS
  const osPlat = os.platform();
  const osArch = os.arch();
  const resolvedVersion = toolCache.isExplicitVersion(version)
    ? version
    : await bestVersion(version);
  const url = buildReleaseURL(osPlat, osArch, resolvedVersion);

  // Download and extract the release
  const extPath = await downloadAndExtractTool(url);
  if (!extPath) {
    throw new Error(`Failed to download release, url: ${url}`);
  }

  // Install the downloaded release into the github action env
  const toolRoot = path.join(extPath, 'google-cloud-sdk');
  let toolPath = await toolCache.cacheDir(toolRoot, 'gcloud', resolvedVersion);
  toolPath = path.join(toolPath, 'bin');
  core.addPath(toolPath);
  return toolPath;
}

/**
 * computeGcloudVersion computes the appropriate gcloud version for the given
 * string. If the string is the empty string or the special value "latest", it
 * returns the latest known version of the Google Cloud SDK. Otherwise it
 * returns the provided string. It does not validate that the string is a valid
 * version.
 *
 * This is most useful when accepting user input which should default to
 * "latest" or the empty string when you want the latest version to be
 * installed, but still want users to be able to choose a specific version to
 * install as a customization.
 *
 * @deprecated Callers should use `installGcloudSDK('> 0.0.0.')` instead.
 *
 * @param version String (or undefined) version. The empty string or other
 * falsey values will return the latest gcloud version.
 *
 * @return String representing the latest version.
 */
export async function computeGcloudVersion(version?: string): Promise<string> {
  version = (version || '').trim();
  if (version === '' || version === 'latest') {
    return await getLatestGcloudSDKVersion();
  }
  return version;
}

/**
 * Authenticates the gcloud tool using the provided credentials file.
 *
 * @param filepath - Path to the credentials file.
 */
export async function authenticateGcloudSDK(filepath: string): Promise<void> {
  await gcloudRun(['--quiet', 'auth', 'login', '--force', '--cred-file', filepath]);
}

/**
 * Sets the GCP Project Id in the gcloud config.
 *
 * @param projectId - The project ID to set.
 * @returns project ID.
 */
export async function setProject(projectId: string): Promise<void> {
  await gcloudRun(['--quiet', 'config', 'set', 'project', projectId]);
}

/**
 * Install a Cloud SDK component.
 *
 * @param component - gcloud component group to install ie alpha, beta.
 * @returns CMD output
 */
export async function installComponent(component: string[] | string): Promise<void> {
  let cmd = ['--quiet', 'components', 'install'];
  if (Array.isArray(component)) {
    cmd = cmd.concat(component);
  } else {
    cmd.push(component);
  }

  await gcloudRun(cmd);
}

/**
 * getLatestGcloudSDKVersion fetches the latest version number from the API.
 *
 * @returns The latest stable version of the gcloud SDK.
 */
export async function getLatestGcloudSDKVersion(): Promise<string> {
  return await bestVersion('> 0.0.0');
}

/**
 * bestVersion takes a version constraint and gets the latest available version
 * that satisfies the constraint.
 *
 * @param spec Version specification
 * @return Resolved version
 */
export async function bestVersion(spec: string): Promise<string> {
  let versions: string[];
  try {
    const http = new HttpClient(userAgentString, undefined, { allowRetries: true, maxRetries: 3 });
    const res = await http.get(versionsURL);

    const body = await res.readBody();
    const statusCode = res.message.statusCode || 500;
    if (statusCode >= 400) {
      throw new Error(`(${statusCode}) ${body}`);
    }

    versions = JSON.parse(body) as string[];
  } catch (err) {
    const msg = errorMessage(err);
    throw new Error(`failed to retrieve versions from ${versionsURL}: ${msg}`);
  }

  return computeBestVersion(spec, versions);
}

/**
 * computeBestVersion computes the latest available version that still satisfies
 * the spec. This is a helper function and is only exported for testing.
 *
 * @param versions List of versions
 * @param spec Version specification
 *
 * @return Best version or an error if no matches are found
 */
export function computeBestVersion(spec: string, versions: string[]): string {
  // Sort all versions
  versions = versions.sort((a, b) => {
    return semver.gt(a, b) ? 1 : -1;
  });

  // Find the latest version that still satisfies the spec.
  let resolved = '';
  for (let i = versions.length - 1; i >= 0; i--) {
    const candidate = versions[i];
    if (semver.satisfies(candidate, spec)) {
      resolved = candidate;
      break;
    }
  }

  if (!resolved) {
    throw new Error(`failed to find any versions matching "${spec}"`);
  }
  return resolved;
}

export * from './test-util';
