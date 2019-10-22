import generate from '@babel/generator'
import * as bt from '@babel/types'
import { getComments } from './jscomments'
import { PropType, PropsResult } from './index'
import { runFunction } from './helper'

export function processPropValue(propValueNode: bt.Node, result: PropsResult) {
  if (isAllowPropsType(propValueNode)) {
    result.type = getTypeByTypeNode(propValueNode)
  } else if (bt.isObjectExpression(propValueNode)) {
    if (!propValueNode.properties.length) return

    const allPropNodes = propValueNode.properties

    const typeNode: any[] = allPropNodes.filter((node: any) => {
      if (node.key.name === 'type') {
        return true
      }
      return false
    })
    const otherNodes = allPropNodes.filter((node: any) => {
      if (node.key.name !== 'type') {
        return true
      }
      return false
    })

    // Prioritize `type` before processing `default`.
    // Because the difference in `type` will affect the way `default` is handled.
    if (typeNode.length > 0) {
      result.type = getTypeByTypeNode(typeNode[0].value)
      // Get descriptions of the type
      const typeDesc: string[] = getComments(typeNode[0]).default
      if (typeDesc.length > 0) {
        result.typeDesc = typeDesc
      }
    }
    // Processing props's default value
    otherNodes.forEach((node: any) => {
      const n = node.key.name
      if (n === 'default') {
        if (!hasFunctionTypeDef(result.type)) {
          if (bt.isObjectMethod(node)) {
            // Using functionExpression instead of ObjectMethod
            let params = node.params || []
            let body = node.body
            if (!bt.isBlockStatement(body)) {
              body = bt.blockStatement(body)
            }
            let r = bt.functionExpression(null, params, body, false, false)
            result.default = runFunction(r)
          } else if (bt.isFunction(node.value)) {
            result.default = runFunction(node.value)
          } else if (
            bt.isNumericLiteral(node.value) ||
            bt.isStringLiteral(node.value)
          ) {
            // Primitive value
            result.default = node.value.value
          }
        } else {
          if (bt.isObjectMethod(node)) {
            result.default = generate(node).code
          } else if (bt.isFunction(node.value)) {
            result.default = generate(node.value).code
          }
        }

        // Get descriptions of the default value
        const defaultDesc: string[] = getComments(node).default
        if (defaultDesc.length > 0) {
          result.defaultDesc = defaultDesc
        }
      } else if (n === 'required') {
        if (bt.isBooleanLiteral(node.value)) {
          result.required = node.value.value
        }
      } else if (n === 'validator') {
        if (bt.isObjectMethod(node)) {
          result.validator = generate(node).code
        } else {
          result.validator = generate(node.value).code
        }

        // Get descriptions of the validator
        const validatorDesc: string[] = getComments(node).default
        if (validatorDesc.length > 0) {
          result.validatorDesc = validatorDesc
        }
      }
    })
  }
}

export function normalizeProps(props: string[]): PropsResult[] {
  return props.map(prop => ({
    type: null,
    name: prop
  }))
}

export function getPropDecorator(
  classPropertyNode: bt.ClassProperty
): bt.Decorator | undefined {
  const decorators = classPropertyNode.decorators
  if (!decorators) return

  return decorators.find(
    deco =>
      // @Prop()
      (bt.isCallExpression(deco.expression) &&
        bt.isIdentifier(deco.expression.callee) &&
        deco.expression.callee.name === 'Prop') ||
      // @Prop
      (bt.isIdentifier(deco.expression) && deco.expression.name === 'Prop')
  )
}

type PropDecoratorArgument =
  | bt.Identifier
  | bt.ArrayExpression
  | bt.ObjectExpression
  | null
export function getArgumentFromPropDecorator(
  deco: bt.Decorator
): PropDecoratorArgument {
  return bt.isCallExpression(deco.expression)
    ? (deco.expression.arguments[0] as PropDecoratorArgument)
    : null
}

function getTypeByTypeNode(typeNode: bt.Node): PropType {
  if (bt.isIdentifier(typeNode)) return typeNode.name
  if (bt.isArrayExpression(typeNode)) {
    if (!typeNode.elements.length) return null

    return typeNode.elements
      .filter(node => node && bt.isIdentifier(node))
      .map(node => (node as bt.Identifier).name)
  }

  return null
}

// The `type` of a prop should be an array of constructors or constructors
// eg. String or [String, Number]
function isAllowPropsType(typeNode: bt.Node): boolean {
  return bt.isIdentifier(typeNode) || bt.isArrayExpression(typeNode)
}

function hasFunctionTypeDef(type: PropType): boolean {
  if (typeof type === 'string') {
    return type.toLowerCase() === 'function'
  } else if (Array.isArray(type)) {
    return type.map(a => a.toLowerCase()).some(b => b === 'function')
  }
  return false
}
