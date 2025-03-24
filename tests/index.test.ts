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
import { HttpClient, HttpClientResponse } from '@actions/http-client';
import * as io from '@actions/io';
import { randomFilename, writeSecureFile } from '@google-github-actions/actions-utils';

import * as setupCloudSDK from '../src/index';

import { TestToolCache } from '../src/test-util';

test('#setupCloudSDK', { concurrency: true }, async (suite) => {
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

    await t.test('#isProjectIdSet returns false when unset', async () => {
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

    await t.test('#isAuthenticated returns false when authenticated', async () => {
      const credFile = await writeSecureFile(
        path.join(TestToolCache.tempDir, randomFilename()),
        TEST_SA_KEY_CREDS_FILE,
      );
      await setupCloudSDK.authenticateGcloudSDK(credFile);
      const actual = await setupCloudSDK.isAuthenticated();
      assert.deepStrictEqual(actual, true);
    });

    await t.test('#authenticateGcloudSDK returns the correct command for SAKE', async (st) => {
      const credFile = await writeSecureFile(
        path.join(TestToolCache.tempDir, randomFilename()),
        TEST_SA_KEY_CREDS_FILE,
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
    });

    await t.test('#authenticateGcloudSDK returns the correct command for WIF', async (st) => {
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
    });

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
      await assert.rejects(async () => {
        await setupCloudSDK.installComponent('not-a-component');
      }, /failed to execute command/);
    });
  });
});

