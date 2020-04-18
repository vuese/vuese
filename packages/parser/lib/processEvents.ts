import * as bt from '@babel/types'
import { NodePath } from '@babel/traverse'
import { EventResult } from './index'
import { getComments, CommentResult } from './jscomments'

/**
 *
 * @param eventName {string} The event name
 * @param cnode {bt.Node} Node with comments
 * @param result {EventResult}
 */
export function processEventName(
  eventName: string,
  cnodePath: NodePath<bt.Node>,
  result: EventResult
): void {
  const cnode = cnodePath.node
  const syncRE = /^update:(.+)/
  const eventNameMatchs = eventName.match(syncRE)
  // Mark as .sync
  if (eventNameMatchs) {
    result.isSync = true
    result.syncProp = eventNameMatchs[1]
  }

  let allComments: CommentResult = getComments(cnode)
  const prevPathKey = Number(cnodePath.key) - 1
  if (!allComments.default.length && prevPathKey >= 0) {
    // Use the trailing comments of the prev node
    allComments = getComments(cnodePath.getSibling(prevPathKey).node, true)
    result.describe = allComments.default
    result.argumentsDesc = allComments.arg
  } else {
    result.describe = allComments.default
    result.argumentsDesc = allComments.arg
  }
}

export function getEmitDecorator(
  decorators: bt.Decorator[] | null
): bt.Decorator | null {
  if (!decorators || !decorators.length) return null
  for (let i = 0; i < decorators.length; i++) {
    const exp = decorators[i].expression
    if (
      bt.isCallExpression(exp) &&
      bt.isIdentifier(exp.callee) &&
      exp.callee.name === 'Emit'
    ) {
      return decorators[i]
    }
  }
  return null
}
