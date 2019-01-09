module.exports = function(parserRes) {
  let templateStr = '# [name]\n\n'
  let original = templateStr

  templateStr += parserRes.props ? genBaseTemplate('props') : ''
  templateStr += parserRes.events ? genBaseTemplate('events') : ''
  templateStr += parserRes.slots ? genBaseTemplate('slots') : ''
  templateStr += parserRes.methods ? genBaseTemplate('methods') : ''

  return original === templateStr ? '' : templateStr
}

function genBaseTemplate(label) {
  let str = `## ${upper(label)}\n\n`
  str += `<!-- @vuese:[name]:${label}:start -->\n`
  str += `<!-- @vuese:[name]:${label}:end -->\n\n`
  return str
}

function upper(word) {
  return word[0].toUpperCase() + word.slice(1)
}
