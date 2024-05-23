[**@google-github-actions/setup-cloud-sdk**](../../README.md) • **Docs**

***

[@google-github-actions/setup-cloud-sdk](../../modules.md) / [index](../README.md) / gcloudRun

# Function: gcloudRun()

> **gcloudRun**(`cmd`, `options`?): `Promise`\<[`ExecOutput`](../type-aliases/ExecOutput.md)\>

gcloudRun executes the given gcloud command using actions/exec under the
hood. It handles non-zero exit codes and throws a more semantic error on
failure.

## Parameters

• **cmd**: `string`[]

The command to run.

• **options?**: `ExecOptions`

Any options.

## Returns

`Promise`\<[`ExecOutput`](../type-aliases/ExecOutput.md)\>

ExecOutput

## Source

[index.ts:99](https://github.com/google-github-actions/setup-cloud-sdk/blob/main/src/index.ts#L99)
