[**@google-github-actions/setup-cloud-sdk**](../../README.md) • **Docs**

***

[@google-github-actions/setup-cloud-sdk](../../modules.md) / [test-util](../README.md) / TestToolCache

# Class: TestToolCache

Creates an overridden runner cache and tool path. This is slightly
complicated by the fact that the runner initializes its cache path exactly
once at startup, so this must be imported and called BEFORE the toolcache is
used.

## Constructors

### new TestToolCache()

> **new TestToolCache**(): [`TestToolCache`](TestToolCache.md)

#### Returns

[`TestToolCache`](TestToolCache.md)

## Properties

### #originalTempDir?

> `static` `private` `optional` **#originalTempDir**: `string`

#### Source

[test-util.ts:37](https://github.com/google-github-actions/setup-cloud-sdk/blob/main/src/test-util.ts#L37)

***

### #originalToolsDir?

> `static` `private` `optional` **#originalToolsDir**: `string`

#### Source

[test-util.ts:36](https://github.com/google-github-actions/setup-cloud-sdk/blob/main/src/test-util.ts#L36)

***

### rootDir

> `static` **rootDir**: `string`

#### Source

[test-util.ts:32](https://github.com/google-github-actions/setup-cloud-sdk/blob/main/src/test-util.ts#L32)

***

### tempDir

> `static` **tempDir**: `string`

#### Source

[test-util.ts:34](https://github.com/google-github-actions/setup-cloud-sdk/blob/main/src/test-util.ts#L34)

***

### toolsDir

> `static` **toolsDir**: `string`

#### Source

[test-util.ts:33](https://github.com/google-github-actions/setup-cloud-sdk/blob/main/src/test-util.ts#L33)

## Methods

### setGlobal()

> `static` `private` **setGlobal**\<`T`\>(`k`, `v`): `void`

#### Type parameters

• **T**

#### Parameters

• **k**: `string`

• **v**: `undefined` \| `T`

#### Returns

`void`

#### Source

[test-util.ts:76](https://github.com/google-github-actions/setup-cloud-sdk/blob/main/src/test-util.ts#L76)

***

### start()

> `static` **start**(): `Promise`\<`void`\>

Creates temporary directories for the runner cache and temp.

#### Returns

`Promise`\<`void`\>

#### Source

[test-util.ts:42](https://github.com/google-github-actions/setup-cloud-sdk/blob/main/src/test-util.ts#L42)

***

### stop()

> `static` **stop**(): `Promise`\<`void`\>

Restores the Action's runner to use the original directories and deletes
the temporary files.

#### Returns

`Promise`\<`void`\>

#### Source

[test-util.ts:64](https://github.com/google-github-actions/setup-cloud-sdk/blob/main/src/test-util.ts#L64)
