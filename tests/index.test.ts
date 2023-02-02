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
import * as sinon from 'sinon';

import * as path from 'path';
import { promises as fs } from 'fs';
import * as os from 'os';

import * as core from '@actions/core';
import * as exec from '@actions/exec';
import { HttpClient } from '@actions/http-client';
import * as io from '@actions/io';
import {
  errorMessage,
  randomFilename,
  writeSecureFile,
} from '@google-github-actions/actions-utils';

import * as setupCloudSDK from '../src/index';

import { TestToolCache, TEST_WIF_CREDS_FILE } from '../src/test-util';

const SERVICE_ACCOUNT_KEY_JSON = process.env.SERVICE_ACCOUNT_KEY_JSON || '';

describe('#setupCloudSDK', () => {
  beforeEach(async () => {
    sinon.stub(core, 'debug').callsFake(sinon.fake());
    sinon.stub(core, 'endGroup').callsFake(sinon.fake());
    sinon.stub(core, 'info').callsFake(sinon.fake());
    sinon.stub(core, 'startGroup').callsFake(sinon.fake());
    sinon.stub(core, 'warning').callsFake(sinon.fake());
  });

  afterEach(async () => {
    sinon.restore();
  });

  describe('when the SDK is not installed', () => {
    before(async () => {
      await TestToolCache.start();
    });

    after(async () => {
      await TestToolCache.stop();
    });

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
      await TestToolCache.start();

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

    after(async () => {
      await TestToolCache.stop();
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
        if (!SERVICE_ACCOUNT_KEY_JSON) this.skip();

        const credFile = await writeSecureFile(
          path.join(TestToolCache.tempDir, randomFilename()),
          SERVICE_ACCOUNT_KEY_JSON,
        );
        await setupCloudSDK.authenticateGcloudSDK(credFile);
        const isAuth = await setupCloudSDK.isAuthenticated();
        expect(isAuth).to.eql(true);
      });
    });

    describe('#authenticateGcloudSDK', () => {
      it('runs correct authentication command for SAKE', async function () {
        if (!SERVICE_ACCOUNT_KEY_JSON) this.skip();

        const credFile = await writeSecureFile(
          path.join(TestToolCache.tempDir, randomFilename()),
          SERVICE_ACCOUNT_KEY_JSON,
        );
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

        const credFile = await writeSecureFile(
          path.join(TestToolCache.tempDir, randomFilename()),
          TEST_WIF_CREDS_FILE,
        );
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
        const expectedComponents = ['gcloud-crc32c', 'package-go-module'];
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

  describe('#computeGcloudVersion', () => {
    beforeEach(async () => {
      sinon.stub(HttpClient.prototype, 'get').resolves({
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore - There are many, many other fields (50+). Instead of
        // stubbing them all, ignore the TypeScript property errors and only
        // define the specific ones we need.
        message: {
          statusCode: 200,
        },
        readBody: async (): Promise<string> => {
          return `["1.1.1", "1.1.2", "1.2.3"]`;
        },
      });
    });

    afterEach(async () => {
      sinon.restore();
    });

    const cases: {
      only?: boolean;
      name: string;
      input: string | undefined;
      expected?: string;
    }[] = [
      {
        name: 'empty string',
        input: '',
        expected: '1.2.3',
      },
      {
        name: 'padded string',
        input: '   ',
        expected: '1.2.3',
      },
      {
        name: 'latest',
        input: 'latest',
        expected: '1.2.3',
      },
      {
        name: 'custom',
        input: '5.6.7',
        expected: '5.6.7',
      },
      {
        name: 'custom padded',
        input: ' 5.6.7  ',
        expected: '5.6.7',
      },
    ];

    cases.forEach((tc) => {
      const fn = tc.only ? it.only : it;
      fn(tc.name, async () => {
        const version = await setupCloudSDK.computeGcloudVersion(tc.input);
        expect(version).to.eql(tc.expected);
      });
    });
  });

  describe('#getToolCommand', () => {
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

  describe('#getLatestGcloudSDKVersion', () => {
    it('retrieves the latest version', async () => {
      const semVerPattern = /^[0-9]+\.[0-9]+\.[0-9]+$/;
      const result = await setupCloudSDK.getLatestGcloudSDKVersion();
      expect(result).to.be;
      expect(result).to.match(semVerPattern);
    });
  });

  describe('#computeBestVersion', () => {
    it('returns the latest available version', () => {
      const result = setupCloudSDK.computeBestVersion('> 1.2.3', [
        '1.0.0',
        '1.2.2',
        '1.2.3',
        '1.2.4',
      ]);
      expect(result).to.eql('1.2.4');
    });

    it('returns an exact version', () => {
      const result = setupCloudSDK.computeBestVersion('1.2.2', [
        '1.0.0',
        '1.2.2',
        '1.2.3',
        '1.2.4',
      ]);
      expect(result).to.eql('1.2.2');
    });

    it('throws an error when there are no matches', () => {
      try {
        setupCloudSDK.computeBestVersion('> 50.1', ['1.0.0', '1.2.2', '1.2.3', '1.2.4']);
        throw new Error(`no exception`);
      } catch (e) {
        const msg = errorMessage(e);
        expect(msg).to.eql('failed to find any versions matching "> 50.1"');
      }
    });
  });
});
