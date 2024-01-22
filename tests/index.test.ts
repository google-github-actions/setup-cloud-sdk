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

import * as path from 'path';
import { promises as fs } from 'fs';
import * as os from 'os';

import * as core from '@actions/core';
import * as exec from '@actions/exec';
import { HttpClient } from '@actions/http-client';
import * as io from '@actions/io';
import { randomFilename, writeSecureFile } from '@google-github-actions/actions-utils';

import * as setupCloudSDK from '../src/index';

import { TestToolCache, TEST_WIF_CREDS_FILE } from '../src/test-util';

const SERVICE_ACCOUNT_KEY_JSON = process.env.SERVICE_ACCOUNT_KEY_JSON || '';

const skipIfMissingEnv = (...envs: string[]): string | boolean => {
  for (const env of envs) {
    if (!(env in process.env)) {
      return `missing $${env}`;
    }
  }

  return false;
};

test('#setupCloudSDK', async (suite) => {
  suite.before(() => {
    suite.mock.method(core, 'debug', () => {});
    suite.mock.method(core, 'info', () => {});
    suite.mock.method(core, 'warning', () => {});
    suite.mock.method(core, 'setOutput', () => {});
    suite.mock.method(core, 'setSecret', () => {});
    suite.mock.method(core, 'group', () => {});
    suite.mock.method(core, 'startGroup', () => {});
    suite.mock.method(core, 'endGroup', () => {});
  });

  await suite.test('when the SDK is not installed', async (t) => {
    t.before(async () => {
      await TestToolCache.start();
    });

    t.after(async () => {
      await TestToolCache.stop();
    });

    await t.test('#isInstalled returns false', async () => {
      const actual = setupCloudSDK.isInstalled();
      assert.deepStrictEqual(actual, false);
    });

    await t.test('#isInstalled returns false if the version is not installed', async () => {
      const actual = setupCloudSDK.isInstalled('1.1.1');
      assert.deepStrictEqual(actual, false);
    });
  });

  await suite.test('when the SDK is installed', async (t) => {
    t.before(async () => {
      await TestToolCache.start();

      const version = await setupCloudSDK.getLatestGcloudSDKVersion();
      await setupCloudSDK.installGcloudSDK(version);
    });

    t.beforeEach(async () => {
      delete process.env.GOOGLE_GHA_CREDS_PATH;

      // Ensure there's a clean config directory on each run
      const tmp = os.tmpdir();
      const dir = await fs.mkdtemp(path.join(tmp, 'gha-'));
      process.env.CLOUDSDK_CONFIG = dir;
    });

    t.afterEach(async () => {
      delete process.env.GOOGLE_GHA_CREDS_PATH;
      const dir = process.env.CLOUDSDK_CONFIG;

      delete process.env.CLOUDSDK_CONFIG;
      if (dir) await io.rmRF(dir);
    });

    t.after(async () => {
      await TestToolCache.stop();
    });

    await t.test('#isInstalled returns true', async () => {
      const actual = setupCloudSDK.isInstalled();
      assert.deepStrictEqual(actual, true);
    });

    await t.test('#isInstalled returns false if the version is not installed', async () => {
      const actual = setupCloudSDK.isInstalled('1.1.1');
      assert.deepStrictEqual(actual, false);
    });

    await t.test('#isProjectIdSet returns false when unsett', async () => {
      const actual = await setupCloudSDK.isProjectIdSet();
      assert.deepStrictEqual(actual, false);
    });

    await t.test('#isProjectIdSet returns true when set', async () => {
      await setupCloudSDK.gcloudRun(['config', 'set', 'project', 'foo']);
      const actual = await setupCloudSDK.isProjectIdSet();
      assert.deepStrictEqual(actual, true);
    });

    await t.test('#setProject sets the project ID', async () => {
      await setupCloudSDK.setProject('my-project');
      const actual = await setupCloudSDK.gcloudRunJSON(['config', 'get-value', 'core/project']);
      assert.deepStrictEqual(actual, 'my-project');
    });

    await t.test('#isAuthenticated returns false when not authenticated', async () => {
      const actual = await setupCloudSDK.isAuthenticated();
      assert.deepStrictEqual(actual, false);
    });

    await t.test(
      '#isAuthenticated returns false when authenticated',
      { skip: skipIfMissingEnv('SERVICE_ACCOUNT_KEY_JSON') },
      async () => {
        const credFile = await writeSecureFile(
          path.join(TestToolCache.tempDir, randomFilename()),
          SERVICE_ACCOUNT_KEY_JSON,
        );
        await setupCloudSDK.authenticateGcloudSDK(credFile);
        const actual = await setupCloudSDK.isAuthenticated();
        assert.deepStrictEqual(actual, true);
      },
    );

    await t.test(
      '#authenticateGcloudSDK returns the correct command for SAKE',
      { skip: skipIfMissingEnv('SERVICE_ACCOUNT_KEY_JSON') },
      async (st) => {
        const credFile = await writeSecureFile(
          path.join(TestToolCache.tempDir, randomFilename()),
          SERVICE_ACCOUNT_KEY_JSON,
        );

        const execStub = st.mock.method(exec, 'getExecOutput', () => {
          return { exitCode: 0, stdout: '', stderr: '' };
        });

        await setupCloudSDK.authenticateGcloudSDK(credFile);
        const args = execStub.mock.calls.at(0)?.arguments?.at(1);
        assert.deepStrictEqual(args, [
          '--quiet',
          'auth',
          'login',
          '--force',
          '--cred-file',
          credFile,
        ]);
      },
    );

    await t.test(
      '#authenticateGcloudSDK returns the correct command for WIF',
      { skip: skipIfMissingEnv('TEST_WIF_CREDS_FILE') },
      async (st) => {
        const credFile = await writeSecureFile(
          path.join(TestToolCache.tempDir, randomFilename()),
          TEST_WIF_CREDS_FILE,
        );

        const execStub = st.mock.method(exec, 'getExecOutput', () => {
          return { exitCode: 0, stdout: '', stderr: '' };
        });

        await setupCloudSDK.authenticateGcloudSDK(credFile);
        const args = execStub.mock.calls.at(0)?.arguments?.at(1);
        assert.deepStrictEqual(args, [
          '--quiet',
          'auth',
          'login',
          '--force',
          '--cred-file',
          credFile,
        ]);
      },
    );

    await t.test('installs multiple components', async () => {
      const expectedComponents = ['gcloud-crc32c', 'package-go-module'];
      await setupCloudSDK.installComponent(expectedComponents);
      const actual = await setupCloudSDK.gcloudRunJSON([
        'components',
        'list',
        '--filter',
        'Status=Installed',
      ]);
      const installedComponents = actual
        .map((component: { id: string }) => {
          return component.id;
        })
        .sort() as string[];

      const subset = installedComponents.filter((c) => expectedComponents.includes(c)).sort();
      assert.deepStrictEqual(subset, expectedComponents);
    });

    await t.test('errors with bad components', async () => {
      assert.rejects(async () => {
        await setupCloudSDK.installComponent('not-a-component');
      }, /failed to execute command/);
    });
  });
});

