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

/*
 * Tests format-url.
 */
import * as chai from 'chai';
import chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
const expect = chai.expect;

import { TEST_SDK_VERSIONS } from '../src/test-util';
import { getReleaseURL } from '../src/format-url';

describe('#getReleaseURL', function () {
  TEST_SDK_VERSIONS.forEach((version) => {
    describe(version, function () {
      it(`finds matching linux version`, async function () {
        const result = await getReleaseURL('linux', 'x86_64', version);
        expect(result).to.be;
      });

      it(`finds matching windows version`, async function () {
        const result = await getReleaseURL('win32', 'x86_64', version);
        expect(result).to.be;
      });

      it(`finds matching darwin version`, async function () {
        const result = await getReleaseURL('darwin', 'x86_64', version);
        expect(result).to.be;
      });

      it(`errors on unsupported OS`, async function () {
        const promise = getReleaseURL('temple', 'x86_64', version);
        expect(promise).to.eventually.be.rejected;
      });
    });
  });

  it(`errors on unsupported version`, async function () {
    const promise = getReleaseURL('linux', 'x86_64', 'NOPE');
    expect(promise).to.eventually.be.rejected;
  });
});
