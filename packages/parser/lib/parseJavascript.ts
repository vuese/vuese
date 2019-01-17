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
  getArgumentFromPropDecorator,
  getEmitDecorator,
  getComponentDescribe
} from './helper'

export function parseJavascript(ast: bt.File, options: ParserOptions = {}) {
  const seenEvent = new Set()

  traverse(ast, {
    ExportDefaultDeclaration(rootPath: NodePath<bt.ExportDefaultDeclaration>) {
      // Get a description of the component
      if (options.onDesc) options.onDesc(getComponentDescribe(rootPath.node))

      rootPath.traverse({
        ObjectProperty(path: NodePath<bt.ObjectProperty>) {
          const { onProp, onMethod, onName } = options
          // Processing name
          if (isVueOption(path, 'name')) {
            let componentName = (path.node.value as bt.StringLiteral).value
            if (onName) onName(componentName)
          }

          // Processing props
          if (isVueOption(path, 'props')) {
            const valuePath = path.get('value')

            if (bt.isArrayExpression(valuePath.node)) {
              // An array of strings
              const propsValue: [] = getValueFromGenerate(valuePath.node)
              const propsRes: PropsResult[] = normalizeProps(propsValue)
              propsRes.forEach(prop => {
                if (onProp) onProp(prop)
              })
            } else if (bt.isObjectExpression(valuePath.node)) {
              // An object
              valuePath.traverse({
                ObjectProperty(propPath: NodePath<bt.ObjectProperty>) {
                  // Guarantee that this is the prop definition
                  if (propPath.parentPath === valuePath) {
                    const name = propPath.node.key.name
                    const propValueNode = propPath.node.value
                    const result: PropsResult = {
                      name,
                      type: null,
                      describe: getComments(propPath.node).default
                    }

                    processPropValue(propValueNode, result)

                    if (onProp) onProp(result)
                  }
                }
              })
            }
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
            const { onEvent } = options
            const args = node.arguments
            const result: EventResult = {
              name: '',
              isSync: false,
              syncProp: ''
            }
            const firstArg = args[0]
            if (firstArg && bt.isStringLiteral(firstArg)) {
              processEventName(firstArg.value, result)
            }

            if (!result.name || seenEvent.has(result.name)) return
            seenEvent.add(result.name)

            const allComments: CommentResult = getComments(path.parentPath.node)
            result.describe = allComments.default
            result.argumentsDesc = allComments.arg

            if (onEvent) onEvent(result)
          }
        }
      })
    },
    // Class style component
    ClassProperty(path: NodePath<bt.ClassProperty>) {
      const propDecoratorArg = getArgumentFromPropDecorator(path.node)
      if (!propDecoratorArg) return

      const result: PropsResult = {
        name: (path.node.key as bt.Identifier).name,
        type: null,
        describe: getComments(path.node).default
      }
      processPropValue(propDecoratorArg, result)

      if (options.onProp) options.onProp(result)
    },
    ClassMethod(path: NodePath<bt.ClassMethod>) {
      const node = path.node
      const commentsRes: CommentResult = getComments(node)
      // Collect only methods that have @vuese annotations
      if (commentsRes.vuese) {
        const result: MethodResult = {
          name: (node.key as bt.Identifier).name,
          describe: commentsRes.default,
          argumentsDesc: commentsRes.arg
        }
        if (options.onMethod) options.onMethod(result)
      }

      // @Emit
      const emitDecorator = getEmitDecorator(node.decorators)
      if (emitDecorator) {
        const result: EventResult = {
          name: '',
          isSync: false,
          syncProp: ''
        }
        const args = (emitDecorator.expression as bt.CallExpression).arguments
        if (args && args.length && bt.isStringLiteral(args[0])) {
          result.name = (args[0] as bt.StringLiteral).value
        } else {
          if (bt.isIdentifier(node.key)) {
            result.name = node.key.name.replace(/([A-Z])/g, '-$1').toLowerCase()
          }
        }
        if (result.name) processEventName(result.name, result)

        if (!result.name || seenEvent.has(result.name)) return
        seenEvent.add(result.name)

        const allComments: CommentResult = getComments(node)
        result.describe = allComments.default
        result.argumentsDesc = allComments.arg

        if (options.onEvent) options.onEvent(result)
      }
    }
  })
}

function normalizeProps(props: string[]): PropsResult[] {
  return props.map(prop => ({
    type: null,
    name: prop
  }))
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

function processEventName(eventName: string, result: EventResult) {
  const syncRE = /^update:(.+)/
  const eventNameMatchs = eventName.match(syncRE)
  result.name = eventName
  // Mark as .sync
  if (eventNameMatchs) {
    result.isSync = true
    result.syncProp = eventNameMatchs[1]
  }
}

function processPropValue(propValueNode: bt.Node, result: PropsResult) {
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

    otherNodes.forEach((node: any) => {
      const n = node.key.name
      if (n === 'default') {
        if (!hasFunctionTypeDef(result.type) && bt.isFunction(node.value)) {
          result.default = runFunction(node.value)
        } else {
          if (bt.isObjectMethod(node)) {
            result.default = generate(node).code
          } else {
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
