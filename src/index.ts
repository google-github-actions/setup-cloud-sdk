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

import { getExecOutput } from '@actions/exec';
import * as core from '@actions/core';
import * as toolCache from '@actions/tool-cache';
import * as os from 'os';
import { buildReleaseURL } from './format-url';
import * as downloadUtil from './download-util';
import * as installUtil from './install-util';
import { getLatestGcloudSDKVersion } from './version-util';
import { ExecOptions as ActionsExecOptions } from '@actions/exec/lib/interfaces';

export { getLatestGcloudSDKVersion };

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
 * @param version - The version being installed.
 * @returns The path of the installed tool.
 */
export async function installGcloudSDK(version: string): Promise<void> {
  // Retrieve the release corresponding to the specified version and OS
  const osPlat = os.platform();
  const osArch = os.arch();
  const url = buildReleaseURL(osPlat, osArch, version);

  // Download and extract the release
  const extPath = await downloadUtil.downloadAndExtractTool(url);
  if (!extPath) {
    throw new Error(`Failed to download release, url: ${url}`);
  }

  // Install the downloaded release into the github action env
  await installUtil.installGcloudSDK(version, extPath);
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
 * @param serviceAccountKey - The service account key used for authentication.
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
