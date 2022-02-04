import { assertSingleExecutionValue, createTestkit } from '@envelop/testing'
import { buildSchema } from 'graphql'
import { useNoBatchedQueries } from '../'

describe('No Alias plugin', () => {
  test('Do not allow double query', async () => {
    const defaultAllow = 1
    const schema = buildSchema(/* GraphQL */ `
      type Query {
        getUser: User
      }
      type User {
        name: String
      }
    `)

    const query = /* GraphQL */ `
      {
        getUser {
          name
        }
        alias_1: getUser {
          name
        }
      }
    `
    const testkit = createTestkit([useNoBatchedQueries()], schema)
    const result = await testkit.execute(query)
    assertSingleExecutionValue(result)
    expect(result.data).toBeUndefined()

    expect(result.errors).toHaveLength(1)
    expect(result.errors[0].message).toMatch(
      new RegExp(
        String.raw`Allowed number of queries has been exceeded \(max: ${defaultAllow}\)`,
        'i'
      )
    )
  })

  test('Correctly pass in configuration object', async () => {
    const defaultAllow = 1

    const schema = buildSchema(/* GraphQL */ `
      type Query {
        getUser: User
        getAnotherUser: User
      }
      type User {
        name: String
      }
    `)

    const query = /* GraphQL */ `
      {
        getUser {
          name
        }
        alias_1: getUser {
          name
        }
        getAnotherUser {
          name
        }
        alias_2: getAnotherUser {
          name
        }
      }
    `

    const testkit = createTestkit(
      [useNoBatchedQueries({ allow: defaultAllow })],
      schema
    )
    const result = await testkit.execute(query)
    assertSingleExecutionValue(result)
    expect(result.data).toBeUndefined()

    expect(result.errors).toHaveLength(1)
    expect(result.errors[0].message).toMatch(
      new RegExp(
        String.raw`Allowed number of queries has been exceeded \(max: ${defaultAllow}\)`,
        'i'
      )
    )
  })
})
