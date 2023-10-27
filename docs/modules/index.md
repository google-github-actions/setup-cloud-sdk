[@google-github-actions/setup-cloud-sdk](../README.md) / [Exports](../modules.md) / index

# Module: index

## Table of contents

### References

- [TEST\_SA\_KEY\_CREDS\_FILE](index.md#test_sa_key_creds_file)
- [TEST\_SDK\_VERSION](index.md#test_sdk_version)
- [TEST\_SDK\_VERSIONS](index.md#test_sdk_versions)
- [TEST\_WIF\_CREDS\_FILE](index.md#test_wif_creds_file)
- [TestToolCache](index.md#testtoolcache)

### Type Aliases

- [ExecOptions](index.md#execoptions)
- [ExecOutput](index.md#execoutput)

### Variables

- [userAgentString](index.md#useragentstring)

### Functions

- [authenticateGcloudSDK](index.md#authenticategcloudsdk)
- [bestVersion](index.md#bestversion)
- [computeBestVersion](index.md#computebestversion)
- [computeGcloudVersion](index.md#computegcloudversion)
- [gcloudRun](index.md#gcloudrun)
- [gcloudRunJSON](index.md#gcloudrunjson)
- [getLatestGcloudSDKVersion](index.md#getlatestgcloudsdkversion)
- [getToolCommand](index.md#gettoolcommand)
- [installComponent](index.md#installcomponent)
- [installGcloudSDK](index.md#installgcloudsdk)
- [isAuthenticated](index.md#isauthenticated)
- [isInstalled](index.md#isinstalled)
- [isProjectIdSet](index.md#isprojectidset)
- [setProject](index.md#setproject)

## References

### TEST\_SA\_KEY\_CREDS\_FILE

Re-exports [TEST_SA_KEY_CREDS_FILE](test_util.md#test_sa_key_creds_file)

___

### TEST\_SDK\_VERSION

Re-exports [TEST_SDK_VERSION](test_util.md#test_sdk_version)

___

### TEST\_SDK\_VERSIONS

Re-exports [TEST_SDK_VERSIONS](test_util.md#test_sdk_versions)

___

### TEST\_WIF\_CREDS\_FILE

Re-exports [TEST_WIF_CREDS_FILE](test_util.md#test_wif_creds_file)

___

### TestToolCache

Re-exports [TestToolCache](../classes/test_util.TestToolCache.md)

## Type Aliases

### ExecOptions

Ƭ **ExecOptions**: `ActionsExecOptions`

ExecOptions is a type alias to core/exec ExecOptions.

#### Defined in

[index.ts:78](https://github.com/google-github-actions/setup-cloud-sdk/blob/main/src/index.ts#L78)

___

### ExecOutput

Ƭ **ExecOutput**: `Object`

ExecOutput is the output returned from a gcloud exec.

#### Type declaration

| Name | Type |
| :------ | :------ |
| `output` | `string` |
| `stderr` | `string` |
| `stdout` | `string` |

#### Defined in

[index.ts:83](https://github.com/google-github-actions/setup-cloud-sdk/blob/main/src/index.ts#L83)

## Variables

### userAgentString

• `Const` **userAgentString**: `string`

userAgentString is the UA to use for this installation. It dynamically pulls
the app version from the package declaration.

#### Defined in

[index.ts:42](https://github.com/google-github-actions/setup-cloud-sdk/blob/main/src/index.ts#L42)

## Functions

### authenticateGcloudSDK

▸ **authenticateGcloudSDK**(`filepath`): `Promise`\<`void`\>

Authenticates the gcloud tool using the provided credentials file.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `filepath` | `string` | Path to the credentials file. |

#### Returns

`Promise`\<`void`\>

#### Defined in

[index.ts:225](https://github.com/google-github-actions/setup-cloud-sdk/blob/main/src/index.ts#L225)

___

### bestVersion

▸ **bestVersion**(`spec`): `Promise`\<`string`\>

bestVersion takes a version constraint and gets the latest available version
that satisfies the constraint.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `spec` | `string` | Version specification |

#### Returns

`Promise`\<`string`\>

Resolved version

#### Defined in

[index.ts:272](https://github.com/google-github-actions/setup-cloud-sdk/blob/main/src/index.ts#L272)

___

### computeBestVersion

▸ **computeBestVersion**(`spec`, `versions`): `string`

computeBestVersion computes the latest available version that still satisfies
the spec. This is a helper function and is only exported for testing.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `spec` | `string` | Version specification |
| `versions` | `string`[] | List of versions |

#### Returns

`string`

Best version or an error if no matches are found

#### Defined in

[index.ts:302](https://github.com/google-github-actions/setup-cloud-sdk/blob/main/src/index.ts#L302)

___

### computeGcloudVersion

▸ **computeGcloudVersion**(`version?`): `Promise`\<`string`\>

computeGcloudVersion computes the appropriate gcloud version for the given
string. If the string is the empty string or the special value "latest", it
returns the latest known version of the Google Cloud SDK. Otherwise it
returns the provided string. It does not validate that the string is a valid
version.

This is most useful when accepting user input which should default to
"latest" or the empty string when you want the latest version to be
installed, but still want users to be able to choose a specific version to
install as a customization.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `version?` | `string` | String (or undefined) version. The empty string or other falsey values will return the latest gcloud version. |

#### Returns

`Promise`\<`string`\>

String representing the latest version.

**`Deprecated`**

Callers should use `installGcloudSDK('> 0.0.0.')` instead.

#### Defined in

[index.ts:212](https://github.com/google-github-actions/setup-cloud-sdk/blob/main/src/index.ts#L212)

___

### gcloudRun

▸ **gcloudRun**(`cmd`, `options?`): `Promise`\<[`ExecOutput`](index.md#execoutput)\>

gcloudRun executes the given gcloud command using actions/exec under the
hood. It handles non-zero exit codes and throws a more semantic error on
failure.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cmd` | `string`[] | The command to run. |
| `options?` | `ExecOptions` | Any options. |

#### Returns

`Promise`\<[`ExecOutput`](index.md#execoutput)\>

ExecOutput

#### Defined in

[index.ts:99](https://github.com/google-github-actions/setup-cloud-sdk/blob/main/src/index.ts#L99)

___

### gcloudRunJSON

▸ **gcloudRunJSON**(`cmd`, `options?`): `Promise`\<`any`\>

gcloudRunJSON runs the gcloud command with JSON output and parses the result
as JSON. If the parsing fails, it throws an error.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cmd` | `string`[] | The command to run. |
| `options?` | `ExecOptions` | Any options. |

#### Returns

`Promise`\<`any`\>

Parsed JSON as an object (or array).

#### Defined in

[index.ts:128](https://github.com/google-github-actions/setup-cloud-sdk/blob/main/src/index.ts#L128)

___

### getLatestGcloudSDKVersion

▸ **getLatestGcloudSDKVersion**(): `Promise`\<`string`\>

getLatestGcloudSDKVersion fetches the latest version number from the API.

#### Returns

`Promise`\<`string`\>

The latest stable version of the gcloud SDK.

#### Defined in

[index.ts:261](https://github.com/google-github-actions/setup-cloud-sdk/blob/main/src/index.ts#L261)

___

### getToolCommand

▸ **getToolCommand**(): `string`

Returns the correct gcloud command for OS.

#### Returns

`string`

gcloud command.

#### Defined in

[index.ts:65](https://github.com/google-github-actions/setup-cloud-sdk/blob/main/src/index.ts#L65)

___

### installComponent

▸ **installComponent**(`component`): `Promise`\<`void`\>

Install a Cloud SDK component.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `component` | `string` \| `string`[] | gcloud component group to install ie alpha, beta. |

#### Returns

`Promise`\<`void`\>

CMD output

#### Defined in

[index.ts:245](https://github.com/google-github-actions/setup-cloud-sdk/blob/main/src/index.ts#L245)

___

### installGcloudSDK

▸ **installGcloudSDK**(`version`): `Promise`\<`string`\>

Installs the gcloud SDK into the actions environment.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `version` | `string` | The version or version specification to install. If a specification is given, the most recent version that still matches the specification is installed. |

#### Returns

`Promise`\<`string`\>

The path of the installed tool.

#### Defined in

[index.ts:170](https://github.com/google-github-actions/setup-cloud-sdk/blob/main/src/index.ts#L170)

___

### isAuthenticated

▸ **isAuthenticated**(): `Promise`\<`boolean`\>

Checks if gcloud is authenticated.

#### Returns

`Promise`\<`boolean`\>

true is gcloud is authenticated.

#### Defined in

[index.ts:157](https://github.com/google-github-actions/setup-cloud-sdk/blob/main/src/index.ts#L157)

___

### isInstalled

▸ **isInstalled**(`version?`): `boolean`

Checks if gcloud is installed.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `version?` | `string` | (Optional) Cloud SDK version. |

#### Returns

`boolean`

true if gcloud is found in toolpath.

#### Defined in

[index.ts:50](https://github.com/google-github-actions/setup-cloud-sdk/blob/main/src/index.ts#L50)

___

### isProjectIdSet

▸ **isProjectIdSet**(): `Promise`\<`boolean`\>

Checks if the project Id is set in the gcloud config.

#### Returns

`Promise`\<`boolean`\>

true is project Id is set.

#### Defined in

[index.ts:147](https://github.com/google-github-actions/setup-cloud-sdk/blob/main/src/index.ts#L147)

___

### setProject

▸ **setProject**(`projectId`): `Promise`\<`void`\>

Sets the GCP Project Id in the gcloud config.

#### Parameters

| Name | Type |
| :------ | :------ |
| `projectId` | `string` |

#### Returns

`Promise`\<`void`\>

project ID.

#### Defined in

[index.ts:235](https://github.com/google-github-actions/setup-cloud-sdk/blob/main/src/index.ts#L235)
