[**@google-github-actions/setup-cloud-sdk**](../../README.md) • **Docs**

***

[@google-github-actions/setup-cloud-sdk](../../modules.md) / [format-url](../README.md) / buildReleaseURL

# Function: buildReleaseURL()

> **buildReleaseURL**(`os`, `arch`, `version`): `string`

buildReleaseURL builds the URL at which to dowbnload the gcloud SDK,
according to the specified arguments.

## Parameters

• **os**: `string`

The OS of the requested release.

• **arch**: `string`

The system architecture of the requested release.

• **version**: `string`

The version of the requested release.

## Returns

`string`

The formatted gcloud SDK release URL.

## Source

[format-url.ts:33](https://github.com/google-github-actions/setup-cloud-sdk/blob/main/src/format-url.ts#L33)
