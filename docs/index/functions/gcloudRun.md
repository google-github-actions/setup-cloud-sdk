[**@google-github-actions/setup-cloud-sdk**](../../README.md)

***

[@google-github-actions/setup-cloud-sdk](../../modules.md) / [index](../README.md) / gcloudRun

# Function: gcloudRun()

> **gcloudRun**(`cmd`, `options?`): `Promise`\<[`ExecOutput`](../type-aliases/ExecOutput.md)\>

Defined in: [index.ts:98](https://github.com/google-github-actions/setup-cloud-sdk/blob/main/src/index.ts#L98)

gcloudRun executes the given gcloud command using actions/exec under the
hood. It handles non-zero exit codes and throws a more semantic error on
failure.

## Parameters

### cmd

`string`[]

The command to run.

### options?

`ExecOptions`

Any options.

## Returns

`Promise`\<[`ExecOutput`](../type-aliases/ExecOutput.md)\>

ExecOutput
