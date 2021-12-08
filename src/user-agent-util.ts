'use strict';

// Do not listen to the linter - this can NOT be rewritten as an ES6 import statement.
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { version: appVersion } = require('../package.json');

/**
 * userAgentString is the UA to use for this installation. It dynamically pulls
 * the app version from the package declaration.
 */
export const userAgentString = `google-github-actions:setup-cloud-sdk/${appVersion}`;
