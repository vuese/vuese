import generate from '@babel/generator'
import * as bt from '@babel/types'

/**
 * If a node satisfies the following conditions, then we will use this node as a Vue component.
 * 1. It is a default export
 * 2. others...
 */
export function isVueComponent(node: object): boolean {
  return bt.isExportDefaultDeclaration(node)
}

export function getValueFromGenerate(node: any) {
  let code: string = 'return'
  const { code: genCode } = generate(node)
  code += genCode
  const fn = new Function(code)
  try {
    return fn()
  } catch (e) {
    console.error(e)
  }
}

export function isPropsOption(path: any): boolean {
  if (
    bt.isObjectProperty(path.node) &&
    path.parentPath &&
    path.parentPath.parentPath &&
    isVueComponent(path.parentPath.parentPath.node)
  ) {
    const keyPath = path.get('key')
    return keyPath.node.name === 'props'
  }
  return false
}
