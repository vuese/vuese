import path from 'path'
import fg from 'fast-glob'
import fs from 'fs-extra'
import Log from 'log-horizon'
import { CliOptions } from '.'
import { parser } from '@vuese/parser'
import Render from '@vuese/markdown-render'

const logger = Log.create()

export default async (config: CliOptions) => {
  let {
    include,
    exclude,
    outDir,
    markdownDir,
    markdownFile,
    babelParserPlugins,
    isPreview,
    genType
  } = config

  if (!isPreview) logger.progress('Start creating markdown files...')

  if (typeof include === 'string') include = [include]
  if (typeof exclude === 'string') exclude = [exclude]
  exclude = exclude.concat('node_modules/**/*.vue')

  const files = await fg(include.concat(exclude.map(p => `!${p}`)))

  return files.map(async (p: string) => {
    const abs = path.resolve(p)
    const source = await fs.readFile(abs, 'utf-8')
    try {
      const parserRes = parser(source, {
        babelParserPlugins,
        basedir: path.dirname(abs)
      })
      const r = new Render(parserRes)
      let markdownRes = r.renderMarkdown()

      if (!markdownRes) return

      let str = markdownRes.content
      let compName = markdownRes.componentName
        ? markdownRes.componentName
        : path.basename(abs, '.vue')
      const groupName = markdownRes.groupName

      str = str.replace(/\[name\]/g, compName)
      let targetDir = ''
      let targetFile = ''
      if (genType === 'markdown' && markdownDir === '*') {
        targetDir = path.dirname(abs)
        targetFile = markdownFile || compName
      } else {
        targetDir = path.resolve(
          outDir,
          markdownDir === '*' ? 'components' : markdownDir
        )
        targetFile = compName
      }

      const target = path.resolve(targetDir, targetFile + '.md')

      if (!isPreview) {
        await fs.ensureDir(targetDir)
        await fs.writeFile(target, str)
        logger.success(`Successfully created: ${target}`)
      }

      return {
        compName,
        groupName,
        content: str
      }
    } catch (e) {
      logger.error(`The error occurred when processing: ${abs}`)
      logger.error(e)
    }
  })
}
