[**@google-github-actions/setup-cloud-sdk**](../../README.md) • **Docs**

***

[@google-github-actions/setup-cloud-sdk](../../modules.md) / [index](../README.md) / gcloudRunJSON

# Function: gcloudRunJSON()

> **gcloudRunJSON**(`cmd`, `options`?): `Promise`\<`any`\>

gcloudRunJSON runs the gcloud command with JSON output and parses the result
as JSON. If the parsing fails, it throws an error.

## Parameters

• **cmd**: `string`[]

The command to run.

• **options?**: `ExecOptions`

Any options.

## Returns

`Promise`\<`any`\>

Parsed JSON as an object (or array).

## Source

[index.ts:128](https://github.com/google-github-actions/setup-cloud-sdk/blob/main/src/index.ts#L128)
