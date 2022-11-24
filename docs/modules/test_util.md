[@google-github-actions/setup-cloud-sdk](../README.md) / [Exports](../modules.md) / test-util

# Module: test-util

## Table of contents

### Classes

- [TestToolCache](../classes/test_util.TestToolCache.md)

### Variables

- [TEST\_SA\_KEY\_CREDS\_FILE](test_util.md#test_sa_key_creds_file)
- [TEST\_SDK\_VERSION](test_util.md#test_sdk_version)
- [TEST\_SDK\_VERSIONS](test_util.md#test_sdk_versions)
- [TEST\_WIF\_CREDS\_FILE](test_util.md#test_wif_creds_file)

## Variables

### TEST\_SA\_KEY\_CREDS\_FILE

• `Const` **TEST\_SA\_KEY\_CREDS\_FILE**: ``"\n{\n  \"type\": \"service_account\",\n  \"project_id\": \"my-project\",\n  \"private_key_id\": \"1234567890abcdefghijklmnopqrstuvwxyzaabb\",\n  \"private_key\": \"-----BEGIN PRIVATE KEY-----\\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQCRVYIJRuxdujaX\\nUfyY9mXT1O0M3PwyT+FnPJVY+6Md7KMiPKpZRYt7okj51Ln1FLcb9mY17LzPEAxS\\nBPn1LWNpSJpmttI/D3U+bG/znf/E89ErVopYWpaynbYrb/Mu478IE9TgvnqJMlkj\\nlQbaxnZ7qhnbI5h6p/HINWfY7xBDGZM1sc2FK9KbNfEzLdW1YiK/lWAwtfM7rbiO\\nZj+LnWm2dgwZxu0h8m68qYYMywzLcV3NTe35qdAznasc1WQvJikY+N82Wu+HjsPa\\nH0fLE3gN5r+BzDYQxEQnWANgxlsHeN9mg5LAg5fyTBwTS7Ato/qQ07da0CSoS1M0\\nriYvuCzhAgMBAAECggEAAai+m9fG5B03kIMLpY5O7Rv9AM+ufb91hx6Nwkp7r4M5\\nt11vY7I96wuYJ92iBu8m4XR6fGw0Xz3gkcQ69ZCu5320hBdPrJsrqXwMhgxgoGcq\\nWuB8aJEWASi+T9hGENA++eDQFMupWV6HafzCdxd4NKAfmZ/xf1OFUu0TVpvxKlAD\\ne6Njz/5+QFdUcNioi7iGy1Qz7xdpClEWdVin8VWe3p6UsCLfHmQfPPuLXOvpBj6k\\niFu9dl93z+8vlDLoAyXSaDeYyRMBGVOBM36cICuVpxfV1s/corEZXhz3aI8mlYiQ\\n6YXTcEnllt+NTJDIL99CnYn+WBVzeIGXtr0EKAyM6QKBgQDCU6FDvU0P8qt45BDm\\nSP2V7uMoI32mjEA3plJzqqSZ9ritxFmylrOttOoTYH2FVjrKPZZsLihSjpmm+wEz\\nGfjd75eSJYAb/m7GNOqbJjqAJIbIMaHfVcH6ODT2b0Tc8v/CK0PZy/jzgt68TdtF\\no462tr8isj7yLpCGdoLq9iq4gwKBgQC/dWTGFnaI08v1uqx6derf+qikSsjlYh4L\\nDdTlI8/eaTR90PFPQ4a8LE8pmhMhkJNg87jAF5VF29sPmlpfKbOC87C2iI8uIHcn\\nu0sTdhn6SukyUSN/eeb1KSDJuxDvIgPRTZj6XMlUulADeLRnlAoWOe0tu/wqpse6\\nB0Qu2oAfywKBgQCMWukESyro1OZit585JQj7jQJG0HOFopETYK722g5vIdM7trDu\\nm4iFc0EJ48xlTOXDgv4tfp0jG9oA0BSKuzyT1+RK64j/LyMFR90XWGIyga9T0v1O\\nmNs1BfnC8JT1XRG7RZKJMZjLEQAdU8KHJt4CPDYLMmDifR1n8RsX59rtTwKBgQCS\\nnAmsKn1gb5cqt2Tmba+LDj3feSj3hjftTQ0u3kqKTNOWWM7AXLwrEl8YQ1TNChHh\\nVyCtcCGtmhrYiuETKDK/X259iHrj3paABUsLPw/Le1uxXTKqpiV2rKTf9XCVPd3g\\ng+RWK4E8cWNeFStIebNzq630rJP/8TDWQkQzALzGGwKBgQC5bnlmipIGhtX2pP92\\niBM8fJC7QXbyYyamriyFjC3o250hHy7mZZG7bd0bH3gw0NdC+OZIBNv7AoNhjsvP\\nuE0Qp/vQXpgHEeYFyfWn6PyHGzqKLFMZ/+iCTuy8Iebs1p5DZY8RMXpx4tv6NfRy\\nbxHUjlOgP7xmXM+OZpNymFlRkg==\\n-----END PRIVATE KEY-----\\n\",\n  \"client_email\": \"my-service-account@my-project.iam.gserviceaccount.com\",\n  \"client_id\": \"123456789098765432101\",\n  \"auth_uri\": \"https://accounts.google.com/o/oauth2/auth\",\n  \"token_uri\": \"https://oauth2.googleapis.com/token\",\n  \"auth_provider_x509_cert_url\": \"https://www.googleapis.com/oauth2/v1/certs\",\n  \"client_x509_cert_url\": \"https://www.googleapis.com/robot/v1/metadata/x509/my-service-account%40my-project.iam.gserviceaccount.com\"\n}\n"``

#### Defined in

[test-util.ts:96](https://github.com/google-github-actions/setup-cloud-sdk/blob/main/src/test-util.ts#L96)

___

### TEST\_SDK\_VERSION

• `Const` **TEST\_SDK\_VERSION**: `string`

#### Defined in

[test-util.ts:74](https://github.com/google-github-actions/setup-cloud-sdk/blob/main/src/test-util.ts#L74)

___

### TEST\_SDK\_VERSIONS

• `Const` **TEST\_SDK\_VERSIONS**: `string`[]

The version of the gcloud SDK being tested against.

#### Defined in

[test-util.ts:72](https://github.com/google-github-actions/setup-cloud-sdk/blob/main/src/test-util.ts#L72)

___

### TEST\_WIF\_CREDS\_FILE

• `Const` **TEST\_WIF\_CREDS\_FILE**: ``"\n{\n  \"audience\": \"//iam.googleapis.com/my-provider\",\n  \"credential_source\": {\n    \"format\": {\n      \"subject_token_field_name\": \"value\",\n      \"type\": \"json\"\n    },\n    \"headers\": {\n      \"Authorization\": \"Bearer github-token\"\n    },\n    \"url\": \"https://actions-token.url/?audience=my-aud\"\n  },\n  \"service_account_impersonation_url\": \"https://iamcredentials.googleapis.com/v1/projects/-/serviceAccounts/my-service@my-project.iam.gserviceaccount.com:generateAccessToken\",\n  \"subject_token_type\": \"urn:ietf:params:oauth:token-type:jwt\",\n  \"token_url\": \"https://sts.googleapis.com/v1/token\",\n  \"type\": \"external_account\"\n}\n"``

#### Defined in

[test-util.ts:76](https://github.com/google-github-actions/setup-cloud-sdk/blob/main/src/test-util.ts#L76)
