import { buildSchema, parse, validate } from 'graphql'
import createValidation from '..'

describe('No Query batching', () => {
  test('By default allow only one query', () => {
    const validation = createValidation()
    const defaultCount = 1

    const schema = buildSchema(/* GraphQL */ `
      type Query {
        createUser: User
        createAnotherUser: User
      }

      type User {
        name: String
      }
    `)

    const query = /* GraphQL */ `
      query {
        createUser {
          name
        }
        createUser {
          name
        }
      }
    `
    const doc = parse(query)
    const errors = validate(schema, doc, [validation])
    expect(errors).toHaveLength(1)
    expect(errors[0].message).toMatch(
      new RegExp(
        String.raw`Allowed number of queries has been exceeded \(max: ${defaultCount}\)`,
        'i'
      )
    )
  })
  test('Allow custom number of queries', () => {
    const defaultCount = 2
    const validation = createValidation({ allow: defaultCount })

    const schema = buildSchema(/* GraphQL */ `
      type Query {
        createUser: User
        createAnotherUser: User
      }

      type User {
        name: String
      }
    `)

    const query = /* GraphQL */ `
      query {
        createUser {
          name
        }
        createUser {
          name
        }
      }
    `
    const doc = parse(query)
    const errors = validate(schema, doc, [validation])
    expect(errors).toHaveLength(0)
  })

  test('Report error if custom number of allowed queries is exceeded', () => {
    const defaultCount = 2
    const validation = createValidation({ allow: defaultCount })

    const schema = buildSchema(/* GraphQL */ `
      type Query {
        createUser: User
        createAnotherUser: User
      }

      type User {
        name: String
      }
    `)

    const query = /* GraphQL */ `
      query {
        createUser {
          name
        }
        alias_1: createUser {
          name
        }
        alias_2: createUser {
          name
        }
      }
    `
    const doc = parse(query)
    const errors = validate(schema, doc, [validation])
    expect(errors).toHaveLength(1)
    expect(errors[0].message).toMatch(
      new RegExp(
        String.raw`Allowed number of queries has been exceeded \(max: ${defaultCount}\)`,
        'i'
      )
    )
  })
})
