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

import https from 'https';
import { URL } from 'url';
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
  const u = new URL(url);

  const opts = {
    hostname: u.hostname,
    port: u.port,
    path: u.pathname + u.search,
    method: 'GET',
    headers: {
      'User-Agent': userAgentString,
    },
  };

  const resp: string = await new Promise((resolve, reject) => {
    const req = https.request(opts, (res) => {
      res.setEncoding('utf8');

      let body = '';
      res.on('data', (data) => {
        body += data;
      });

      res.on('end', () => {
        if (res.statusCode && res.statusCode >= 400) {
          reject(body);
        } else {
          resolve(body);
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.end();
  });

  const body = JSON.parse(resp);
  const version = body.version;
  if (!version) {
    throw new Error(`Failed to retrieve gcloud SDK version, invalid response body: ${body}`);
  }
  return version;
}
