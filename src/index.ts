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

import * as exec from '@actions/exec';
import * as toolCache from '@actions/tool-cache';
import * as os from 'os';
import { getReleaseURL } from './format-url';
import * as downloadUtil from './download-util';
import * as installUtil from './install-util';
import { getLatestGcloudSDKVersion } from './version-util';
import { ExecOptions } from '@actions/exec/lib/interfaces';
import * as fs from 'fs';

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
 * Checks if the project Id is set in the gcloud config.
 *
 * @returns true is project Id is set.
 */
export async function isProjectIdSet(silent = true): Promise<boolean> {
  let output = '';
  const stdout = (data: Buffer): void => {
    output += data.toString();
  };
  const stderr = (data: Buffer): void => {
    output += data.toString();
  };
  const options = {
    listeners: {
      stdout,
      stderr,
    },
    silent,
  };

  const toolCommand = getToolCommand();

  await exec.exec(toolCommand, ['config', 'get-value', 'project'], options);
  return !output.includes('unset');
}

/**
 * Checks if gcloud is authenticated.
 *
 * @returns true is gcloud is authenticated.
 */
export async function isAuthenticated(silent = true): Promise<boolean> {
  let output = '';
  const stdout = (data: Buffer): void => {
    output += data.toString();
  };
  const stderr = (data: Buffer): void => {
    output += data.toString();
  };
  const options = {
    listeners: {
      stdout,
      stderr,
    },
    silent,
  };

  const toolCommand = getToolCommand();

  await exec.exec(toolCommand, ['auth', 'list'], options);
  return !output.includes('No credentialed accounts.');
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
  const url = await getReleaseURL(osPlat, osArch, version);

  // Download and extract the release
  const extPath = await downloadUtil.downloadAndExtractTool(url);
  if (!extPath) {
    throw new Error(`Failed to download release, url: ${url}`);
  }

  // Install the downloaded release into the github action env
  await installUtil.installGcloudSDK(version, extPath);
}

/**
 * Parses the service account string into JSON.
 *
 * @param serviceAccountKey - The service account key used for authentication.
 * @returns ServiceAccountKey as an object.
 */
export function parseServiceAccountKey(
  serviceAccountKey: string,
): ServiceAccountKey {
  let serviceAccount = serviceAccountKey;
  // Handle base64-encoded credentials
  if (!serviceAccountKey.trim().startsWith('{')) {
    serviceAccount = Buffer.from(serviceAccountKey, 'base64').toString('utf8');
  }
  try {
    return JSON.parse(serviceAccount);
  } catch (error) {
    const keyFormat = `
    {
      "type": "service_account",
      "project_id": "project-id",
      "private_key_id": "key-id",
      "private_key": "-----BEGIN PRIVATE KEY-----\\nprivate-key\\n-----END PRIVATE KEY-----\\n",
      "client_email": "service-account-email",
      "client_id": "client-id",
      "auth_uri": "https://accounts.google.com/o/oauth2/auth",
      "token_uri": "https://accounts.google.com/o/oauth2/token",
      "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
      "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/service-account-email"
    }
    `;
    const errMsg = error instanceof Error ? error.message : error;
    const message =
      'Error parsing credentials: ' +
      errMsg +
      '\nEnsure your credentials are base64 encoded or validate JSON format: ' +
      keyFormat;
    throw new Error(message);
  }
}

/**
 * Check if a given credential is WIF credential configuration.
 *
 * @param credFile - The  WIF credential configuration.
 * @returns boolean.
 */
function isWIFCredFile(credFile: string): boolean {
  try {
    const creds = JSON.parse(credFile);
    return 'type' in creds && creds.type == 'external_account';
  } catch (err) {
    throw new SyntaxError(`Failed to parse credentials as JSON: ${err}`);
  }
}

/**
 * Authenticates the gcloud tool using a service account key or WIF credential configuration
 * discovered via GOOGLE_GHA_CREDS_PATH environment variable. An optional serviceAccountKey
 * param is supported for legacy Actions.
 *
 * @param serviceAccountKey - The service account key used for authentication.
 * @returns exit code.
 */
