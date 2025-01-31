[**@google-github-actions/setup-cloud-sdk**](../../README.md)

***

[@google-github-actions/setup-cloud-sdk](../../modules.md) / [test-util](../README.md) / TestToolCache

# Class: TestToolCache

Defined in: [test-util.ts:31](https://github.com/google-github-actions/setup-cloud-sdk/blob/main/src/test-util.ts#L31)

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

### rootDir

> `static` **rootDir**: `string`

Defined in: [test-util.ts:32](https://github.com/google-github-actions/setup-cloud-sdk/blob/main/src/test-util.ts#L32)

***

### tempDir

> `static` **tempDir**: `string`

Defined in: [test-util.ts:34](https://github.com/google-github-actions/setup-cloud-sdk/blob/main/src/test-util.ts#L34)

***

### toolsDir

> `static` **toolsDir**: `string`

Defined in: [test-util.ts:33](https://github.com/google-github-actions/setup-cloud-sdk/blob/main/src/test-util.ts#L33)

## Methods

### start()

> `static` **start**(): `Promise`\<`void`\>

Defined in: [test-util.ts:42](https://github.com/google-github-actions/setup-cloud-sdk/blob/main/src/test-util.ts#L42)

Creates temporary directories for the runner cache and temp.

#### Returns

`Promise`\<`void`\>

***

### stop()

> `static` **stop**(): `Promise`\<`void`\>

Defined in: [test-util.ts:64](https://github.com/google-github-actions/setup-cloud-sdk/blob/main/src/test-util.ts#L64)

Restores the Action's runner to use the original directories and deletes
the temporary files.

#### Returns

`Promise`\<`void`\>
