[@google-github-actions/setup-cloud-sdk](README.md) / Exports

# @google-github-actions/setup-cloud-sdk

## Table of contents

### Functions

- [authenticateGcloudSDK](modules.md#authenticategcloudsdk)
- [getLatestGcloudSDKVersion](modules.md#getlatestgcloudsdkversion)
- [getToolCommand](modules.md#gettoolcommand)
- [installComponent](modules.md#installcomponent)
- [installGcloudSDK](modules.md#installgcloudsdk)
- [isAuthenticated](modules.md#isauthenticated)
- [isInstalled](modules.md#isinstalled)
- [isProjectIdSet](modules.md#isprojectidset)
- [parseServiceAccountKey](modules.md#parseserviceaccountkey)
- [runCmdWithJsonFormat](modules.md#runcmdwithjsonformat)
- [setProject](modules.md#setproject)
- [setProjectWithKey](modules.md#setprojectwithkey)

## Functions

### authenticateGcloudSDK

▸ **authenticateGcloudSDK**(`serviceAccountKey`, `silent?`): `Promise`<`number`\>

Authenticates the gcloud tool using a service account key.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `serviceAccountKey` | `string` | `undefined` | The service account key used for authentication. |
| `silent` | `boolean` | `true` | - |

#### Returns

`Promise`<`number`\>

exit code.

#### Defined in

[index.ts:182](https://github.com/google-github-actions/setup-cloud-sdk/blob/4634648/src/index.ts#L182)

___

### getLatestGcloudSDKVersion

▸ **getLatestGcloudSDKVersion**(): `Promise`<`string`\>

#### Returns

`Promise`<`string`\>

The latest stable version of the gcloud SDK.

#### Defined in

[version-util.ts:27](https://github.com/google-github-actions/setup-cloud-sdk/blob/4634648/src/version-util.ts#L27)

___

### getToolCommand

▸ **getToolCommand**(): `string`

Returns the correct gcloud command for OS.

#### Returns

`string`

gcloud command.

#### Defined in

[index.ts:49](https://github.com/google-github-actions/setup-cloud-sdk/blob/4634648/src/index.ts#L49)

___

### installComponent

▸ **installComponent**(`component`, `silent?`): `Promise`<`void`\>

Install a Cloud SDK component.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `component` | `string` \| `string`[] | `undefined` | gcloud component group to install ie alpha, beta. |
| `silent` | `boolean` | `true` | - |

#### Returns

`Promise`<`void`\>

CMD output

#### Defined in

[index.ts:250](https://github.com/google-github-actions/setup-cloud-sdk/blob/4634648/src/index.ts#L250)

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

[index.ts:119](https://github.com/google-github-actions/setup-cloud-sdk/blob/4634648/src/index.ts#L119)

___

### isAuthenticated

▸ **isAuthenticated**(`silent?`): `Promise`<`boolean`\>

Checks if gcloud is authenticated.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `silent` | `boolean` | `true` |

#### Returns

`Promise`<`boolean`\>

true is gcloud is authenticated.

#### Defined in

[index.ts:91](https://github.com/google-github-actions/setup-cloud-sdk/blob/4634648/src/index.ts#L91)

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

[index.ts:34](https://github.com/google-github-actions/setup-cloud-sdk/blob/4634648/src/index.ts#L34)

___

### isProjectIdSet

▸ **isProjectIdSet**(`silent?`): `Promise`<`boolean`\>

Checks if the project Id is set in the gcloud config.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `silent` | `boolean` | `true` |

#### Returns

`Promise`<`boolean`\>

true is project Id is set.

#### Defined in

[index.ts:64](https://github.com/google-github-actions/setup-cloud-sdk/blob/4634648/src/index.ts#L64)

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

[index.ts:141](https://github.com/google-github-actions/setup-cloud-sdk/blob/4634648/src/index.ts#L141)

___

### runCmdWithJsonFormat

▸ **runCmdWithJsonFormat**(`cmd`, `silent?`): `Promise`<`any`\>

Run a gcloud command and return output as parsed JSON.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `cmd` | `string` | `undefined` | the gcloud cmd to run. |
| `silent` | `boolean` | `true` | print output to console. |

#### Returns

`Promise`<`any`\>

CMD output

#### Defined in

[index.ts:279](https://github.com/google-github-actions/setup-cloud-sdk/blob/4634648/src/index.ts#L279)

___

### setProject

▸ **setProject**(`projectId`, `silent?`): `Promise`<`number`\>

Sets the GCP Project Id in the gcloud config.

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `projectId` | `string` | `undefined` |
| `silent` | `boolean` | `true` |

#### Returns

`Promise`<`number`\>

project ID.

#### Defined in

[index.ts:215](https://github.com/google-github-actions/setup-cloud-sdk/blob/4634648/src/index.ts#L215)

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

[index.ts:236](https://github.com/google-github-actions/setup-cloud-sdk/blob/4634648/src/index.ts#L236)
