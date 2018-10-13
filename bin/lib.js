const fg = require('fast-glob')
const path = require('path')
const majo = require('majo')

module.exports = async function(config) {
  let { include, exclude, outDir } = config
  if (typeof include === 'string') include = [include]
  if (typeof exclude === 'string') exclude = [exclude]

  const files = await fg(include.concat(exclude.map(p => `!${p}`)))
  const mdTemplate = await majo.fs.readFile(path.resolve(__dirname, './templates/md.md'), 'utf-8')
  const nameRE = /\[name\]/g
  const htmlCommentRE = /<!--\s*@vuese:(\w+):(\w+)\s*-->/
  
  const { parser, Render } = require('../dist/vuese')
  files.forEach(async p => {
    const abs = path.resolve(p)
    const source = await majo.fs.readFile(abs, 'utf-8')
    const parserRes = parser(source)
    const r = new Render(parserRes)
    const renderRes = r.render()
    let str = ''
    let compName = parserRes.name
    if (!compName) compName = path.basename(abs, '.vue')

    str = mdTemplate.replace(nameRE, compName)

    let index = 0, stream = str
    while(stream) {
      const res = stream.match(htmlCommentRE)
      if (res) {
        const matchText = res[0]
        const type = res[2]
        const insertText = matchText + '\n' + (renderRes[type] || '')
        const i = stream.indexOf(matchText)

        str = str.replace(matchText, insertText)
        index = i + matchText.length
      } else {
        index = stream.length
      }
      stream = stream.slice(index)
    }

    const targetDir = path.resolve(outDir)
    const target = path.resolve(outDir, compName + '.md')
    await majo.fs.ensureDir(targetDir)
    majo.fs.writeFile(target, str)
  })
}