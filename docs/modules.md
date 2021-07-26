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

[index.ts:186](https://github.com/google-github-actions/setup-cloud-sdk/blob/73fe456/src/index.ts#L186)

___

### getLatestGcloudSDKVersion

▸ **getLatestGcloudSDKVersion**(): `Promise`<`string`\>

#### Returns

`Promise`<`string`\>

The latest stable version of the gcloud SDK.

#### Defined in

[version-util.ts:27](https://github.com/google-github-actions/setup-cloud-sdk/blob/73fe456/src/version-util.ts#L27)

___

### getToolCommand

▸ **getToolCommand**(): `string`

Returns the correct gcloud command for OS.

#### Returns

`string`

gcloud command.

#### Defined in

[index.ts:52](https://github.com/google-github-actions/setup-cloud-sdk/blob/73fe456/src/index.ts#L52)

___

### installComponent

▸ **installComponent**(`component`, `silent?`): `Promise`<`void`\>

Sets the GCP Project Id in the gcloud config.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `component` | `string` | `undefined` | gcloud component group to install ie alpha, beta. |
| `silent` | `boolean` | `true` | - |

#### Returns

`Promise`<`void`\>

CMD output

#### Defined in

[index.ts:254](https://github.com/google-github-actions/setup-cloud-sdk/blob/73fe456/src/index.ts#L254)

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

[index.ts:122](https://github.com/google-github-actions/setup-cloud-sdk/blob/73fe456/src/index.ts#L122)

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

[index.ts:94](https://github.com/google-github-actions/setup-cloud-sdk/blob/73fe456/src/index.ts#L94)

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

[index.ts:36](https://github.com/google-github-actions/setup-cloud-sdk/blob/73fe456/src/index.ts#L36)

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

[index.ts:67](https://github.com/google-github-actions/setup-cloud-sdk/blob/73fe456/src/index.ts#L67)

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

[index.ts:146](https://github.com/google-github-actions/setup-cloud-sdk/blob/73fe456/src/index.ts#L146)

___

### runCmdWithJsonFormat

▸ **runCmdWithJsonFormat**(`cmd`, `silent?`): `Promise`<`any`\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `cmd` | `string` | `undefined` |
| `silent` | `boolean` | `true` |

#### Returns

`Promise`<`any`\>

#### Defined in

[index.ts:273](https://github.com/google-github-actions/setup-cloud-sdk/blob/73fe456/src/index.ts#L273)

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

[index.ts:219](https://github.com/google-github-actions/setup-cloud-sdk/blob/73fe456/src/index.ts#L219)

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

[index.ts:240](https://github.com/google-github-actions/setup-cloud-sdk/blob/73fe456/src/index.ts#L240)
