import genMarkdownTpl from './genMarkdownTpl'
import { ParserResult } from '@vuese/parser'
import { RenderResult } from '@vuese/markdown-render'

const nameRE = /\[name\]/g
const htmlCommentRE = /<!--\s*@vuese:([a-zA-Z_][\w\-\.]*|\[name\]):(\w+):start\s*-->[^]*<!--\s*@vuese:\1:\2:end\s*-->/

export interface MarkdownResult {
  content: string
  componentName: string
  groupName: string
}

export default function(
  renderRes: RenderResult,
  parserRes: ParserResult
): MarkdownResult | null {
  const mdTemplate = genMarkdownTpl(parserRes)

  // Indicates that this component has no documentable content
  if (!mdTemplate) return null

  let str = mdTemplate
  const compName = parserRes.name
  const groupName =
    parserRes.componentDesc && parserRes.componentDesc.group
      ? parserRes.componentDesc.group[0]
      : undefined

  if (compName) {
    str = mdTemplate.replace(nameRE, compName)
  }

  let index = 0,
    stream = str
  while (stream) {
    const res = stream.match(htmlCommentRE)
    if (res) {
      const matchText = res[0]
      const type = res[2] as keyof RenderResult
      const i = stream.indexOf(matchText)
      const currentHtmlCommentRE = new RegExp(
        `<!--\\s*@vuese:(${
          compName ? compName : '\\[name\\]'
        }):(${type}):start\\s*-->[^]*<!--\\s*@vuese:\\1:\\2:end\\s*-->`
      )
      str = str.replace(currentHtmlCommentRE, (s, c1, c2) => {
        if (renderRes[type]) {
          let code = `<!-- @vuese:${c1}:${c2}:start -->\n`
          code += renderRes[type]
          code += `\n<!-- @vuese:${c1}:${c2}:end -->\n`
          return code
        }
        return s
      })
      index = i + matchText.length
    } else {
      index = stream.length
    }
    stream = stream.slice(index)
  }

  return {
    content: str,
    componentName: compName || '',
    groupName: groupName || 'BASIC'
  }
}
