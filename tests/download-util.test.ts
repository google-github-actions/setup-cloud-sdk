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

/*
 * Tests download-util.
 */
import * as chai from 'chai';
import chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
const expect = chai.expect;

import * as fs from 'fs';
import * as os from 'os';
import * as io from '@actions/io';

import { TestToolCache, TEST_SDK_VERSION } from '../src/test-util';
const [toolDir, tempDir] = TestToolCache.override();

// Import modules being tested after test setup as run.
import * as downloadUtil from '../src/download-util';

import { getReleaseURL } from '../src/format-url';

describe('#downloadAndExtractTool', function () {
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

  it('downloads and extracts linux version', async function () {
    const url = await getReleaseURL('linux', 'x86_64', TEST_SDK_VERSION);
    const extPath = await downloadUtil.downloadAndExtractTool(url);
    expect(extPath).to.be;
    expect(fs.existsSync(extPath)).to.be.true;
  });

  it('downloads and extracts windows version', async function () {
    // Use an older version of the Windows release, as the current release is
    // 200MB+ and takes too long to download.
    const url = await getReleaseURL('win32', 'x86_64', '0.9.83');
    const extPath = await downloadUtil.downloadAndExtractTool(url);
    expect(extPath).to.be;
    expect(fs.existsSync(extPath)).to.be.true;
  });

  it('downloads and extracts darwin version', async function () {
    const url = await getReleaseURL('darwin', 'x86_64', TEST_SDK_VERSION);
    const extPath = await downloadUtil.downloadAndExtractTool(url);
    expect(extPath).to.be;
    expect(fs.existsSync(extPath)).to.be.true;
  });

  it('downloads and extracts mac ARM version', async function () {
    const url = await getReleaseURL('darwin', 'arm64', TEST_SDK_VERSION);
    const extPath = await downloadUtil.downloadAndExtractTool(url);
    expect(extPath).to.be;
    expect(fs.existsSync(extPath)).to.be.true;
  });

  it('errors on download not found', async function () {
    const promise = downloadUtil.downloadAndExtractTool('fakeUrl');
    expect(promise).to.eventually.be.rejectedWith('unable to find url');
  });
});
