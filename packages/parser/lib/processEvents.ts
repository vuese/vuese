import * as bt from '@babel/types'
import { EventResult } from './index'

export function processEventName(eventName: string, result: EventResult) {
  const syncRE = /^update:(.+)/
  const eventNameMatchs = eventName.match(syncRE)
  result.name = eventName
  // Mark as .sync
  if (eventNameMatchs) {
    result.isSync = true
    result.syncProp = eventNameMatchs[1]
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
