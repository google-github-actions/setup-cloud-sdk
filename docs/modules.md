[@google-github-actions/setup-cloud-sdk](README.md) / Exports

# @google-github-actions/setup-cloud-sdk

## Table of contents

### Type Aliases

- [ExecOptions](modules.md#execoptions)
- [ExecOutput](modules.md#execoutput)

### Functions

- [authenticateGcloudSDK](modules.md#authenticategcloudsdk)
- [gcloudRun](modules.md#gcloudrun)
- [gcloudRunJSON](modules.md#gcloudrunjson)
- [getLatestGcloudSDKVersion](modules.md#getlatestgcloudsdkversion)
- [getToolCommand](modules.md#gettoolcommand)
- [installComponent](modules.md#installcomponent)
- [installGcloudSDK](modules.md#installgcloudsdk)
- [isAuthenticated](modules.md#isauthenticated)
- [isInstalled](modules.md#isinstalled)
- [isProjectIdSet](modules.md#isprojectidset)
- [parseServiceAccountKey](modules.md#parseserviceaccountkey)
- [setProject](modules.md#setproject)
- [setProjectWithKey](modules.md#setprojectwithkey)

## Type Aliases

### ExecOptions

Ƭ **ExecOptions**: `ActionsExecOptions`

ExecOptions is a type alias to core/exec ExecOptions.

#### Defined in

[index.ts:64](https://github.com/google-github-actions/setup-cloud-sdk/blob/main/src/index.ts#L64)

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

[index.ts:69](https://github.com/google-github-actions/setup-cloud-sdk/blob/main/src/index.ts#L69)

## Functions

### authenticateGcloudSDK

▸ **authenticateGcloudSDK**(`serviceAccountKey?`): `Promise`<`void`\>

Authenticates the gcloud tool using a service account key or WIF credential configuration
discovered via GOOGLE_GHA_CREDS_PATH environment variable. An optional serviceAccountKey
param is supported for legacy Actions and will take precedence over GOOGLE_GHA_CREDS_PATH.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `serviceAccountKey?` | `string` | The service account key used for authentication. |

#### Returns

`Promise`<`void`\>

#### Defined in

[index.ts:230](https://github.com/google-github-actions/setup-cloud-sdk/blob/main/src/index.ts#L230)

___

### gcloudRun

▸ **gcloudRun**(`cmd`, `options?`): `Promise`<[`ExecOutput`](modules.md#execoutput)\>

gcloudRun executes the given gcloud command using actions/exec under the
hood. It handles non-zero exit codes and throws a more semantic error on
failure.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cmd` | `string`[] | The command to run. |
| `options?` | `ExecOptions` | Any options. |

#### Returns

`Promise`<[`ExecOutput`](modules.md#execoutput)\>

ExecOutput

#### Defined in

[index.ts:85](https://github.com/google-github-actions/setup-cloud-sdk/blob/main/src/index.ts#L85)

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

[index.ts:113](https://github.com/google-github-actions/setup-cloud-sdk/blob/main/src/index.ts#L113)

___

### getLatestGcloudSDKVersion

▸ **getLatestGcloudSDKVersion**(): `Promise`<`string`\>

getLatestGcloudSDKVersion fetches the latest version number from the API.

#### Returns

`Promise`<`string`\>

The latest stable version of the gcloud SDK.

#### Defined in

[version-util.ts:35](https://github.com/google-github-actions/setup-cloud-sdk/blob/main/src/version-util.ts#L35)

___

### getToolCommand

▸ **getToolCommand**(): `string`

Returns the correct gcloud command for OS.

#### Returns

`string`

gcloud command.

#### Defined in

[index.ts:51](https://github.com/google-github-actions/setup-cloud-sdk/blob/main/src/index.ts#L51)

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

[index.ts:312](https://github.com/google-github-actions/setup-cloud-sdk/blob/main/src/index.ts#L312)

___

### installGcloudSDK

▸ **installGcloudSDK**(`version`): `Promise`<`void`\>

Installs the gcloud SDK into the actions environment.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `version` | `string` | The version being installed. |

#### Returns

`Promise`<`void`\>

The path of the installed tool.

#### Defined in

[index.ts:153](https://github.com/google-github-actions/setup-cloud-sdk/blob/main/src/index.ts#L153)

___

### isAuthenticated

▸ **isAuthenticated**(): `Promise`<`boolean`\>

Checks if gcloud is authenticated.

#### Returns

`Promise`<`boolean`\>

true is gcloud is authenticated.

#### Defined in

[index.ts:142](https://github.com/google-github-actions/setup-cloud-sdk/blob/main/src/index.ts#L142)

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

[index.ts:36](https://github.com/google-github-actions/setup-cloud-sdk/blob/main/src/index.ts#L36)

___

### isProjectIdSet

▸ **isProjectIdSet**(): `Promise`<`boolean`\>

Checks if the project Id is set in the gcloud config.

#### Returns

`Promise`<`boolean`\>

true is project Id is set.

#### Defined in

[index.ts:132](https://github.com/google-github-actions/setup-cloud-sdk/blob/main/src/index.ts#L132)

___

### parseServiceAccountKey

▸ **parseServiceAccountKey**(`serviceAccountKey`): `ServiceAccountKey`

Parses the service account string into JSON.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `serviceAccountKey` | `string` | The service account key used for authentication. |

#### Returns

`ServiceAccountKey`

ServiceAccountKey as an object.

#### Defined in

[index.ts:175](https://github.com/google-github-actions/setup-cloud-sdk/blob/main/src/index.ts#L175)

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

[index.ts:290](https://github.com/google-github-actions/setup-cloud-sdk/blob/main/src/index.ts#L290)

___

### setProjectWithKey

▸ **setProjectWithKey**(`serviceAccountKey`): `Promise`<`string`\>

Sets the GCP Project Id in the gcloud config.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `serviceAccountKey` | `string` | The service account key used for authentication. |

#### Returns

`Promise`<`string`\>

project ID.

#### Defined in

[index.ts:300](https://github.com/google-github-actions/setup-cloud-sdk/blob/main/src/index.ts#L300)
