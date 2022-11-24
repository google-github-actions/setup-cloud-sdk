[@google-github-actions/setup-cloud-sdk](../README.md) / [Exports](../modules.md) / [test-util](../modules/test_util.md) / TestToolCache

# Class: TestToolCache

[test-util](../modules/test_util.md).TestToolCache

Creates an overridden runner cache and tool path. This is slightly
complicated by the fact that the runner initializes its cache path exactly
once at startup, so this must be imported and called BEFORE the toolcache is
used.

## Table of contents

### Constructors

- [constructor](test_util.TestToolCache.md#constructor)

### Properties

- [#originalTempDir](test_util.TestToolCache.md##originaltempdir)
- [#originalToolsDir](test_util.TestToolCache.md##originaltoolsdir)
- [rootDir](test_util.TestToolCache.md#rootdir)
- [tempDir](test_util.TestToolCache.md#tempdir)
- [toolsDir](test_util.TestToolCache.md#toolsdir)

### Methods

- [start](test_util.TestToolCache.md#start)
- [stop](test_util.TestToolCache.md#stop)

## Constructors

### constructor

• **new TestToolCache**()

## Properties

### #originalTempDir

▪ `Static` `Private` `Optional` **#originalTempDir**: `string`

#### Defined in

[test-util.ts:37](https://github.com/google-github-actions/setup-cloud-sdk/blob/main/src/test-util.ts#L37)

___

### #originalToolsDir

▪ `Static` `Private` `Optional` **#originalToolsDir**: `string`

#### Defined in

[test-util.ts:36](https://github.com/google-github-actions/setup-cloud-sdk/blob/main/src/test-util.ts#L36)

___

### rootDir

▪ `Static` **rootDir**: `string`

#### Defined in

[test-util.ts:32](https://github.com/google-github-actions/setup-cloud-sdk/blob/main/src/test-util.ts#L32)

___

### tempDir

▪ `Static` **tempDir**: `string`

#### Defined in

[test-util.ts:34](https://github.com/google-github-actions/setup-cloud-sdk/blob/main/src/test-util.ts#L34)

___

### toolsDir

▪ `Static` **toolsDir**: `string`

#### Defined in

[test-util.ts:33](https://github.com/google-github-actions/setup-cloud-sdk/blob/main/src/test-util.ts#L33)

## Methods

### start

▸ `Static` **start**(): `Promise`<`void`\>

Creates temporary directories for the runner cache and temp.

#### Returns

`Promise`<`void`\>

#### Defined in

[test-util.ts:42](https://github.com/google-github-actions/setup-cloud-sdk/blob/main/src/test-util.ts#L42)

___

### stop

▸ `Static` **stop**(): `Promise`<`void`\>

Restores the Action's runner to use the original directories and deletes
the temporary files.

#### Returns

`Promise`<`void`\>

#### Defined in

[test-util.ts:61](https://github.com/google-github-actions/setup-cloud-sdk/blob/main/src/test-util.ts#L61)
