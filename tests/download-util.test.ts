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

import 'mocha';
import { expect } from 'chai';

import * as fs from 'fs';
import * as os from 'os';
import * as io from '@actions/io';

import { TestToolCache, TEST_SDK_VERSION } from '../src/test-util';
const [toolDir, tempDir] = TestToolCache.override();

// Import modules being tested after test setup as run.
import * as downloadUtil from '../src/download-util';

import { buildReleaseURL } from '../src/format-url';

describe('#downloadAndExtractTool', function () {
  before(async function () {
    // Minimize download failure retry times in tests:
    //
    //   https://github.com/actions/toolkit/blob/a1b068ec31a042ff1e10a522d8fdf0b8869d53ca/packages/tool-cache/src/tool-cache.ts#L51
    const g = global as any;
    g['TEST_DOWNLOAD_TOOL_RETRY_MIN_SECONDS'] = '0';
    g['TEST_DOWNLOAD_TOOL_RETRY_MAX_SECONDS'] = '0';
  });

  beforeEach(async function () {
    await io.rmRF(toolDir);
    await io.rmRF(tempDir);
  });

  afterEach(async function () {
    try {
      await io.rmRF(toolDir);
      await io.rmRF(tempDir);
    } catch (err) {
      console.error('Error occurred during test cleanup: ' + err);
    }
  });

  after(async function () {
    const g = global as any;
    delete g['TEST_DOWNLOAD_TOOL_RETRY_MIN_SECONDS'];
    delete g['TEST_DOWNLOAD_TOOL_RETRY_MAX_SECONDS'];
  });

  it('downloads and extracts linux version', async function () {
    if (os.platform() === 'win32') {
      // https://github.com/actions/toolkit/issues/194
      this.skip();
    }

    const url = buildReleaseURL('linux', 'x86_64', TEST_SDK_VERSION);
    const extPath = await downloadUtil.downloadAndExtractTool(url);
    expect(extPath).to.be;
    expect(fs.existsSync(extPath)).to.be.true;
  });

  it('downloads and extracts windows version', async function () {
    // Use an older version of the Windows release, as the current release is
    // 200MB+ and takes too long to download.
    const url = buildReleaseURL('win32', 'x86_64', '0.9.83');
    const extPath = await downloadUtil.downloadAndExtractTool(url);
    expect(extPath).to.be;
    expect(fs.existsSync(extPath)).to.be.true;
  });

  it('downloads and extracts darwin version', async function () {
    if (os.platform() === 'win32') {
      // https://github.com/actions/toolkit/issues/194
      this.skip();
    }

    const url = buildReleaseURL('darwin', 'x86_64', TEST_SDK_VERSION);
    const extPath = await downloadUtil.downloadAndExtractTool(url);
    expect(extPath).to.be;
    expect(fs.existsSync(extPath)).to.be.true;
  });

  it('downloads and extracts mac ARM version', async function () {
    if (os.platform() === 'win32') {
      // https://github.com/actions/toolkit/issues/194
      this.skip();
    }

    const url = buildReleaseURL('darwin', 'arm64', TEST_SDK_VERSION);
    const extPath = await downloadUtil.downloadAndExtractTool(url);
    expect(extPath).to.be;
    expect(fs.existsSync(extPath)).to.be.true;
  });

  it('errors on download not found', async function () {
    try {
      await downloadUtil.downloadAndExtractTool('fakeUrl');
      throw new Error('expected exception to be throw');
    } catch (err) {
      const msg = err instanceof Error ? err.message : `${err}`;
      expect(msg).to.include('Invalid URL: fakeUrl');
    }
  });
});
