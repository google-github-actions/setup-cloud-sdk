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

// archMap is a mapping of how node detects an operating system to the
// associated cloud sdk architecture value.
const archMap: Record<string, string> = {
  x64: 'x86_64',
  arm64: 'arm',
};

/**
 * buildReleaseURL builds the URL at which to dowbnload the gcloud SDK,
 * according to the specified arguments.
 *
 * @param os The OS of the requested release.
 * @param arch The system architecture of the requested release.
 * @param version The version of the requested release.
 * @returns The formatted gcloud SDK release URL.
 */
export function buildReleaseURL(os: string, arch: string, version: string): string {
  // massage the arch to match gcloud sdk conventions
  if (archMap[arch]) {
    arch = archMap[arch];
  }

  let objectName: string;
  switch (os) {
    case 'linux':
      objectName = `google-cloud-sdk-${version}-linux-${arch}.tar.gz`;
      break;
    case 'darwin':
      objectName = `google-cloud-sdk-${version}-darwin-${arch}.tar.gz`;
      break;
    case 'win32':
      objectName = `google-cloud-sdk-${version}-windows-${arch}.zip`;
      break;
    default:
      throw new Error(`Unexpected OS '${os}'`);
  }

  return `https://dl.google.com/dl/cloudsdk/channels/rapid/downloads/${encodeURI(objectName)}`;
}
