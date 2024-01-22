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

import * as fs from 'fs';
import * as os from 'os';

import * as core from '@actions/core';

import { TestToolCache, TEST_SDK_VERSION } from '../src/test-util';

// Import modules being tested after test setup as run.
import * as downloadUtil from '../src/download-util';

import { buildReleaseURL } from '../src/format-url';

const skipIfWindows = (): string | boolean => {
  if (os.platform() === 'win32') {
    return 'skipping on Windows';
  }

  return false;
};

test('#downloadAndExtractTool', async (suite) => {
  suite.before(async () => {
    // Minimize download failure retry times in tests:
    //
    //   https://github.com/actions/toolkit/blob/a1b068ec31a042ff1e10a522d8fdf0b8869d53ca/packages/tool-cache/src/tool-cache.ts#L51
    const g = global as any;
    g['TEST_DOWNLOAD_TOOL_RETRY_MIN_SECONDS'] = '0';
    g['TEST_DOWNLOAD_TOOL_RETRY_MAX_SECONDS'] = '0';

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

  suite.beforeEach(async () => {
    await TestToolCache.start();
  });

  suite.afterEach(async () => {
    await TestToolCache.stop();
  });

  suite.after(async () => {
    const g = global as any;
    delete g['TEST_DOWNLOAD_TOOL_RETRY_MIN_SECONDS'];
    delete g['TEST_DOWNLOAD_TOOL_RETRY_MAX_SECONDS'];
  });

  await suite.test('downloads and extracts linux version', { skip: skipIfWindows() }, async () => {
    const url = buildReleaseURL('linux', 'x86_64', TEST_SDK_VERSION);
    const extPath = await downloadUtil.downloadAndExtractTool(url);
    assert.ok(extPath);
    assert.ok(fs.existsSync(extPath));
  });

  await suite.test('downloads and extracts windows version', async () => {
    // Use an older version of the Windows release, as the current release is
    // 200MB+ and takes too long to download.
    const url = buildReleaseURL('win32', 'x86_64', '0.9.83');
    const extPath = await downloadUtil.downloadAndExtractTool(url);
    assert.ok(extPath);
    assert.ok(fs.existsSync(extPath));
  });

  await suite.test('downloads and extracts darwin version', { skip: skipIfWindows() }, async () => {
    const url = buildReleaseURL('darwin', 'x86_64', TEST_SDK_VERSION);
    const extPath = await downloadUtil.downloadAndExtractTool(url);
    assert.ok(extPath);
    assert.ok(fs.existsSync(extPath));
  });

  await suite.test(
    'downloads and extracts mac ARM version',
    { skip: skipIfWindows() },
    async () => {
      const url = buildReleaseURL('darwin', 'arm64', TEST_SDK_VERSION);
      const extPath = await downloadUtil.downloadAndExtractTool(url);
      assert.ok(extPath);
      assert.ok(fs.existsSync(extPath));
    },
  );

  await suite.test('errors on download not found', async () => {
    await assert.rejects(async () => {
      await downloadUtil.downloadAndExtractTool('fakeUrl');
    }, /Invalid URL/);
  });
});
