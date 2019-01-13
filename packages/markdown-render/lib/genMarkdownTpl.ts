import { ParserResult } from '@vuese/parser'

export default function(parserRes: ParserResult) {
  let templateStr = '# [name]\n\n'
  let original = templateStr

  if (parserRes.componentDesc && parserRes.componentDesc.length) {
    templateStr += `${parserRes.componentDesc.join('')}\n\n`
  }

  templateStr += parserRes.props ? genBaseTemplate('props') : ''
  templateStr += parserRes.events ? genBaseTemplate('events') : ''
  templateStr += parserRes.slots ? genBaseTemplate('slots') : ''
  templateStr += parserRes.methods ? genBaseTemplate('methods') : ''

  return original === templateStr ? '' : templateStr
}

function genBaseTemplate(label: string) {
  let str = `## ${upper(label)}\n\n`
  str += `<!-- @vuese:[name]:${label}:start -->\n`
  str += `<!-- @vuese:[name]:${label}:end -->\n\n`
  return str
}

function upper(word: string) {
  return word[0].toUpperCase() + word.slice(1)
}
