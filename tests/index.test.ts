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
import * as exec from '@actions/exec';
import { expect } from 'chai';
import * as sinon from 'sinon';
import * as io from '@actions/io';

import * as path from 'path';
import { promises as fs } from 'fs';
import * as os from 'os';

import {
  TestToolCache,
  writeTmpFile,
  TEST_TMP_FILES_DIR,
  TEST_WIF_CREDS_FILE,
} from '../src/test-util';

const KEY = process.env.KEY || '';

const [toolDir, tempDir] = TestToolCache.override();

describe.only('#setupCloudSDK', () => {
  before(async () => {
    await io.rmRF(toolDir);
    await io.rmRF(tempDir);
    await io.rmRF(TEST_TMP_FILES_DIR);
  });

  after(async () => {
    await io.rmRF(toolDir);
    await io.rmRF(tempDir);
    await io.rmRF(TEST_TMP_FILES_DIR);
  });

  describe('when the SDK is not installed', () => {
    describe('#isInstalled', () => {
      it('returns false', async () => {
        const isInstalled = setupCloudSDK.isInstalled();
        expect(isInstalled).to.eql(false);
      });

      it('returns false if the version is not installed', async () => {
        const isInstalled = setupCloudSDK.isInstalled('1.1.1');
        expect(isInstalled).to.eql(false);
      });
    });
  });

  describe('when the SDK is installed', () => {
    before(async () => {
      const version = await setupCloudSDK.getLatestGcloudSDKVersion();
      await setupCloudSDK.installGcloudSDK(version);
    });

    beforeEach(async () => {
      delete process.env.GOOGLE_GHA_CREDS_PATH;

      // Ensure there's a clean config directory on each run
      const tmp = os.tmpdir();
      const dir = await fs.mkdtemp(path.join(tmp, 'gha-'));
      process.env.CLOUDSDK_CONFIG = dir;
    });

    afterEach(async () => {
      sinon.restore();

      delete process.env.GOOGLE_GHA_CREDS_PATH;

      const dir = process.env.CLOUDSDK_CONFIG;
      delete process.env.CLOUDSDK_CONFIG;
      if (dir) await io.rmRF(dir);
    });

    describe('#isInstalled', () => {
      it('returns true', async () => {
        const isInstalled = setupCloudSDK.isInstalled();
        expect(isInstalled).to.eql(true);
      });

      it('returns false if the version is not installed', async () => {
        const isInstalled = setupCloudSDK.isInstalled('1.1.1');
        expect(isInstalled).to.eql(false);
      });
    });

    describe('#isProjectIdSet', () => {
      it('returns false when unset', async () => {
        const isSet = await setupCloudSDK.isProjectIdSet();
        expect(isSet).to.eql(false);
      });

      it('returns true when set', async () => {
        await setupCloudSDK.gcloudRun(['config', 'set', 'project', 'foo']);
        const isSet = await setupCloudSDK.isProjectIdSet();
        expect(isSet).to.eql(true);
      });
    });

    describe('#setProject', () => {
      it('sets the project', async () => {
        await setupCloudSDK.setProject('my-project');
        const output = await setupCloudSDK.gcloudRunJSON(['config', 'get-value', 'core/project']);
        expect(output).to.eql('my-project');
      });
    });

    describe('#isAuthenticated', () => {
      it('returns false when not authenticated', async () => {
        const isAuth = await setupCloudSDK.isAuthenticated();
        expect(isAuth).to.eql(false);
      });

      it('returns true when authenticated', async function () {
        if (!KEY) this.skip();

        const credFile = await writeTmpFile(KEY);
        await setupCloudSDK.authenticateGcloudSDK(credFile);
        const isAuth = await setupCloudSDK.isAuthenticated();
        expect(isAuth).to.eql(true);
      });
    });

    describe('#authenticateGcloudSDK', () => {
      it('runs correct authentication command for SAKE', async function () {
        if (!KEY) this.skip();

        const credFile = await writeTmpFile(KEY);
        const execStub = sinon
          .stub(exec, 'getExecOutput')
          .resolves({ exitCode: 0, stdout: '', stderr: '' });

        await setupCloudSDK.authenticateGcloudSDK(credFile);

        expect(execStub.args[0][1]).eql([
          '--quiet',
          'auth',
          'login',
          '--force',
          '--cred-file',
          credFile,
        ]);
      });

      it('runs correct authentication command for WIF', async function () {
        if (!TEST_WIF_CREDS_FILE) this.skip();

        const credFile = await writeTmpFile(TEST_WIF_CREDS_FILE);
        const execStub = sinon
          .stub(exec, 'getExecOutput')
          .resolves({ exitCode: 0, stdout: '', stderr: '' });

        await setupCloudSDK.authenticateGcloudSDK(credFile);

        expect(execStub.args[0][1]).eql([
          '--quiet',
          'auth',
          'login',
          '--force',
          '--cred-file',
          credFile,
        ]);
      });
    });

    describe('#installComponent', () => {
      it('installs multiple components', async () => {
        const expectedComponents = ['alpha', 'gsutil'];
        await setupCloudSDK.installComponent(expectedComponents);
        const output = await setupCloudSDK.gcloudRunJSON([
          'components',
          'list',
          '--filter',
          'Status=Installed',
        ]);
        const installedComponents = output.map((component: { id: string }) => {
          return component.id;
        });
        expect(installedComponents).to.include.members(expectedComponents);
      });

      it('errors with bad components', async () => {
        try {
          await setupCloudSDK.installComponent('not-a-component');
        } catch (err) {
          const message = err instanceof Error ? err.message : err;
          expect(message).include('failed to execute command');
        }
      });
    });
  });

  describe('#getToolCommand', () => {
    afterEach(() => {
      sinon.restore();
    });

    it('returns gcloud.cmd on windows', () => {
      sinon.stub(process, 'platform').value('win32');
      const cmd = setupCloudSDK.getToolCommand();
      expect(cmd).to.eql('gcloud.cmd');
    });

    it('returns gcloud on linux', () => {
      sinon.stub(process, 'platform').value('linux');
      const cmd = setupCloudSDK.getToolCommand();
      expect(cmd).to.eql('gcloud');
    });

    it('returns gcloud on darwin', () => {
      sinon.stub(process, 'platform').value('darwin');
      const cmd = setupCloudSDK.getToolCommand();
      expect(cmd).to.eql('gcloud');
    });
  });
});
