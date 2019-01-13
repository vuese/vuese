import path from 'path'
import fg from 'fast-glob'
import fs from 'fs-extra'
import Log from 'log-horizon'
import genMarkdownTemplate from './genMarkdownTemp'
import { CliOptions } from '.'
import { parser } from '@vuese/parser'
import Render, { RenderResult } from '@vuese/markdown-render'

const logger = Log.create()

export default async (config: CliOptions) => {
  let {
    include,
    exclude,
    outDir,
    markdownDir,
    babelParserPlugins,
    isPreview
  } = config

  if (!isPreview) logger.progress('Start creating markdown files...')

  if (typeof include === 'string') include = [include]
  if (typeof exclude === 'string') exclude = [exclude]
  exclude = exclude.concat('node_modules/**/*.vue')

  const files = await fg(include.concat(exclude.map(p => `!${p}`)))

  const nameRE = /\[name\]/g
  const htmlCommentRE = /<!--\s*@vuese:([a-zA-Z_][\w\-\.]*):(\w+):start\s*-->[^]*<!--\s*@vuese:\1:\2:end\s*-->/

  return files.map(async (p: string) => {
    const abs = path.resolve(p)
    const source = await fs.readFile(abs, 'utf-8')
    try {
      const parserRes = parser(source, { babelParserPlugins })
      const r = new Render(parserRes)
      const renderRes = r.render()
      const mdTemplate = genMarkdownTemplate(parserRes)

      // Indicates that this component has no documentable content
      if (!mdTemplate) return

      let str = ''
      let compName = parserRes.name

      if (!compName) compName = path.basename(abs, '.vue')

      const targetDir = path.resolve(outDir, markdownDir)
      const target = path.resolve(targetDir, compName + '.md')

      str = mdTemplate.replace(nameRE, compName)

      let index = 0,
        stream = str
      while (stream) {
        const res = stream.match(htmlCommentRE)
        if (res) {
          const matchText = res[0]
          const type = res[2] as keyof RenderResult
          const i = stream.indexOf(matchText)
          const currentHtmlCommentRE = new RegExp(
            `<!--\\s*@vuese:(${compName}):(${type}):start\\s*-->[^]*<!--\\s*@vuese:\\1:\\2:end\\s*-->`
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
      if (!isPreview) {
        await fs.ensureDir(targetDir)
        await fs.writeFile(target, str)
        logger.success(`Successfully created: ${target}`)
      }
      return {
        compName,
        content: str
      }
    } catch (e) {
      logger.error(`The error occurred when processing: ${abs}`)
      logger.error(e)
    }
  })
}
