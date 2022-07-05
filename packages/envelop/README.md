# No Batched Queries - Envelop Plugin

This package is an [envelop plugin](https://www.envelop.dev) version of
[`graphql-no-batched-queries`](https://github.com/ivandotv/graphql-no-batched-queries) validation directive.

## Install

```sh
npm i envelop-no-batched-queries
```

## Usage

```ts
import { envelop } from '@envelop/core'
import { useNoBatchedQueries } from 'envelop-no-batched-queries'

// allow 2 queries or mutations per request (default is 1)
const batchValidation = useNoBatchedQueries({ allow: 2 })

const getEnveloped = envelop({
  plugins: [batchValidation]
})
```
