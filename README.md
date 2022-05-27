# GraphQl No Batched Queries Validation

[![Test](https://github.com/ivandotv/graphql-no-batched-queries/actions/workflows/CI.yml/badge.svg)](https://github.com/ivandotv/graphql-no-batched-queries/actions/workflows/CI.yml)
[![Codecov](https://img.shields.io/codecov/c/gh/ivandotv/graphql-no-batched-queries)](https://app.codecov.io/gh/ivandotv/graphql-no-batched-queries)
[![GitHub license](https://img.shields.io/github/license/ivandotv/graphql-no-batched-queries)](https://github.com/ivandotv/graphql-no-batched-queries/blob/main/LICENSE)

<!-- toc -->

- [Instalation](#instalation)
- [Usage](#usage)
- [Customizing the error message](#customizing-the-error-message)
- [Envelop Plugin](#envelop-plugin)
- [GraphQl No Alias Directive](#graphql-no-alias-directive)
- [License](#license)

<!-- tocstop -->

Graphql validation to disable batched queries and mutations that can be sent to the GraphQL server. By default, only one query or mutation per request is allowed.

```ts
  // batch query attack (hello DoS)
  query {
    getUsers(first: 1000)
    second: getUsers(first: 2000)
    third: getUsers(first: 3000)
    fourth: getUsers(first: 4000)
  }

  //  or batch login attack
  mutation {
    login(pass: 1111, username: "ivan")
    second: login(pass: 2222, username: "ivan")
    third: login(pass: 3333, username: "ivan")
    fourth: login(pass: 4444, username: "ivan")
  }
`
```

You can read more batching attacks here: https://lab.wallarm.com/graphql-batching-attack/

## Instalation

```sh
npm i graphql-no-batched-queries
```

## Usage

In the next example, we are going to use `express-graphql` as our graphql server.
The validation function accepts one parameter `allow` which declares the default number of allowed queries or mutations per request.

```js
const express = require('express')
const { graphqlHTTP } = require('express-graphql')
const createValidation = require('graphql-no-batched-queries')

// allow two queries or mutations per request (default is one)
const validation = createValidation({ allow: 2 })

const app = express()
app.use(
  '/graphql',
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
    validationRules: [validation] //add the validation function
  })
)
app.listen(4000)
```

## Customizing the error message

The `error` message that is reported when the validation fails can also be customized. You can return a `GrahphQLError` instance or just a `string` that will be used as the error message.

```ts
const  validation  = createValidation({errorFn:(
  maxAllowed: number,
  ctx: ValidationContext
): GraphQLError {
  return new GraphQLError(
    `Hey! allowed number of calls for ${typeName}->${fieldName} has been exceeded (max: ${maxAllowed})`
  )
  //or
  return 'just the message'
}
})
```

## Envelop Plugin

If you are using [GraphQL Envelop](https://www.envelop.dev/). I have made a [plugin](packages/envelop/README.md) that uses this validation.

## GraphQl No Alias Directive

I've also made a [directive](https://github.com/ivandotv/graphql-no-alias) that disables `alias` functionality of the query, meaning that you can't send the same queries or mutations to the server. It pairs nicely with this one, in case you want to allow more than one query or mutation, but they can't be the same.

## License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details
