@google-github-actions/setup-cloud-sdk / [Exports](modules.md)

# [Google GitHub actions: Setup Cloud SDK Client](https://github.com/google-github-actions)

Setup Cloud SDK for GitHub Actions API client for Node.js

A comprehensive list of changes in each version may be found in
[the CHANGELOG](https://github.com/google-github-actions/setup-cloud-sdk/blob/master/CHANGELOG.md).

* [Client API Reference](./docs/modules.md)

**Table of contents:**

* [Installing the client library](#installing-the-client-library)
* [Using the client library](#using-the-client-library)
* [Versioning](#versioning)
* [Contributing](#contributing)
* [License](#license)

### Installing the client library

```bash
npm install @google-github-actions/setup-cloud-sdk
```

### Using the client library

```TS
import * as core from '@actions/core';
import * as toolCache from '@actions/tool-cache';
import * as setupGcloud from '@google-github-actions/setup-cloud-sdk';

// Install gcloud if not already installed.
const gcloudVersion = await setupGcloud.getLatestGcloudSDKVersion();

if (!setupGcloud.isInstalled(gcloudVersion)) {
    await setupGcloud.installGcloudSDK(gcloudVersion);
} else {
    const toolPath = toolCache.find('gcloud', gcloudVersion);
    core.addPath(path.join(toolPath, 'bin'));
}

// Authenticate gcloud SDK.
if (credentials) await setupGcloud.authenticateGcloudSDK(credentials);

const authenticated = await setupGcloud.isAuthenticated();
if (!authenticated) {
    throw new Error('Error authenticating the Cloud SDK.');
}

const toolCommand = setupGcloud.getToolCommand();
```

## Versioning

This library follows [Semantic Versioning](http://semver.org/).

## Contributing

Contributions welcome! See the [Contributing Guide](./CONTRIBUTING.md).

## License

Apache Version 2.0

See [LICENSE](./LICENSE)
