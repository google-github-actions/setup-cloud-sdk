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
import * as io from '@actions/io';
import {
  TestToolCache,
  TEST_SDK_VERSION,
  TEST_SDK_VERSIONS,
} from '../src/test-util';

const { KEY, B64_KEY, PROJECT_ID, RUNNER_OS } = process.env;
const [toolDir, tempDir] = TestToolCache.override();

describe('#setupCloudSDK', function () {
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
    const installed = setupCloudSDK.isInstalled(
      TEST_SDK_VERSIONS[TEST_SDK_VERSIONS.length - 2],
    );

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
    await setupCloudSDK.setProject(PROJECT_ID!);
    const isSet = await setupCloudSDK.isProjectIdSet();
    expect(isSet).eql(true);
    const output = await setupCloudSDK.runCmdWithJsonFormat(
      'gcloud config list',
    );
    expect(output.core.project).eql(PROJECT_ID);
  });

  it('returns true if authenticated', async function () {
    await setupCloudSDK.installGcloudSDK(version);
    await setupCloudSDK.authenticateGcloudSDK(KEY!);
    const isAuth = await setupCloudSDK.isAuthenticated();
    expect(isAuth).eql(true);
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
    const key = setupCloudSDK.parseServiceAccountKey(KEY!);
    expect(key).not.eql(undefined);
  });

  it('parses a base64 key', async function () {
    const key = setupCloudSDK.parseServiceAccountKey(B64_KEY!);
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
    await setupCloudSDK.authenticateGcloudSDK(KEY!);
    const isAuth = await setupCloudSDK.isAuthenticated();
    expect(isAuth).eql(true);
  });

  it('sets the Project Id', async function () {
    await setupCloudSDK.installGcloudSDK(version);
    await setupCloudSDK.setProject(PROJECT_ID!);
    const output = await setupCloudSDK.runCmdWithJsonFormat(
      'gcloud config list',
    );
    expect(output.core.project).eql(PROJECT_ID);
  });

  it('sets the Project Id from key', async function () {
    await setupCloudSDK.installGcloudSDK(version);
    await setupCloudSDK.setProjectWithKey(KEY!);
    const output = await setupCloudSDK.runCmdWithJsonFormat(
      'gcloud config list',
    );
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
    const found = output.find((component: { id: string }) => {
      return component.id == expectedComponent;
    });
    expect(found).to.not.equal(undefined);
  });

  it('installs multiple components', async function () {
    const expectedComponents = ['alpha', 'cbt'];
    await setupCloudSDK.installGcloudSDK(version);
    await setupCloudSDK.installComponent(expectedComponents);
    const output = await setupCloudSDK.runCmdWithJsonFormat(
      'gcloud components list --filter Status=Installed',
    );
    const found = output.filter((component: { id: string }) => {
      return expectedComponents.includes(component.id);
    });
    expect(found.length > 0).to.equal(true);
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
