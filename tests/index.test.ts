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
  TEST_SA_KEY_CREDS_FILE,
  TEST_WIF_CREDS_FILE,
} from '../src/test-util';

const KEY = process.env.KEY || '';
const B64_KEY = process.env.B64_KEY || '';

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

    describe('#setProjectWithKey', () => {
      it('sets the project', async () => {
        const parsed = setupCloudSDK.parseServiceAccountKey(KEY);

        await setupCloudSDK.setProjectWithKey(KEY);
        const output = await setupCloudSDK.gcloudRunJSON(['config', 'get-value', 'core/project']);
        expect(output).to.eql(parsed.project_id);
      });
    });

    describe('#isAuthenticated', () => {
      it('returns false when not authenticated', async () => {
        const isAuth = await setupCloudSDK.isAuthenticated();
        expect(isAuth).to.eql(false);
      });

      it('returns true when authenticated', async () => {
        await setupCloudSDK.authenticateGcloudSDK(KEY);
        const isAuth = await setupCloudSDK.isAuthenticated();
        expect(isAuth).to.eql(true);
      });
    });

    describe('#authenticateGcloudSDK', () => {
      it('authenticates with a key', async () => {
        const parsed = setupCloudSDK.parseServiceAccountKey(KEY);

        await setupCloudSDK.authenticateGcloudSDK(KEY);
        const auth = await setupCloudSDK.gcloudRunJSON(['auth', 'list']);

        const { account } = auth.find((entry: { status: string }) => {
          return entry.status == 'ACTIVE';
        });

        // Assert the email address is the active account
        expect(account).to.eql(parsed.client_email);
      });

      it('runs correct command for WIF Creds via GOOGLE_GHA_CREDS_PATH', async function () {
        const credFileFixture = await writeTmpFile(TEST_WIF_CREDS_FILE);
        process.env.GOOGLE_GHA_CREDS_PATH = credFileFixture;
        const execStub = sinon
          .stub(exec, 'getExecOutput')
          .resolves({ exitCode: 0, stdout: '', stderr: '' });

        await setupCloudSDK.authenticateGcloudSDK();

        expect(execStub.args[0][1]).eql([
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
        const execStub = sinon
          .stub(exec, 'getExecOutput')
          .resolves({ exitCode: 0, stdout: '', stderr: '' });

        await setupCloudSDK.authenticateGcloudSDK();

        expect(execStub.args[0][1]).eql([
          '--quiet',
          'auth',
          'activate-service-account',
          'my-service-account@my-project.iam.gserviceaccount.com',
          '--key-file',
          '-',
        ]);

        // correct SA key passed via stdin
        expect(execStub.args[0][2]?.input).eql(
          Buffer.from(JSON.stringify(JSON.parse(TEST_SA_KEY_CREDS_FILE))),
        );
      });

      it('throws an error if GOOGLE_GHA_CREDS_PATH is invalid', async function () {
        process.env.GOOGLE_GHA_CREDS_PATH = 'invalid';

        try {
          await setupCloudSDK.authenticateGcloudSDK();
          throw new Error('expected error');
        } catch (err) {
          const message = err instanceof Error ? err.message : err;
          expect(message).to.include('no such file or directory');
        }
      });

      it('throws an error if GOOGLE_GHA_CREDS_PATH is not set and SA key is not provided', async function () {
        try {
          await setupCloudSDK.authenticateGcloudSDK();
          throw new Error('expected error');
        } catch (err) {
          const message = err instanceof Error ? err.message : err;
          expect(message).to.include(
            'Please use `google-github-actions/auth` to export credentials.',
          );
        }
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

  describe('#parseServiceAccountKey', () => {
    it('parses json', () => {
      const key = setupCloudSDK.parseServiceAccountKey(KEY);
      expect(key).to.be;
    });

    it('parses base64', () => {
      const key = setupCloudSDK.parseServiceAccountKey(B64_KEY);
      expect(key).to.be;
    });

    it('errors with bad key', () => {
      try {
        setupCloudSDK.parseServiceAccountKey('{}');
      } catch (err) {
        expect(err).include('parsing credentials');
      }
    });
  });
});
