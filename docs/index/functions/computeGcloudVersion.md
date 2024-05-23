[**@google-github-actions/setup-cloud-sdk**](../../README.md) • **Docs**

***

[@google-github-actions/setup-cloud-sdk](../../modules.md) / [index](../README.md) / computeGcloudVersion

# Function: ~~computeGcloudVersion()~~

> **computeGcloudVersion**(`version`?): `Promise`\<`string`\>

computeGcloudVersion computes the appropriate gcloud version for the given
string. If the string is the empty string or the special value "latest", it
returns the latest known version of the Google Cloud SDK. Otherwise it
returns the provided string. It does not validate that the string is a valid
version.

This is most useful when accepting user input which should default to
"latest" or the empty string when you want the latest version to be
installed, but still want users to be able to choose a specific version to
install as a customization.

## Parameters

• **version?**: `string`

String (or undefined) version. The empty string or other
falsey values will return the latest gcloud version.

## Returns

`Promise`\<`string`\>

String representing the latest version.

## Deprecated

Callers should use `installGcloudSDK('> 0.0.0.')` instead.

## Source

[index.ts:212](https://github.com/google-github-actions/setup-cloud-sdk/blob/main/src/index.ts#L212)