test('#computeGcloudVersion', async (suite) => {
  suite.before(async () => {
    suite.mock.method(HttpClient.prototype, 'get', () => {
      return {
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
      };
    });
  });

  const cases = [
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

  for await (const tc of cases) {
    await suite.test(tc.name, async () => {
      const actual = await setupCloudSDK.computeGcloudVersion(tc.input);
      assert.deepStrictEqual(actual, tc.expected);
    });
  }
});

test('#getToolCommand', async (suite) => {
  const originalPlatform = process.platform;

  suite.afterEach(async () => {
    Object.defineProperty(process, 'platform', { value: originalPlatform });
  });

  await suite.test('returns gcloud.cmd on windows', async () => {
    Object.defineProperty(process, 'platform', {
      value: 'win32',
    });
    const cmd = setupCloudSDK.getToolCommand();
    assert.deepStrictEqual(cmd, 'gcloud.cmd');
  });

  await suite.test('returns gcloud on linux', async () => {
    Object.defineProperty(process, 'platform', {
      value: 'linux',
    });
    const cmd = setupCloudSDK.getToolCommand();
    assert.deepStrictEqual(cmd, 'gcloud');
  });

  await suite.test('returns gcloud on darwin', async () => {
    Object.defineProperty(process, 'platform', {
      value: 'darwin',
    });
    const cmd = setupCloudSDK.getToolCommand();
    assert.deepStrictEqual(cmd, 'gcloud');
  });
});

test('#getLatestGcloudSDKVersion', async (suite) => {
  await suite.test('retrieves the latest version', async () => {
    const semVerPattern = /^[0-9]+\.[0-9]+\.[0-9]+$/;
    const actual = await setupCloudSDK.getLatestGcloudSDKVersion();
    assert.match(actual, semVerPattern);
  });
});

test('#computeBestVersion', async (suite) => {
  await suite.test('returns the latest available version', async () => {
    const actual = setupCloudSDK.computeBestVersion('> 1.2.3', [
      '1.0.0',
      '1.2.2',
      '1.2.3',
      '1.2.4',
    ]);
    assert.deepStrictEqual(actual, '1.2.4');
  });

  await suite.test('returns an exact version', async () => {
    const actual = setupCloudSDK.computeBestVersion('1.2.2', ['1.0.0', '1.2.2', '1.2.3', '1.2.4']);
    assert.deepStrictEqual(actual, '1.2.2');
  });

  await suite.test('throws an error when there are no matches', async () => {
    assert.throws(() => {
      setupCloudSDK.computeBestVersion('> 50.1', ['1.0.0', '1.2.2', '1.2.3', '1.2.4']);
    }, /failed to find any versions matching "> 50.1"/);
  });
});
