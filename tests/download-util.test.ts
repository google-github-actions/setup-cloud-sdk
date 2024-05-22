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

import * as toolCache from '@actions/tool-cache';
import * as core from '@actions/core';

import { downloadAndExtractTool } from '../src/download-util';

test('#downloadAndExtractTool', { concurrency: true }, async (suite) => {
  suite.before(async () => {
    suite.mock.method(core, 'debug', () => {});
    suite.mock.method(core, 'info', () => {});
    suite.mock.method(core, 'warning', () => {});
    suite.mock.method(core, 'setOutput', () => {});
    suite.mock.method(core, 'setSecret', () => {});
    suite.mock.method(core, 'group', () => {});
    suite.mock.method(core, 'startGroup', () => {});
    suite.mock.method(core, 'endGroup', () => {});
    suite.mock.method(core, 'addPath', () => {});
    suite.mock.method(core, 'exportVariable', () => {});
  });

  const cases = [
    {
      name: 'file.7z',
      exp: 'extract7z',
    },
    {
      name: 'file.tar.gz',
      exp: 'extractTar',
    },
    {
      name: 'file.zip',
      exp: 'extractZip',
    },
  ];

  for await (const tc of cases) {
    await suite.test(tc.name, async (t) => {
      const result = () => {
        return tc.name;
      };

      const mocks = {
        downloadTool: t.mock.method(toolCache, 'downloadTool', result),
        extract7z: t.mock.method(toolCache, 'extract7z', result),
        extractTar: t.mock.method(toolCache, 'extractTar', result),
        extractZip: t.mock.method(toolCache, 'extractZip', result),
      };

      const actual = await downloadAndExtractTool(tc.name);
      assert.deepStrictEqual(actual, tc.name);

      const mock = mocks[tc.exp as keyof typeof mocks];
      assert.deepStrictEqual(mock.mock.callCount(), 1);
    });
  }
});
