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

import { test } from 'node:test';
import assert from 'node:assert';

import { buildReleaseURL } from '../src/format-url';

test('#buildReleaseURL', async (suite) => {
  const cases = [
    {
      name: 'unknown os',
      os: 'nope',
      arch: 'x86_64',
      version: '345.0.0',
      error: 'Unexpected OS',
    },
    {
      name: 'linux/x64_64',
      os: 'linux',
      arch: 'x64_64',
      version: '345.0.0',
      expected: 'google-cloud-sdk-345.0.0-linux-x64_64.tar.gz',
    },
    {
      name: 'darwin/x64_64',
      os: 'darwin',
      arch: 'x64_64',
      version: '345.0.0',
      expected: 'google-cloud-sdk-345.0.0-darwin-x64_64.tar.gz',
    },
    {
      name: 'win32/x64_64',
      os: 'win32',
      arch: 'x64_64',
      version: '345.0.0',
      expected: 'google-cloud-sdk-345.0.0-windows-x64_64.zip',
    },
    {
      name: 'linux/x64',
      os: 'linux',
      arch: 'x64',
      version: '345.0.0',
      expected: 'google-cloud-sdk-345.0.0-linux-x86_64.tar.gz',
    },
    {
      name: 'linux/arm64',
      os: 'linux',
      arch: 'arm64',
      version: '345.0.0',
      expected: 'google-cloud-sdk-345.0.0-linux-arm.tar.gz',
    },
  ];

  for await (const tc of cases) {
    await suite.test(tc.name, async () => {
      if (tc.expected) {
        const expected = `https://dl.google.com/dl/cloudsdk/channels/rapid/downloads/${tc.expected}`;
        const actual = buildReleaseURL(tc.os, tc.arch, tc.version);
        assert.deepStrictEqual(actual, expected);
      } else if (tc.error) {
        assert.throws(() => {
          buildReleaseURL(tc.os, tc.arch, tc.version);
        }, new RegExp(tc.error));
      }
    });
  }
});
