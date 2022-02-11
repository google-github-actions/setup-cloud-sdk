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

import { HttpClient } from '@actions/http-client';
import { errorMessage } from '@google-github-actions/actions-utils';

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
  return await getGcloudVersion(cloudSDKComponentsURL);
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
  try {
    const http = new HttpClient(userAgentString, undefined, { allowRetries: true, maxRetries: 3 });
    const res = await http.getJson<{ version: string }>(url);
    if (!res.result) {
      throw new Error(`invalid response: ${res.statusCode}`);
    }
    return res.result.version;
  } catch (err) {
    const msg = errorMessage(err);
    throw new Error(`failed to retrieve gcloud SDK version from ${url}: ${msg}`);
  }
}
