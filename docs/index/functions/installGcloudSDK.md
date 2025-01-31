[**@google-github-actions/setup-cloud-sdk**](../../README.md)

***

[@google-github-actions/setup-cloud-sdk](../../modules.md) / [index](../README.md) / installGcloudSDK

# Function: installGcloudSDK()

> **installGcloudSDK**(`version`): `Promise`\<`string`\>

Defined in: [index.ts:168](https://github.com/google-github-actions/setup-cloud-sdk/blob/main/src/index.ts#L168)

Installs the gcloud SDK into the actions environment.

## Parameters

### version

`string`

The version or version specification to install. If a
specification is given, the most recent version that still matches the
specification is installed.

## Returns

`Promise`\<`string`\>

The path of the installed tool.
