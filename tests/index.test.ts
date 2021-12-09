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

import * as setupCloudSDK from '../src/index';
import { expect } from 'chai';
import * as sinon from 'sinon';
import * as io from '@actions/io';
import * as exec from '@actions/exec';
import {
  TestToolCache,
  writeTmpFile,
  TEST_TMP_FILES_DIR,
  TEST_SDK_VERSION,
  TEST_SDK_VERSIONS,
  TEST_SA_KEY_CREDS_FILE,
  TEST_WIF_CREDS_FILE,
} from '../src/test-util';

const KEY = process.env.KEY || '';
const B64_KEY = process.env.B64_KEY || '';
const PROJECT_ID = process.env.PROJECT_ID || '';
const RUNNER_OS = process.env.RUNNER_OS || '';

const [toolDir, tempDir] = TestToolCache.override();

describe('#setupCloudSDK', function () {
  beforeEach(async function () {
    await io.rmRF(toolDir);
    await io.rmRF(tempDir);
    await io.rmRF(TEST_TMP_FILES_DIR);
  });

  afterEach(async function () {
    try {
      await io.rmRF(toolDir);
      await io.rmRF(tempDir);
      delete process.env.GOOGLE_GHA_CREDS_PATH;
      sinon.restore();
    } catch (err) {
      console.error('Error occurred during test cleanup: ' + err);
    }
  });

  let version = TEST_SDK_VERSION;
  before(async () => {
    if (!KEY || !B64_KEY || !PROJECT_ID) {
      throw Error('Env Vars not found!');
    }
    version = await setupCloudSDK.getLatestGcloudSDKVersion();
  });

  it('returns false if not installed', function () {
    const installed = setupCloudSDK.isInstalled();

    expect(installed).eql(false);
  });

  it('returns false if version is not installed', async function () {
    await setupCloudSDK.installGcloudSDK(TEST_SDK_VERSION);
    const installed = setupCloudSDK.isInstalled(TEST_SDK_VERSIONS[TEST_SDK_VERSIONS.length - 2]);

    expect(installed).eql(false);
  });

  it('returns true if installed', async function () {
    await setupCloudSDK.installGcloudSDK(version);
    const installed = setupCloudSDK.isInstalled();

    expect(installed).eql(true);
  });

  it('returns true if version is installed', async function () {
    await setupCloudSDK.installGcloudSDK(version);
    const installed = setupCloudSDK.isInstalled(version);
    expect(installed).eql(true);
  });

  it('returns the correct tool cmd', function () {
    const cmd = setupCloudSDK.getToolCommand();
    if (RUNNER_OS == 'Windows') {
      expect(cmd).eql('gcloud.cmd');
    } else {
      expect(cmd).eql('gcloud');
    }
  });

  it('returns false if project Id is not set', async function () {
    await setupCloudSDK.installGcloudSDK(version);
    const isSet = await setupCloudSDK.isProjectIdSet();
    expect(isSet).eql(false);
  });
  it('returns false if not authenticated', async function () {
    await setupCloudSDK.installGcloudSDK(version);
    const isAuth = await setupCloudSDK.isAuthenticated();
    expect(isAuth).eql(false);
  });

  it('returns true if project Id is set', async function () {
    await setupCloudSDK.installGcloudSDK(version);
    await setupCloudSDK.setProject(PROJECT_ID);
    const isSet = await setupCloudSDK.isProjectIdSet();
    expect(isSet).eql(true);
    const output = await setupCloudSDK.runCmdWithJsonFormat('gcloud config list');
    expect(output.core.project).eql(PROJECT_ID);
  });

  it('returns true if authenticated', async function () {
    await setupCloudSDK.installGcloudSDK(version);
    await setupCloudSDK.authenticateGcloudSDK(KEY);
    const isAuth = await setupCloudSDK.isAuthenticated();
    expect(isAuth).eql(true);
  });

  it('runs correct command for WIF Creds via GOOGLE_GHA_CREDS_PATH', async function () {
    const credFileFixture = await writeTmpFile(TEST_WIF_CREDS_FILE);
    process.env.GOOGLE_GHA_CREDS_PATH = credFileFixture;
    await setupCloudSDK.installGcloudSDK(version);
    this.gcloudStub = sinon.stub(exec, 'exec').callsFake(() => {
      return Promise.resolve(0);
    });

    await setupCloudSDK.authenticateGcloudSDK();

    expect(this.gcloudStub.args[0][1]).eql([
      '--quiet',
      'auth',
      'login',
      '--cred-file',
      credFileFixture,
    ]);
  });

  it('runs correct command for SA Key Creds via GOOGLE_GHA_CREDS_PATH', async function () {
    const credFileFixture = await writeTmpFile(TEST_SA_KEY_CREDS_FILE);
    process.env.GOOGLE_GHA_CREDS_PATH = credFileFixture;
    await setupCloudSDK.installGcloudSDK(version);
    this.gcloudStub = sinon.stub(exec, 'exec').callsFake(() => {
      return Promise.resolve(0);
    });

    await setupCloudSDK.authenticateGcloudSDK();

    // correct SA key passed via stdin
    expect(this.gcloudStub.args[0][2].input).eql(
      Buffer.from(JSON.stringify(JSON.parse(TEST_SA_KEY_CREDS_FILE))),
    );
    expect(this.gcloudStub.args[0][1]).eql([
      '--quiet',
      'auth',
      'activate-service-account',
      'my-service-account@my-project.iam.gserviceaccount.com',
      '--key-file',
      '-',
    ]);
  });

  it('throws an error if GOOGLE_GHA_CREDS_PATH is invalid', async function () {
    process.env.GOOGLE_GHA_CREDS_PATH = 'invalid';
    await setupCloudSDK.installGcloudSDK(version);

    try {
      await setupCloudSDK.authenticateGcloudSDK();
    } catch (err) {
      const message = err instanceof Error ? err.message : err;
      expect(message).contains('no such file or directory');
    }
  });

  it('throws an error if GOOGLE_GHA_CREDS_PATH is not set and SA key is not provided', async function () {
    await setupCloudSDK.installGcloudSDK(version);
    try {
      await setupCloudSDK.authenticateGcloudSDK();
    } catch (err) {
      const message = err instanceof Error ? err.message : err;
      expect(message).eql(
        'Error authenticating the Cloud SDK. Please use `google-github-actions/auth` to export credentials.',
      );
    }
  });

  it('installs latest gcloud', async function () {
    const latest = await setupCloudSDK.getLatestGcloudSDKVersion();
    await setupCloudSDK.installGcloudSDK(latest);
    const installed = setupCloudSDK.isInstalled();

    expect(installed).eql(true);
  });

  it('installs a versioned gcloud', async function () {
    await setupCloudSDK.installGcloudSDK(version);
    const installed = setupCloudSDK.isInstalled(version);

    expect(installed).eql(true);
  });

  it('parses a service account key', async function () {
    const key = setupCloudSDK.parseServiceAccountKey(KEY);
    expect(key).not.eql(undefined);
  });

  it('parses a base64 key', async function () {
    const key = setupCloudSDK.parseServiceAccountKey(B64_KEY);
    expect(key).not.eql(undefined);
  });

  it('errors with bad key', async function () {
    try {
      setupCloudSDK.parseServiceAccountKey('{}');
    } catch (err) {
      expect(err).include('parsing credentials');
    }
  });

  it('sets authentication', async function () {
    await setupCloudSDK.installGcloudSDK(version);
    await setupCloudSDK.authenticateGcloudSDK(KEY);
    const isAuth = await setupCloudSDK.isAuthenticated();
    expect(isAuth).eql(true);
  });

  it('sets the Project Id', async function () {
    await setupCloudSDK.installGcloudSDK(version);
    await setupCloudSDK.setProject(PROJECT_ID);
    const output = await setupCloudSDK.runCmdWithJsonFormat('gcloud config list');
    expect(output.core.project).eql(PROJECT_ID);
  });

  it('sets the Project Id from key', async function () {
    await setupCloudSDK.installGcloudSDK(version);
    await setupCloudSDK.setProjectWithKey(KEY);
    const output = await setupCloudSDK.runCmdWithJsonFormat('gcloud config list');
    expect(output.core.project).eql(PROJECT_ID);
  });

  it('installs beta components', async function () {
    const expectedComponent = 'beta';
    await setupCloudSDK.installGcloudSDK(version);
    await setupCloudSDK.installComponent(expectedComponent);
    const output = await setupCloudSDK.runCmdWithJsonFormat(
      'gcloud components list --filter Status=Installed',
    );

    const found = output.find((component: { id: string }) => {
      return component.id == expectedComponent;
    });
    expect(found).to.not.equal(undefined);
  });

  it('installs gsutil components', async function () {
    const expectedComponent = 'gsutil';
    await setupCloudSDK.installGcloudSDK(version);
    await setupCloudSDK.installComponent(expectedComponent);
    const output = await setupCloudSDK.runCmdWithJsonFormat(
      'gcloud components list --filter Status=Installed',
    );
    const installedComponents = output.map((component: { id: string }) => {
      return component.id;
    });
    expect(installedComponents).to.include(expectedComponent);
  });

  it('installs multiple components', async function () {
    const expectedComponents = ['alpha', 'cbt'];
    await setupCloudSDK.installGcloudSDK(version);
    await setupCloudSDK.installComponent(expectedComponents);
    const output = await setupCloudSDK.runCmdWithJsonFormat(
      'gcloud components list --filter Status=Installed',
    );
    const installedComponents = output.map((component: { id: string }) => {
      return component.id;
    });
    expect(installedComponents).to.include.members(expectedComponents);
  });

  it('errors with bad components', async function () {
    try {
      await setupCloudSDK.installComponent('not-a-component');
    } catch (err) {
      const message = err instanceof Error ? err.message : err;
      expect(message).include('Unable to install');
    }
  });
});
