import traverse, { NodePath } from '@babel/traverse'
import * as bt from '@babel/types'
import { getComments, CommentResult, getComponentDescribe } from './jscomments'
import {
  PropsResult,
  ParserOptions,
  EventResult,
  MethodResult,
  SlotResult
} from './index'
import { getValueFromGenerate, isVueOption } from './helper'
import {
  processPropValue,
  normalizeProps,
  getArgumentFromPropDecorator
} from './processProps'
import { processEventName, getEmitDecorator, SeenEvent } from './processEvents'

export function parseJavascript(ast: bt.File, options: ParserOptions = {}) {
  const seenEvent = new SeenEvent()
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
          // $emit()
          if (
            bt.isMemberExpression(node.callee) &&
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
              result.name = firstArg.value
            }

            if (!result.name || seenEvent.seen(result.name)) return

            processEventName(result.name, path.parentPath.node, result)

            if (onEvent) onEvent(result)
          }
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
            const args = (emitDecorator.expression as bt.CallExpression)
              .arguments
            if (args && args.length && bt.isStringLiteral(args[0])) {
              result.name = (args[0] as bt.StringLiteral).value
            } else {
              if (bt.isIdentifier(node.key)) {
                result.name = node.key.name
                  .replace(/([A-Z])/g, '-$1')
                  .toLowerCase()
              }
            }
            if (!result.name || seenEvent.seen(result.name)) return

            processEventName(result.name, node, result)

            if (options.onEvent) options.onEvent(result)
          }
        },
        MemberExpression(path: NodePath<bt.MemberExpression>) {
          const node = path.node
          const parentNode = path.parentPath.node
          const grandPath = path.parentPath.parentPath
          // (this || vm).$slots.xxx
          if (
            bt.isIdentifier(node.property) &&
            node.property.name === '$slots' &&
            bt.isMemberExpression(parentNode) &&
            grandPath &&
            bt.isExpressionStatement(grandPath)
          ) {
            if (bt.isIdentifier(parentNode.property)) {
              const slotsComments = getComments(grandPath.node)
              const slotRes: SlotResult = {
                name: parentNode.property.name,
                describe: slotsComments.default.join(''),
                backerDesc: slotsComments.content
                  ? slotsComments.content.join('')
                  : '',
                bindings: {}
              }

              if (options.onSlot) options.onSlot(slotRes)
            }
          }
        }
      })
    }
  })
}
