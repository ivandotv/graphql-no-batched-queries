import { Plugin } from '@envelop/types'
import createValidation from 'graphql-no-batched-queries'
import { Config } from 'graphql-no-batched-queries'
export type { Config } from 'graphql-no-batched-queries'

/**
 * Uses no-batched-queries directive
 * @param config - {@link Config }
 *
 * @see {@link https://github.com/ivandotv/graphql-no-alias | GraphQL no batched queries }
 * @see {@link createValidation }
 */
export function useNoBatchedQueries(config?: Config): Plugin {
  const validation = createValidation(config)

  return {
    onValidate({ addValidationRule }) {
      addValidationRule(validation)
    }
  }
}
