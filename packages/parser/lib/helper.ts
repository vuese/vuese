import generate from '@babel/generator'
import { NodePath, Node } from '@babel/traverse'
import * as bt from '@babel/types'

/**
 * If a node satisfies the following conditions, then we will use this node as a Vue component.
 * 1. It is a default export
 * 2. others...
 */
export function isVueComponent(node: bt.Node): boolean {
  return bt.isExportDefaultDeclaration(node)
}

function isValidObjectProperty(node: Node) {
  return bt.isObjectProperty(node) || bt.isObjectMethod(node)
}

export function isVueOption(
  path: NodePath<bt.ObjectProperty | bt.ObjectMethod>,
  optionsName: string
): boolean {
  if (
    isValidObjectProperty(path.node) &&
    path.parentPath &&
    path.parentPath.parentPath &&
    isVueComponent(path.parentPath.parentPath.node)
  ) {
    // General component options
    return path.node.key.name === optionsName
  } else if (
    isValidObjectProperty(path.node) &&
    path.parentPath &&
    path.parentPath.parentPath &&
    bt.isCallExpression(path.parentPath.parentPath.node) &&
    (path.parentPath.parentPath.node.callee as bt.Identifier).name ===
      'Component' &&
    path.parentPath.parentPath.parentPath &&
    bt.isDecorator(path.parentPath.parentPath.parentPath.node)
  ) {
    // options in ts @Component({...})
    return path.node.key.name === optionsName
  }
  return false
}

export function runFunction(fnCode: bt.Node): any {
  const { code: genCode } = generate(fnCode)
  const code = `return (${genCode})()`
  try {
    const fn = new Function(code)
    return fn()
  } catch (e) {
    return
  }
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

export function computesFromStore(node: any): boolean {
  let fromStore = false
  if (node.type === 'ObjectMethod') {
    fromStore = computesFromStore(node.body)
  } else if (node.type === 'BlockStatement') {
    fromStore = computesFromStore(node.body[0])
  } else if (node.type === 'CallExpression') {
    fromStore = computesFromStore(node.callee)
  } else if (node.type === 'MemberExpression') {
    if (node.object.type === 'ThisExpression') {
      if (node.property.name.includes('store')) {
        fromStore = true
      }
    } else {
      fromStore = computesFromStore(node.object)
    }
  } else if (
    node.type === 'ReturnStatement' ||
    node.type.includes('Expression')
  ) {
    fromStore = computesFromStore(node.argument)
  }

  return fromStore
}
