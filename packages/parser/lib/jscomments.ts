import * as bt from '@babel/types'

export interface CommentResult {
  default: string[]
  [key: string]: string[]
}
const commentRE = /\s*\*\s{1}/g
const leadRE = /^@(\w+)\b/

/**
 * @param cnode {bt.Node} a node with comments
 * @param trailing {boolean} Whether to process the tailing comment
 */
export function getComments(cnode: bt.Node, trailing?: boolean): CommentResult {
  const res: CommentResult = {
    default: []
  }
  const commentNodes = trailing
    ? cnode.trailingComments || []
    : cnode.leadingComments || []
  if (!commentNodes || !commentNodes.length) return res

  let comments: string | string[] = '',
    matchs: RegExpMatchArray | null,
    codeBlockStarted: boolean
  ;(commentNodes as []).forEach((node: bt.Comment) => {
    if (isCommentLine(node)) {
      if (isCodeBlockDeclaration(node.value) && codeBlockStarted)
        codeBlockStarted = false

      comments = codeBlockStarted
        ? node.value.replace(/^\s/, '')
        : node.value.trim()

      if (
        isCodeBlockDeclaration(node.value) &&
        typeof codeBlockStarted === 'undefined'
      )
        codeBlockStarted = true

      matchs = comments.match(leadRE)
      if (matchs) {
        const key: string = matchs[1]
        res[key] = res[key] || []
        res[key].push(comments.replace(leadRE, '').trim())
      } else {
        res.default.push(comments)
      }
    } else if (isCommentBlock(node)) {
      comments = node.value
        .replace(commentRE, '\n')
        .replace(/^\*/, '')
        .split('\n')
      comments = filterBlockComments(comments)
      let currentKey = 'default'
      ;(comments as string[]).forEach(c => {
        if ((matchs = c.match(leadRE))) {
          currentKey = matchs[1]
          res[currentKey] = res[currentKey] || []
          res[currentKey].push(c.replace(leadRE, '').trim())
        } else {
          res.default.push(c)
        }
      })
    }
  })
  return res
}

/**
 * Extract the leading comments of the default export statement
 * 1、If the default export is a class with a decorator,
 *    we should find the trailing comments of the last decorator node.
 * 2、In other cases, directly use the leading commets of the default export statement.
 */
export function getComponentDescribe(
  node: bt.ExportDefaultDeclaration
): CommentResult {
  let res: CommentResult = {
    default: []
  }
  if (bt.isClassDeclaration(node.declaration)) {
    const decorators = node.declaration.decorators
    if (decorators && decorators.length) {
      res = getComments(decorators[decorators.length - 1], true /* trailing */)
    }
  } else {
    res = getComments(node)
  }
  return res
}

export function isCommentLine(node: { type: string }): boolean {
  return node.type === 'CommentLine'
}

export function isCommentBlock(node: { type: string }): boolean {
  return node.type === 'CommentBlock'
}

export function isCodeBlockDeclaration(value: string): boolean {
  return value.indexOf('```') > -1
}

export function filterBlockComments(comments: string[]): string[] {
  let codeBlockStarted: boolean

  return comments
    .map(t => {
      if (isCodeBlockDeclaration(t) && codeBlockStarted)
        codeBlockStarted = false

      const res: string = codeBlockStarted ? t : t.trim()

      if (isCodeBlockDeclaration(t) && typeof codeBlockStarted === 'undefined')
        codeBlockStarted = true

      return res
    })
    .filter(t => t)
}
