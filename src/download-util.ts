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
 * Contains download utility functions.
 */
import * as toolCache from '@actions/tool-cache';

import { userAgentString } from './index';

/**
 * Downloads and extracts the tool at the specified URL.
 *
 * @param url The URL of the tool to be downloaded.
 * @returns The path to the locally extracted tool.
 */
export async function downloadAndExtractTool(url: string): Promise<string> {
  const downloadPath = await downloadTool(url);
  let extractedPath: string;
  if (url.indexOf('.zip') != -1) {
    extractedPath = await toolCache.extractZip(downloadPath);
  } else if (url.indexOf('.tar.gz') != -1) {
    extractedPath = await toolCache.extractTar(downloadPath);
  } else if (url.indexOf('.7z') != -1) {
    extractedPath = await toolCache.extract7z(downloadPath);
  } else {
    throw new Error(`Unexpected download archive type, downloadPath: ${downloadPath}`);
  }
  return extractedPath;
}

/**
 * downloadTool is a temporary hack until native support for module mocking
 * lands:
 *
 *     https://github.com/nodejs/node/pull/52848
 *
 * For some unknown reason, moving this call into another function makes the
 * toolCache mockable /shrug.
 */
async function downloadTool(url: string): Promise<string> {
  return await toolCache.downloadTool(url, undefined, undefined, {
    'User-Agent': userAgentString,
  });
}
