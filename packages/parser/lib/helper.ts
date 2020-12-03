import generate from '@babel/generator'
import { NodePath, Node } from '@babel/traverse'
import * as bt from '@babel/types'
/**
 * If a node satisfies the following conditions, then we will use this node as a Vue component.
 * 1. It is a default export
 * 2. others...
 */
export function isVueComponent(
  path: NodePath,
  componentLevel: number
): boolean {
  const node = path.node
  return (
    bt.isExportDefaultDeclaration(node) ||
    bt.isVariableDeclarator(node) ||
    // this branch for determine if the component is Vue.extend CallExpression
    (bt.isCallExpression(node) &&
      bt.isMemberExpression(node.callee) &&
      bt.isIdentifier(node.callee.object) &&
      bt.isIdentifier(node.callee.property) &&
      node.callee.object.name === 'Vue' &&
      node.callee.property.name === 'extend') ||
    (bt.isReturnStatement(node) && componentLevel === 1)
  )
}

function isValidObjectProperty(node: Node): boolean {
  return bt.isObjectProperty(node) || bt.isObjectMethod(node)
}

export function isVueOption(
  path: NodePath<bt.ObjectProperty> | NodePath<bt.ObjectMethod>,
  optionsName: string,
  componentLevel: number
): boolean {
  if (
    isValidObjectProperty(path.node) &&
    path.parentPath &&
    path.parentPath.parentPath &&
    isVueComponent(path.parentPath.parentPath, componentLevel)
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
  const { code: genCode } = generate(fnCode as any)
  const code = `return (${genCode})()`
  try {
    const fn = new Function(code)
    if (typeof fn() === 'object') {
      return JSON.stringify(fn())
    }
    return fn()
  } catch (e) {
    return
  }
}

export function getValueFromGenerate(node: any): any {
  let code = 'return'
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
  if (node === undefined) {
    return false
  }

  let fromStore = false
  if (bt.isObjectMethod(node) || bt.isArrowFunctionExpression(node)) {
    fromStore = computesFromStore(node.body)
  } else if (bt.isObjectProperty(node)) {
    fromStore = computesFromStore(node.value)
  } else if (bt.isBlockStatement(node)) {
    fromStore = computesFromStore(node.body[node.body.length - 1])
  } else if (bt.isCallExpression(NodePath)) {
    fromStore = computesFromStore(node.callee)
  } else if (bt.isMemberExpression(node)) {
    if (bt.isThisExpression(node.object)) {
      fromStore = node.property.name.toLowerCase().includes('store')
    } else {
      fromStore = computesFromStore(node.object)
    }
  } else if (bt.isReturnStatement(node) || node.type.includes('Expression')) {
    fromStore = computesFromStore(node.argument)
  }

  return fromStore
}

export function getLiteralValue(node: bt.Node): string {
  let data = ''
  if (
    bt.isStringLiteral(node) ||
    bt.isBooleanLiteral(node) ||
    bt.isNumericLiteral(node)
  ) {
    data = node.value.toString()
  }
  return data
}
