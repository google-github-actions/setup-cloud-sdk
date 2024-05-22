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
import * as fs from 'fs/promises';
import * as path from 'path';

import { forceRemove, randomFilename } from '@google-github-actions/actions-utils';

/**
 * Creates an overridden runner cache and tool path. This is slightly
 * complicated by the fact that the runner initializes its cache path exactly
 * once at startup, so this must be imported and called BEFORE the toolcache is
 * used.
 */
export class TestToolCache {
  public static rootDir: string;
  public static toolsDir: string;
  public static tempDir: string;

  static #originalToolsDir?: string;
  static #originalTempDir?: string;

  /**
   * Creates temporary directories for the runner cache and temp.
   */
  public static async start() {
    this.#originalToolsDir = process.env.RUNNER_TOOL_CACHE;
    this.#originalTempDir = process.env.RUNNER_TEMP;

    this.setGlobal('TEST_DOWNLOAD_TOOL_RETRY_MIN_SECONDS', '0');
    this.setGlobal('TEST_DOWNLOAD_TOOL_RETRY_MAX_SECONDS', '0');

    this.rootDir = path.join(__dirname, 'runner', randomFilename());

    this.toolsDir = path.join(this.rootDir, 'tools');
    await fs.mkdir(this.toolsDir, { recursive: true });
    process.env.RUNNER_TOOL_CACHE = this.toolsDir;

    this.tempDir = path.join(this.rootDir, 'temp');
    await fs.mkdir(this.tempDir, { recursive: true });
    process.env.RUNNER_TEMP = this.toolsDir;
  }

  /**
   * Restores the Action's runner to use the original directories and deletes
   * the temporary files.
   **/
  public static async stop() {
    process.env.RUNNER_TOOL_CACHE = this.#originalToolsDir;
    process.env.RUNNER_TEMP = this.#originalTempDir;
    delete process.env.TEST_DOWNLOAD_TOOL_RESPONSE_MESSAGE_FACTORY;

    this.setGlobal('TEST_DOWNLOAD_TOOL_RETRY_MIN_SECONDS', undefined);
    this.setGlobal('TEST_DOWNLOAD_TOOL_RETRY_MAX_SECONDS', undefined);
    this.setGlobal('TEST_DOWNLOAD_TOOL_RESPONSE_MESSAGE_FACTORY', undefined);

    await forceRemove(this.rootDir);
  }

  private static setGlobal<T>(k: string, v: T | undefined) {
    const g = global as any;
    if (v === undefined) {
      delete g[k];
    } else {
      g[k] = v;
    }
  }
}
