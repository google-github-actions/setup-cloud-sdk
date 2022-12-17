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

[index.ts:74](https://github.com/google-github-actions/setup-cloud-sdk/blob/main/src/index.ts#L74)

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

[index.ts:79](https://github.com/google-github-actions/setup-cloud-sdk/blob/main/src/index.ts#L79)

## Variables

### userAgentString

• `Const` **userAgentString**: `string`

userAgentString is the UA to use for this installation. It dynamically pulls
the app version from the package declaration.

#### Defined in

[index.ts:38](https://github.com/google-github-actions/setup-cloud-sdk/blob/main/src/index.ts#L38)

## Functions

### authenticateGcloudSDK

▸ **authenticateGcloudSDK**(`filepath`): `Promise`<`void`\>

Authenticates the gcloud tool using the provided credentials file.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `filepath` | `string` | Path to the credentials file. |

#### Returns

`Promise`<`void`\>

#### Defined in

[index.ts:214](https://github.com/google-github-actions/setup-cloud-sdk/blob/main/src/index.ts#L214)

___

### computeGcloudVersion

▸ **computeGcloudVersion**(`version?`): `Promise`<`string`\>

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

`Promise`<`string`\>

String representing the latest version.

#### Defined in

[index.ts:201](https://github.com/google-github-actions/setup-cloud-sdk/blob/main/src/index.ts#L201)

___

### gcloudRun

▸ **gcloudRun**(`cmd`, `options?`): `Promise`<[`ExecOutput`](index.md#execoutput)\>

gcloudRun executes the given gcloud command using actions/exec under the
hood. It handles non-zero exit codes and throws a more semantic error on
failure.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cmd` | `string`[] | The command to run. |
| `options?` | `ExecOptions` | Any options. |

#### Returns

`Promise`<[`ExecOutput`](index.md#execoutput)\>

ExecOutput

#### Defined in

[index.ts:95](https://github.com/google-github-actions/setup-cloud-sdk/blob/main/src/index.ts#L95)

___

### gcloudRunJSON

▸ **gcloudRunJSON**(`cmd`, `options?`): `Promise`<`any`\>

gcloudRunJSON runs the gcloud command with JSON output and parses the result
as JSON. If the parsing fails, it throws an error.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cmd` | `string`[] | The command to run. |
| `options?` | `ExecOptions` | Any options. |

#### Returns

`Promise`<`any`\>

Parsed JSON as an object (or array).

#### Defined in

[index.ts:124](https://github.com/google-github-actions/setup-cloud-sdk/blob/main/src/index.ts#L124)

___

### getLatestGcloudSDKVersion

▸ **getLatestGcloudSDKVersion**(): `Promise`<`string`\>

getLatestGcloudSDKVersion fetches the latest version number from the API.

#### Returns

`Promise`<`string`\>

The latest stable version of the gcloud SDK.

#### Defined in

[index.ts:250](https://github.com/google-github-actions/setup-cloud-sdk/blob/main/src/index.ts#L250)

___

### getToolCommand

▸ **getToolCommand**(): `string`

Returns the correct gcloud command for OS.

#### Returns

`string`

gcloud command.

#### Defined in

[index.ts:61](https://github.com/google-github-actions/setup-cloud-sdk/blob/main/src/index.ts#L61)

___

### installComponent

▸ **installComponent**(`component`): `Promise`<`void`\>

Install a Cloud SDK component.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `component` | `string` \| `string`[] | gcloud component group to install ie alpha, beta. |

#### Returns

`Promise`<`void`\>

CMD output

#### Defined in

[index.ts:234](https://github.com/google-github-actions/setup-cloud-sdk/blob/main/src/index.ts#L234)

___

### installGcloudSDK

▸ **installGcloudSDK**(`version`): `Promise`<`string`\>

Installs the gcloud SDK into the actions environment.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `version` | `string` | The version being installed. |

#### Returns

`Promise`<`string`\>

The path of the installed tool.

#### Defined in

[index.ts:164](https://github.com/google-github-actions/setup-cloud-sdk/blob/main/src/index.ts#L164)

___

### isAuthenticated

▸ **isAuthenticated**(): `Promise`<`boolean`\>

Checks if gcloud is authenticated.

#### Returns

`Promise`<`boolean`\>

true is gcloud is authenticated.

#### Defined in

[index.ts:153](https://github.com/google-github-actions/setup-cloud-sdk/blob/main/src/index.ts#L153)

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

[index.ts:46](https://github.com/google-github-actions/setup-cloud-sdk/blob/main/src/index.ts#L46)

___

### isProjectIdSet

▸ **isProjectIdSet**(): `Promise`<`boolean`\>

Checks if the project Id is set in the gcloud config.

#### Returns

`Promise`<`boolean`\>

true is project Id is set.

#### Defined in

[index.ts:143](https://github.com/google-github-actions/setup-cloud-sdk/blob/main/src/index.ts#L143)

___

### setProject

▸ **setProject**(`projectId`): `Promise`<`void`\>

Sets the GCP Project Id in the gcloud config.

#### Parameters

| Name | Type |
| :------ | :------ |
| `projectId` | `string` |

#### Returns

`Promise`<`void`\>

project ID.

#### Defined in

[index.ts:224](https://github.com/google-github-actions/setup-cloud-sdk/blob/main/src/index.ts#L224)
