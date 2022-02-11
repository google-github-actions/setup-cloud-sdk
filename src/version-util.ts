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

/**
 * Contains version utility functions.
 */

import * as httpm from '@actions/http-client';
import { retry } from '@lifeomic/attempt';

import { userAgentString } from './user-agent-util';

// cloudSDKComponentsURL is the URL where the JSON file that lists Cloud SDK
// versions resides.
const cloudSDKComponentsURL = 'https://dl.google.com/dl/cloudsdk/channels/rapid/components-2.json';

/**
 * getLatestGcloudSDKVersion fetches the latest version number from the API.
 *
 * @returns The latest stable version of the gcloud SDK.
 */
export async function getLatestGcloudSDKVersion(): Promise<string> {
  const retryOpts = {
    delay: 200,
    factor: 2,
    maxAttempts: 3,
  };

  return await retry(async () => {
    return await getGcloudVersion(cloudSDKComponentsURL);
  }, retryOpts);
}

/**
 * getGcloudVersion is a helper that actually downloads the gcloud version
 * information.
 *
 * @param url URL for the component download. This is exposed for testing, but
 * should be called without parameters.
 *
 */
async function getGcloudVersion(url: string): Promise<string> {
  const http = new httpm.HttpClient(userAgentString);
  const res = await http.get(url);
  if (res.message.statusCode && res.message.statusCode != 200) {
    throw new Error(`Failed to retrieve gcloud SDK version, statusCode: ${res.message.statusCode}`);
  }

  const body = JSON.parse(await res.readBody());
  const version = body.version;
  if (!version) {
    throw new Error(`Failed to retrieve gcloud SDK version, invalid response body: ${body}`);
  }
  return version;
}
