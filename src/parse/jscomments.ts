import { isCommentLine, isCommentBlock, writeFileSync } from '../helpers'

export type CommentResult = {
  default: string[]
  [key: string]: string[]
}
const commentRE = /\n\s*\*?\s*/g
const leadRE = /^@(\w+)\s+/

export function getComments(path: any): CommentResult {
  const res: CommentResult = {
    default: []
  }
  const commentNodes: [] | undefined = path.node.leadingComments
  writeFileSync(commentNodes)
  if (!commentNodes || !commentNodes.length) return res

  let comments: string = '',
    matchs: RegExpMatchArray | null
  ;(commentNodes as []).forEach((node: any) => {
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
        .trim()
      let currentKey = 'default'
      comments.split('\n').forEach(c => {
        if ((matchs = c.match(leadRE))) {
          currentKey = matchs[1]
          res[currentKey] = res[currentKey] || []
          res[currentKey].push(comments.replace(leadRE, ''))
        } else {
          res.default.push(c)
        }
      })
    }
  })
  return res
}
