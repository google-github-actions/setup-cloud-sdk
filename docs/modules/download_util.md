[@google-github-actions/setup-cloud-sdk](../README.md) / [Exports](../modules.md) / download-util

# Module: download-util

## Table of contents

### Functions

- [downloadAndExtractTool](download_util.md#downloadandextracttool)

## Functions

### downloadAndExtractTool

▸ **downloadAndExtractTool**(`url`): `Promise`\<`string`\>

Downloads and extracts the tool at the specified URL.

#### Parameters

| Name | Type |
| :------ | :------ |
| `url` | `string` |

#### Returns

`Promise`\<`string`\>

The path to the locally extracted tool.

**`Url`**

The URL of the tool to be downloaded.

#### Defined in

[download-util.ts:30](https://github.com/google-github-actions/setup-cloud-sdk/blob/main/src/download-util.ts#L30)
