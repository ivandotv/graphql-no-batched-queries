import { Plugin } from '@envelop/types'
import createValidation from 'graphql-no-batched-queries'
import type { Config } from 'graphql-no-batched-queries'

export type { Config } from 'graphql-no-batched-queries'

export function useNoAlias(config?: Config): Plugin {
  const validation = createValidation(config)

  return {
    onValidate({ addValidationRule }) {
      addValidationRule(validation)
    }
  }
}
