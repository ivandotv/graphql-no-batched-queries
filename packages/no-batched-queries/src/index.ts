import { ASTVisitor, FieldNode, GraphQLError, ValidationContext } from 'graphql'

//https://graphql.org/graphql-js/language/#visitor

export type ErrorFn = typeof createErrorMsg

export type Config = {
  /** How many  calls to allow */
  allow?: number
  /** function that should return a graphql erorr or string when the validation fails*/
  errorFn?: ErrorFn
}

/**
 * Creates validation
 * @param config - {@link Config}
 * @returns validation function
 */
export default function createValidation(
  config?: Config
): (context: ValidationContext) => ASTVisitor {
  const { allow, errorFn } = {
    ...{
      allow: 1,
      errorFn: createErrorMsg
    },
    ...(config || {})
  }

  return (context: ValidationContext): ASTVisitor => {
    const ast: ASTVisitor = {
      Field: {
        leave: createFieldValidation(context, allow, errorFn)
      }
    }

    return ast
  }
}

function createFieldValidation(
  context: ValidationContext,
  defaultAllow: number,
  errorFn: ErrorFn
): (node: FieldNode) => void {
  let count = 0
  let errorReported = false

  return (_node: FieldNode) => {
    const parentTypeName = context.getParentType()?.name

    if (parentTypeName === 'Query' || parentTypeName === 'Mutation') {
      count++
      if (count > defaultAllow && !errorReported) {
        errorReported = true
        const errorResult = errorFn(defaultAllow, context)
        context.reportError(
          typeof errorResult === 'string'
            ? new GraphQLError(errorResult)
            : errorResult
        )
      }
    }
  }
}

/**
 * Creates custom GraphQLError instance
 * @param maxAllowed - max allowed count that has been reached
 */
function createErrorMsg(
  maxAllowed: number,
  _ctx: ValidationContext
): GraphQLError | string {
  return new GraphQLError(
    `Allowed number of queries has been exceeded (max: ${maxAllowed})`
  )
}
