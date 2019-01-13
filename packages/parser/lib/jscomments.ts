import { isCommentLine, isCommentBlock } from './helper'
import * as bt from '@babel/types'

export type CommentResult = {
  default: string[]
  [key: string]: string[]
}
const commentRE = /\s*\*\s*/g
const leadRE = /^@(\w+)\b/

export function getComments(cnode: bt.Node, trailing?: boolean): CommentResult {
  const res: CommentResult = {
    default: []
  }
  const commentNodes = trailing
    ? cnode.trailingComments || []
    : cnode.leadingComments || []
  if (!commentNodes || !commentNodes.length) return res

  let comments: string = '',
    matchs: RegExpMatchArray | null
  ;(commentNodes as []).forEach((node: bt.Comment) => {
    if (isCommentLine(node)) {
      comments = node.value.trim()
      matchs = comments.match(leadRE)
      if (matchs) {
        const key: string = matchs[1]
        res[key] = res[key] || []
        res[key].push(comments.replace(leadRE, ''))
      } else {
        res.default.push(comments)
      }
    } else if (isCommentBlock(node)) {
      comments = node.value
        .replace(commentRE, '\n')
        .replace(/^\*/, '')
        .split('\n')
        .filter(t => t)
        .join('\n')
        .trim()
      let currentKey = 'default'
      comments.split('\n').forEach(c => {
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
