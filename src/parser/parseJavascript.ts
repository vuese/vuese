import traverse, { NodePath } from '@babel/traverse'
import generate from '@babel/generator'
import * as bt from '@babel/types'
import { getComments, CommentResult } from './jscomments'
import {
  PropsResult,
  PropType,
  ParserOptions,
  EventResult,
  MethodResult
} from './index'
import {
  getValueFromGenerate,
  isVueOption,
  runFunction,
  getFirstPropContainer
} from '../helpers'
import { isArray } from 'util'

function normalizeProps(props: string[]): PropsResult[] {
  return props.map(prop => ({
    type: null,
    name: prop
  }))
}

function getTypeByPath(typePath: NodePath): PropType {
  const typeNode = typePath.node
  if (bt.isIdentifier(typeNode)) return typeNode.name
  if (bt.isArrayExpression(typeNode)) {
    if (!typeNode.elements.length) return null

    const container = getFirstPropContainer(typePath, 'elements')

    return container
      .filter(node => bt.isIdentifier(node))
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
  } else if (isArray(type)) {
    return type.map(a => a.toLowerCase()).some(b => b === 'function')
  }
  return false
}

export default function(ast: bt.File, options: ParserOptions = {}) {
  const seenEvent = new Set()

  traverse(ast, {
    ExportDefaultDeclaration(path: NodePath<bt.ExportDefaultDeclaration>) {
      path.traverse(
        {
          ObjectProperty(path: NodePath<bt.ObjectProperty>) {
            const { onProp, onMethod, onName } = this.options
            // Processing name
            if (isVueOption(path, 'name')) {
              if (onName) onName((path.node.value as bt.StringLiteral).value)
            }

            // Processing props
            if (isVueOption(path, 'props')) {
              const valuePath = path.get('value')

              let res: PropsResult[] = []
              if (bt.isArrayExpression(valuePath.node)) {
                // An array of strings
                const propsValue: [] = getValueFromGenerate(valuePath.node)
                res = normalizeProps(propsValue)
              } else if (bt.isObjectExpression(valuePath.node)) {
                // An object
                valuePath.traverse({
                  ObjectProperty(propPath: NodePath<bt.ObjectProperty>) {
                    // Guarantee that this is the prop definition
                    if (propPath.parentPath === valuePath) {
                      const name = propPath.node.key.name
                      const vPath = propPath.get('value')
                      const result: PropsResult = {
                        name,
                        type: null,
                        describe: getComments(propPath.node).default
                      }

                      if (isAllowPropsType(vPath.node)) {
                        result.type = getTypeByPath(vPath)
                      } else if (bt.isObjectExpression(vPath.node)) {
                        if (!vPath.node.properties.length) return

                        const allPropNodes = getFirstPropContainer(
                          vPath,
                          'properties'
                        )

                        const typeNode: any[] = allPropNodes.filter(
                          (node: any, i: number) => {
                            if (node.key.name === 'type') {
                              node.$$selfPath = vPath.get(`properties.${i}`)
                              return true
                            }
                            return false
                          }
                        )
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
                          // Get descriptions of the type
                          const typeDesc: string[] = getComments(typeNode[0])
                            .default
                          if (typeDesc.length > 0) {
                            result.typeDesc = typeDesc
                          }
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
                              if (bt.isObjectMethod(node)) {
                                result.default = generate(node).code
                              } else {
                                result.default = generate(node.value).code
                              }
                            }

                            // Get descriptions of the default value
                            const defaultDesc: string[] = getComments(node)
                              .default
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
                            const validatorDesc: string[] = getComments(node)
                              .default
                            if (validatorDesc.length > 0) {
                              result.validatorDesc = validatorDesc
                            }
                          }
                        })
                      }
                      res.push(result)
                    }
                  }
                })
              }
              if (onProp) onProp(res)
            }

            // Processing methods
            if (isVueOption(path, 'methods')) {
              const properties = (path.node
                .value as bt.ObjectExpression).properties.filter(
                n => bt.isObjectMethod(n) || bt.isObjectProperty(n)
              ) as (bt.ObjectMethod | bt.ObjectProperty)[]

              properties.forEach(node => {
                const commentsRes: CommentResult = getComments(node)
                // Collect only methods that have @vuese annotations
                if (commentsRes.vuese) {
                  const result: MethodResult = {
                    name: node.key.name,
                    describe: commentsRes.default,
                    argumentsDesc: commentsRes.arg
                  }
                  if (onMethod) onMethod(result)
                }
              })
            }
          },
          CallExpression(path: NodePath<bt.CallExpression>) {
            const node = path.node
            // this.$emit()
            if (
              bt.isMemberExpression(node.callee) &&
              bt.isThisExpression(node.callee.object) &&
              bt.isIdentifier(node.callee.property) &&
              node.callee.property.name === '$emit' &&
              bt.isExpressionStatement(path.parentPath.node)
            ) {
              const { onEvent } = this.options
              const args = node.arguments
              const result: EventResult = {
                name: ''
              }
              const firstArg = args[0]

              if (args.length && bt.isStringLiteral(firstArg)) {
                result.name = firstArg.value
              }

              if (!result.name || this.seenEvent.has(result.name)) return
              this.seenEvent.add(result.name)

              const allComments: CommentResult = getComments(
                path.parentPath.node
              )
              result.describe = allComments.default
              result.argumentsDesc = allComments.arg

              if (onEvent) onEvent(result)
            }
          }
        },
        {
          options,
          seenEvent
        }
      )
    }
  })
}
