import { isCommentLine, isCommentBlock } from '../helpers'

const commentRE = /\n\s*\*\s*/g

export function getComments(path: any): string[] {
  const commentNodes: [] | undefined = path.node.leadingComments
  if (!commentNodes || !commentNodes.length) return []
  return (commentNodes as []).map((node: any) => {
    if (isCommentLine(node)) {
      return node.value.trim()
    } else if (isCommentBlock(node)) {
      return node.value
        .replace(commentRE, '\n')
        .replace(/^\*/, '')
        .trim()
    }
  })
}
