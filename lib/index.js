const fg = require('fast-glob')
const path = require('path')
const majo = require('majo')
const logger = require('log-horizon').create()

module.exports = async (config) => {
  logger.progress('Start creating markdown files...')

  let {
    include,
    exclude,
    outDir,
    markdownDir,
    babelParserPlugins
  } = config

  if (typeof include === 'string') include = [include]
  if (typeof exclude === 'string') exclude = [exclude]
  exclude = exclude.concat('node_modules/**/*.vue')

  const files = await fg(include.concat(exclude.map(p => `!${p}`)))
  const mdTemplate = await majo.fs.readFile(path.resolve(__dirname, './templates/md.md'), 'utf-8')
  const nameRE = /\[name\]/g
  const htmlCommentRE = /<!--\s*@vuese:([a-zA-Z_][\w\-\.]*):(\w+):start\s*-->[^]*<!--\s*@vuese:\1:\2:end\s*-->/
  
  const { parser, Render } = require('../dist/vuese')
  return files.map(async p => {
    const abs = path.resolve(p)
    const source = await majo.fs.readFile(abs, 'utf-8')
    try {
      const parserRes = parser(source, { babelParserPlugins })
      const r = new Render(parserRes)
      const renderRes = r.render()
      let str = ''
      let compName = parserRes.name

      if (!compName) compName = path.basename(abs, '.vue')

      const targetDir = path.resolve(outDir, markdownDir)
      const target = path.resolve(targetDir, compName + '.md')

      const alreadyExists = await majo.fs.pathExists(target)
      if (alreadyExists) {
        const existsTemplate = await majo.fs.readFile(target, 'utf-8')
        str = existsTemplate.replace(nameRE, compName)
      } else {
        str = mdTemplate.replace(nameRE, compName)
      }

      let index = 0, stream = str
      while(stream) {
        const res = stream.match(htmlCommentRE)
        if (res) {
          const matchText = res[0]
          const type = res[2]
          const i = stream.indexOf(matchText)
          const currentHtmlCommentRE = new RegExp(
            `<!--\\s*@vuese:(${compName}):(${type}):start\\s*-->[^]*<!--\\s*@vuese:\\1:\\2:end\\s*-->`
          )
          str = str.replace(currentHtmlCommentRE, (s, c1, c2) => {
            if (renderRes[type]) {
              let code = `<!-- @vuese:${c1}:${c2}:start -->\n`
              code += renderRes[type]
              code += `<!-- @vuese:${c1}:${c2}:end -->\n`
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

      await majo.fs.ensureDir(targetDir)
      await majo.fs.writeFile(target, str)
      logger.success(`Successfully ${alreadyExists ? 'updated' : 'created'}: ${target}`)
      return compName
    } catch (e) {
      logger.error(`The error occurred when processing: ${abs}`)
      logger.error(e)
    }
  })
}