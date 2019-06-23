import * as bt from '@babel/types'
import { getLiteralValue } from './helper'
import { DataResult } from './index'

export function processDataValue(
  dataNode: bt.ObjectProperty,
  result: DataResult
) {
  result.type = getTypeByDataNode(dataNode)
  result.default = getValueByDataNode(dataNode.value)
}

function getTypeByDataNode(node: bt.ObjectProperty): string {
  if (bt.isObjectMethod(node) || bt.isArrowFunctionExpression(node.value))
    return 'Function'
  let dataNode = node.value
  if (bt.isIdentifier(dataNode)) return dataNode.name

  if (bt.isAssignmentExpression(dataNode) || bt.isAssignmentPattern(dataNode)) {
    if (bt.isIdentifier(dataNode.left)) {
      return dataNode.left.name
    }
  }

  if (
    bt.isLiteral(dataNode) ||
    (bt.isExpression(dataNode) && !bt.isBinaryExpression(dataNode))
  ) {
    return literalToType(dataNode.type)
  }
  return ''
}

function getValueByDataNode(dataNode: bt.Node): string {
  if (bt.isArrayExpression(dataNode)) {
    if (!dataNode.elements.length) return ''

    return (
      '[' +
      dataNode.elements
        .filter(node => node && bt.isLiteral(node))
        .map(node => getLiteralValue(node as bt.Literal))
        .toString() +
      ']'
    )
  }

  if (bt.isLiteral(dataNode)) {
    return getLiteralValue(dataNode)
  }

  if (bt.isAssignmentExpression(dataNode) || bt.isAssignmentPattern(dataNode)) {
    if (bt.isLiteral(dataNode.right)) {
      return getLiteralValue(dataNode.right)
    }
  }
  return ''
}

function literalToType(literal: string) {
  let type = literal
    .replace('Literal', '')
    .replace('Expression', '')
    .replace('Numeric', 'Number')
  return type
}
