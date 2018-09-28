import * as bt from '@babel/types'

/**
 * If a node satisfies the following conditions, then we will use this node as a Vue component.
 * 1. It is a default export
 * 2. others...
 */
export default function(node: object): boolean {
  return bt.isExportDefaultDeclaration(node)
}
