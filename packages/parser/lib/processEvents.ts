import * as bt from '@babel/types'
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
  cnode: bt.Node,
  result: EventResult
) {
  const syncRE = /^update:(.+)/
  const eventNameMatchs = eventName.match(syncRE)
  // Mark as .sync
  if (eventNameMatchs) {
    result.isSync = true
    result.syncProp = eventNameMatchs[1]
  }

  const allComments: CommentResult = getComments(cnode)
  result.describe = allComments.default
  result.argumentsDesc = allComments.arg
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
