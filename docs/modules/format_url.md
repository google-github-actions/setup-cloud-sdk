[@google-github-actions/setup-cloud-sdk](../README.md) / [Exports](../modules.md) / format-url

# Module: format-url

## Table of contents

### Functions

- [buildReleaseURL](format_url.md#buildreleaseurl)

## Functions

### buildReleaseURL

▸ **buildReleaseURL**(`os`, `arch`, `version`): `string`

buildReleaseURL builds the URL at which to dowbnload the gcloud SDK,
according to the specified arguments.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `os` | `string` | The OS of the requested release. |
| `arch` | `string` | The system architecture of the requested release. |
| `version` | `string` | The version of the requested release. |

#### Returns

`string`

The formatted gcloud SDK release URL.

#### Defined in

[format-url.ts:33](https://github.com/google-github-actions/setup-cloud-sdk/blob/main/src/format-url.ts#L33)
