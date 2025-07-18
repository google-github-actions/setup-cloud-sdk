[**@google-github-actions/setup-cloud-sdk**](../../README.md)

***

[@google-github-actions/setup-cloud-sdk](../../modules.md) / [index](../README.md) / gcloudRunJSON

# Function: gcloudRunJSON()

> **gcloudRunJSON**(`cmd`, `options?`): `Promise`\<`any`\>

Defined in: [index.ts:126](https://github.com/google-github-actions/setup-cloud-sdk/blob/main/src/index.ts#L126)

gcloudRunJSON runs the gcloud command with JSON output and parses the result
as JSON. If the parsing fails, it throws an error.

## Parameters

### cmd

`string`[]

The command to run.

### options?

`ExecOptions`

Any options.

## Returns

`Promise`\<`any`\>

Parsed JSON as an object (or array).
