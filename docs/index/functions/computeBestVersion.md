[**@google-github-actions/setup-cloud-sdk**](../../README.md)

***

[@google-github-actions/setup-cloud-sdk](../../modules.md) / [index](../README.md) / computeBestVersion

# Function: computeBestVersion()

> **computeBestVersion**(`spec`, `versions`): `string`

Defined in: [index.ts:300](https://github.com/google-github-actions/setup-cloud-sdk/blob/main/src/index.ts#L300)

computeBestVersion computes the latest available version that still satisfies
the spec. This is a helper function and is only exported for testing.

## Parameters

### spec

`string`

Version specification

### versions

`string`[]

List of versions

## Returns

`string`

Best version or an error if no matches are found