export async function authenticateGcloudSDK(
  serviceAccountKey?: string,
  silent = true,
): Promise<number> {
  // Check if GOOGLE_GHA_CREDS_PATH has been set by auth
  if (process.env.GOOGLE_GHA_CREDS_PATH) {
    const credFilePath = process.env.GOOGLE_GHA_CREDS_PATH;
    const credFile = await fs.promises.readFile(credFilePath, 'utf8');
    // Check if credential is a WIF creds file
    if (isWIFCredFile(credFile)) {
      return authGcloudWIFCredsFile(credFilePath, silent);
    }
    return authGcloudSAKey(credFile, silent);
  }
  // Support legacy actions that pass in SA key
  if (serviceAccountKey) {
    return authGcloudSAKey(serviceAccountKey, silent);
  }
  // One of GOOGLE_GHA_CREDS_PATH or SA key is required
  throw new Error(
    'Error authenticating the Cloud SDK. Please use `google-github-actions/auth` to export credentials.',
  );
}

/**
 * Authenticates the gcloud tool using a service account key.
 *
 * @param serviceAccountKey - The service account key used for authentication.
 * @returns exit code.
 */

async function authGcloudSAKey(
  serviceAccountKey: string,
  silent = true,
): Promise<number> {
  const serviceAccountJson = parseServiceAccountKey(serviceAccountKey);
  const serviceAccountEmail = serviceAccountJson.client_email;

  const toolCommand = getToolCommand();
  // Authenticate as the specified service account.
  const options = {
    input: Buffer.from(JSON.stringify(serviceAccountJson)),
    silent,
  };
  return await exec.exec(
    toolCommand,
    [
      '--quiet',
      'auth',
      'activate-service-account',
      serviceAccountEmail,
      '--key-file',
      '-',
    ],
    options as ExecOptions,
  );
}

/**
 * Authenticates the gcloud tool using WIF credential configuration.
 *
 * @param credsFile - The WIF credential configuration path.
 * @returns exit code.
 */
async function authGcloudWIFCredsFile(
  credFilePath: string,
  silent = true,
): Promise<number> {
  const toolCommand = getToolCommand();
  const options = {
    silent,
  };
  return await exec.exec(
    toolCommand,
    ['--quiet', 'auth', 'login', '--cred-file', credFilePath],
    options as ExecOptions,
  );
}

/**
 * Sets the GCP Project Id in the gcloud config.
 *
 * @param serviceAccountKey - The service account key used for authentication.
 * @returns project ID.
 */
export async function setProject(
  projectId: string,
  silent = true,
): Promise<number> {
  const toolCommand = getToolCommand();
  const options = {
    silent,
  };
  return await exec.exec(
    toolCommand,
    ['--quiet', 'config', 'set', 'project', projectId],
    options,
  );
}

/**
 * Sets the GCP Project Id in the gcloud config.
 *
 * @param serviceAccountKey - The service account key used for authentication.
 * @returns project ID.
 */
export async function setProjectWithKey(
  serviceAccountKey: string,
): Promise<string> {
  const serviceAccountJson = parseServiceAccountKey(serviceAccountKey);
  await setProject(serviceAccountJson.project_id);
  return serviceAccountJson.project_id;
}

/**
 * Install a Cloud SDK component.
 *
 * @param component - gcloud component group to install ie alpha, beta.
 * @returns CMD output
 */
export async function installComponent(
  component: string[] | string,
  silent = true,
): Promise<void> {
  const toolCommand = getToolCommand();
  const options = {
    silent,
  };
  let cmd = ['--quiet', 'components', 'install'];
  if (Array.isArray(component)) {
    cmd = cmd.concat(component);
  } else {
    cmd.push(component);
  }

  try {
    await exec.exec(toolCommand, cmd, options);
  } catch (err) {
    throw new Error(`Unable to install component: ${component}`);
  }
}

/**
 * Run a gcloud command and return output as parsed JSON.
 *
 * @param cmd - the gcloud cmd to run.
 * @param silent - print output to console.
 * @returns CMD output
 */
export async function runCmdWithJsonFormat(
  cmd: string,
  silent = true,
): Promise<any> {
  const options = {
    silent,
  };

  const toolCommand = getToolCommand();
  const formattedCmd = cmd.split(' ');
  formattedCmd.push('--format', 'json');
  formattedCmd.shift(); // Remove duplicate gcloud
  const output = await exec.getExecOutput(toolCommand, formattedCmd, options);
  return JSON.parse(output.stdout);
}

interface ServiceAccountKey {
  type: string;
  project_id: string;
  project_key_id: string;
  private_key: string;
  client_email: string;
  client_id: string;
  auth_uri: string;
  token_uri: string;
  auth_provider_x509_cert_url: string;
  client_x509_cert_url: string;
}
