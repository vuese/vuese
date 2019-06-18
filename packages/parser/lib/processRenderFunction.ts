import { NodePath } from '@babel/traverse'
import * as bt from '@babel/types'
import { SlotResult, ParserOptions } from '@vuese/parser'
import { CommentResult, getComments } from './jscomments'

/**
 * Used to identify ctx.children in the render function and use it as the default slot
 * @param functionPath The node path of the render function
 * @param onSlot
 */
export function determineChildren(
  functionPath: NodePath,
  onSlot: ParserOptions['onSlot']
) {
  if (!bt.isFunction(functionPath.node)) return

  // Get the last argument of the render function and use it as the render context
  const lastParamNode =
    functionPath.node.params[functionPath.node.params.length - 1]
  if (!lastParamNode || !bt.isIdentifier(lastParamNode)) return

  // Get the binding of the context within the scope of the render function
  let contextBinding = null
  const bindingKeys = Object.keys(functionPath.scope.bindings)
  for (let i = 0; i < bindingKeys.length; i++) {
    if (bindingKeys[i] === lastParamNode.name) {
      contextBinding = functionPath.scope.bindings[lastParamNode.name]
    }
  }
  if (!contextBinding) return

  // Determine ctx.childer
  contextBinding.referencePaths.forEach(refPath => {
    if (
      bt.isIdentifier(refPath.node) &&
      refPath.parentPath &&
      bt.isMemberExpression(refPath.parentPath.node) &&
      bt.isIdentifier(refPath.parentPath.node.property) &&
      refPath.parentPath.node.property.name === 'children'
    ) {
      const slotRes: SlotResult = {
        name: 'default',
        describe: '',
        backerDesc: '',
        scoped: false,
        bindings: {},
        target: 'script'
      }

      const commentsRes: CommentResult = bt.isExpressionStatement(
        refPath.parentPath.parentPath
      )
        ? getComments(refPath.parentPath.parentPath.node)
        : getComments(refPath.parentPath.node)

      slotRes.describe = commentsRes.default.join('')
      slotRes.backerDesc = commentsRes.content
        ? commentsRes.content.join('')
        : ''

      if (onSlot) onSlot(slotRes)
    }
  })
}