test('#computeGcloudVersion', { concurrency: true }, async (suite) => {
  suite.before(async () => {
    suite.mock.method(
      HttpClient.prototype,
      'get',
      httpResponse(JSON.stringify(['1.1.1', '1.1.2', '1.2.3'])),
    );
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

test('#getToolCommand', { concurrency: true }, async (suite) => {
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

test('#getLatestGcloudSDKVersion', { concurrency: true }, async (suite) => {
  suite.before(async () => {
    suite.mock.method(
      HttpClient.prototype,
      'get',
      httpResponse(JSON.stringify(['1.1.1', '1.1.2', '1.2.3', '4.5.6'])),
    );
  });

  await suite.test('retrieves the latest version', async () => {
    const actual = await setupCloudSDK.getLatestGcloudSDKVersion();
    assert.deepStrictEqual(actual, '4.5.6');
  });
});

test('#computeBestVersion', { concurrency: true }, async (suite) => {
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

const TEST_WIF_CREDS_FILE = `
{
  "audience": "//iam.googleapis.com/my-provider",
  "credential_source": {
    "format": {
      "subject_token_field_name": "value",
      "type": "json"
    },
    "headers": {
      "Authorization": "Bearer github-token"
    },
    "url": "https://actions-token.url/?audience=my-aud"
  },
  "service_account_impersonation_url": "https://iamcredentials.googleapis.com/v1/projects/-/serviceAccounts/my-service@my-project.iam.gserviceaccount.com:generateAccessToken",
  "subject_token_type": "urn:ietf:params:oauth:token-type:jwt",
  "token_url": "https://sts.googleapis.com/v1/token",
  "type": "external_account"
}
`;

const TEST_SA_KEY_CREDS_FILE = `
{
  "type": "service_account",
  "project_id": "my-project",
  "private_key_id": "1234567890abcdefghijklmnopqrstuvwxyzaabb",
  "private_key": "-----BEGIN PRIVATE KEY-----\\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQCRVYIJRuxdujaX\\nUfyY9mXT1O0M3PwyT+FnPJVY+6Md7KMiPKpZRYt7okj51Ln1FLcb9mY17LzPEAxS\\nBPn1LWNpSJpmttI/D3U+bG/znf/E89ErVopYWpaynbYrb/Mu478IE9TgvnqJMlkj\\nlQbaxnZ7qhnbI5h6p/HINWfY7xBDGZM1sc2FK9KbNfEzLdW1YiK/lWAwtfM7rbiO\\nZj+LnWm2dgwZxu0h8m68qYYMywzLcV3NTe35qdAznasc1WQvJikY+N82Wu+HjsPa\\nH0fLE3gN5r+BzDYQxEQnWANgxlsHeN9mg5LAg5fyTBwTS7Ato/qQ07da0CSoS1M0\\nriYvuCzhAgMBAAECggEAAai+m9fG5B03kIMLpY5O7Rv9AM+ufb91hx6Nwkp7r4M5\\nt11vY7I96wuYJ92iBu8m4XR6fGw0Xz3gkcQ69ZCu5320hBdPrJsrqXwMhgxgoGcq\\nWuB8aJEWASi+T9hGENA++eDQFMupWV6HafzCdxd4NKAfmZ/xf1OFUu0TVpvxKlAD\\ne6Njz/5+QFdUcNioi7iGy1Qz7xdpClEWdVin8VWe3p6UsCLfHmQfPPuLXOvpBj6k\\niFu9dl93z+8vlDLoAyXSaDeYyRMBGVOBM36cICuVpxfV1s/corEZXhz3aI8mlYiQ\\n6YXTcEnllt+NTJDIL99CnYn+WBVzeIGXtr0EKAyM6QKBgQDCU6FDvU0P8qt45BDm\\nSP2V7uMoI32mjEA3plJzqqSZ9ritxFmylrOttOoTYH2FVjrKPZZsLihSjpmm+wEz\\nGfjd75eSJYAb/m7GNOqbJjqAJIbIMaHfVcH6ODT2b0Tc8v/CK0PZy/jzgt68TdtF\\no462tr8isj7yLpCGdoLq9iq4gwKBgQC/dWTGFnaI08v1uqx6derf+qikSsjlYh4L\\nDdTlI8/eaTR90PFPQ4a8LE8pmhMhkJNg87jAF5VF29sPmlpfKbOC87C2iI8uIHcn\\nu0sTdhn6SukyUSN/eeb1KSDJuxDvIgPRTZj6XMlUulADeLRnlAoWOe0tu/wqpse6\\nB0Qu2oAfywKBgQCMWukESyro1OZit585JQj7jQJG0HOFopETYK722g5vIdM7trDu\\nm4iFc0EJ48xlTOXDgv4tfp0jG9oA0BSKuzyT1+RK64j/LyMFR90XWGIyga9T0v1O\\nmNs1BfnC8JT1XRG7RZKJMZjLEQAdU8KHJt4CPDYLMmDifR1n8RsX59rtTwKBgQCS\\nnAmsKn1gb5cqt2Tmba+LDj3feSj3hjftTQ0u3kqKTNOWWM7AXLwrEl8YQ1TNChHh\\nVyCtcCGtmhrYiuETKDK/X259iHrj3paABUsLPw/Le1uxXTKqpiV2rKTf9XCVPd3g\\ng+RWK4E8cWNeFStIebNzq630rJP/8TDWQkQzALzGGwKBgQC5bnlmipIGhtX2pP92\\niBM8fJC7QXbyYyamriyFjC3o250hHy7mZZG7bd0bH3gw0NdC+OZIBNv7AoNhjsvP\\nuE0Qp/vQXpgHEeYFyfWn6PyHGzqKLFMZ/+iCTuy8Iebs1p5DZY8RMXpx4tv6NfRy\\nbxHUjlOgP7xmXM+OZpNymFlRkg==\\n-----END PRIVATE KEY-----\\n",
  "client_email": "my-service-account@my-project.iam.gserviceaccount.com",
  "client_id": "123456789098765432101",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/my-service-account%40my-project.iam.gserviceaccount.com"
}
`;

function httpResponse(s: string): () => HttpClientResponse {
  return (): HttpClientResponse => {
    return {
      // @ts-ignore - There are many, many other fields (50+). Instead of
      // stubbing them all, ignore the TypeScript property errors and only
      // define the specific ones we need.
      message: {
        statusCode: 200,
      },
      readBody: async (): Promise<string> => {
        return s;
      },
    };
  };
}
