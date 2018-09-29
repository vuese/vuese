import traverse from '@babel/traverse'
import generate from '@babel/generator'
import * as bt from '@babel/types'
import {
  getValueFromGenerate,
  isPropsOption,
  normalizeProps,
  writeFileSync,
  runFunction
} from './helpers'
import { isArray } from 'util'

type PropType = string | string[] | null

export interface PropsResult {
  type: PropType
  name: string
  required?: boolean
  default?: string
  validator?: string
}

const mainTraveres = {
  ObjectProperty(path: any) {
    // Processing props
    if (isPropsOption(path)) {
      const valuePath = path.get('value')
      const { onProp } = (this as any).options
      let res: PropsResult[] = []
      if (bt.isArrayExpression(valuePath.node)) {
        // An array of strings
        const propsValue: [] = getValueFromGenerate(valuePath.node)
        res = normalizeProps(propsValue)
      } else if (bt.isObjectExpression(valuePath.node)) {
        // An object
        valuePath.traverse({
          ObjectProperty(propPath: any) {
            // Guarantee that this is the prop definition
            if (propPath.parentPath === valuePath) {
              const name = propPath.node.key.name
              const vPath = propPath.get('value')
              const result: PropsResult = {
                name,
                type: null
              }
              if (isAllowPropsType(vPath.node)) {
                result.type = getTypeByPath(vPath)
              } else if (bt.isObjectExpression(vPath.node)) {
                if (!vPath.node.properties.length) return

                const allPropNodes = vPath.get('properties.0').container
                const typeNode = allPropNodes.filter((node: any, i: number) => {
                  if (node.key.name === 'type') {
                    node.$$selfPath = vPath.get(`properties.${i}`)
                    return true
                  }
                  return false
                })
                const otherNodes = allPropNodes.filter(
                  (node: any, i: number) => {
                    if (node.key.name !== 'type') {
                      node.$$selfPath = vPath.get(`properties.${i}`)
                      return true
                    }
                    return false
                  }
                )

                // Prioritize `type` before processing `default`.
                // Because the difference in `type` will affect the way `default` is handled.
                if (typeNode.length > 0) {
                  result.type = getTypeByPath(
                    typeNode[0].$$selfPath.get('value')
                  )
                }

                otherNodes.forEach((node: any) => {
                  const n = node.key.name
                  if (n === 'default') {
                    if (
                      !hasFunctionTypeDef(result.type) &&
                      bt.isFunction(node.value)
                    ) {
                      result.default = runFunction(node.value)
                    } else {
                      result.default = generate(node.value).code
                    }
                  } else if (n === 'required') {
                    if (bt.isBooleanLiteral(node.value)) {
                      result.required = node.value.value
                    }
                  } else if (n === 'validator') {
                    result.validator = generate(node.value).code
                  }
                })
              }
              res.push(result)
            }
          }
        })
      }
      writeFileSync(res)
      if (onProp) onProp(res)
    }
  }
}

function getTypeByPath(typePath: any): PropType {
  const typeNode = typePath.node
  if (bt.isIdentifier(typeNode)) return typeNode.name
  if (bt.isArrayExpression(typeNode)) {
    if (!typeNode.elements.length) return null
    return typePath
      .get('elements.0')
      .container.filter((node: any) => bt.isIdentifier(node))
      .map((node: any) => node.name)
  }
  return null
}

// The `type` of a prop should be an array of constructors or constructors
// eg. String or [String, Number]
function isAllowPropsType(typeNode: any): boolean {
  return bt.isIdentifier(typeNode) || bt.isArrayExpression(typeNode)
}

function hasFunctionTypeDef(type: PropType): boolean {
  if (typeof type === 'string') {
    return type.toLowerCase() === 'function'
  } else if (isArray(type)) {
    return type.map(a => a.toLowerCase()).some(b => b === 'function')
  }
  return false
}

export interface ParserOptions {
  onProp?: {
    (propsRes?: PropsResult[]): any
  }
}

export default function(ast: any, options: ParserOptions = {}) {
  traverse(ast, {
    ExportDefaultDeclaration(path: any) {
      path.traverse(mainTraveres, {
        options
      })
    }
  })
}
