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

/**
 * A collection of utility functions for testing.
 */
import * as path from 'path';
import * as os from 'os';
import { v4 as uuidv4 } from 'uuid';
import { promises as fs } from 'fs';

/**
 * Creates an overridden runner cache and tool path. This is slightly
 * complicated by the fact that the runner initializes its cache path exactly
 * once at startup, so this must be imported and called BEFORE the toolcache is
 * used.
 */
export class TestToolCache {
  private static paths: [string, string];

  /**
   * Creates temporary directories for the runner cache and temp, and configures
   * the Action's runner to use said directories.
   *
   * @returns two strings - first is overridden toolsPath, second is tempPath.
   */
  public static override(): [string, string] {
    if (this.paths?.length > 0) {
      return this.paths;
    }

    const rootPath = path.join(__dirname, 'runner', this.randomStr());

    const toolsPath = path.join(rootPath, 'tools');
    process.env.RUNNER_TOOL_CACHE = toolsPath;

    const tempPath = path.join(rootPath, 'temp');
    process.env.RUNNER_TEMP = tempPath;

    this.paths = [toolsPath, tempPath];
    return this.paths;
  }

  private static randomStr(): string {
    return Math.random().toString(36).substring(8);
  }
}

export const TEST_TMP_FILES_DIR = path.join(os.tmpdir(), 'test-setupcloudsdk');

/**
 * Helper to write test data to disk.
 */
export async function writeTmpFile(data: string): Promise<string> {
  const tmpDir = await fs.mkdtemp(TEST_TMP_FILES_DIR);
  const tmpFile = path.join(tmpDir, uuidv4());
  await fs.writeFile(tmpFile, data);
  return tmpFile;
}

/**
 * The version of the gcloud SDK being tested against.
 */
export const TEST_SDK_VERSIONS = [
  '0.9.83',
  '270.0.0',
  '272.0.0',
  '275.0.0',
  '349.0.0',
];

export const TEST_SDK_VERSION = TEST_SDK_VERSIONS[TEST_SDK_VERSIONS.length - 1];

export const TEST_WIF_CREDS_FILE = `
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

export const TEST_SA_KEY_CREDS_FILE = `
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
