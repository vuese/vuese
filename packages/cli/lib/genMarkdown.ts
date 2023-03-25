/* eslint-disable prefer-const */
import path from 'path'
import fg from 'fast-glob'
import fs from 'fs-extra'
import Log from 'log-horizon'
import { CliOptions, getConfig } from '.'
import { parser } from '@vuese/parser'
import Render from '@vuese/markdown-render'

type MarkdownResult = Promise<
  Promise<
    | {
        compName: string
        groupName: string
        content: string
      }
    | undefined
  >[]
>

const logger = Log.create()

export default async (config: CliOptions): MarkdownResult => {
  let {
    include,
    exclude,
    outDir,
    markdownDir,
    markdownFile,
    babelParserPlugins,
    isPreview,
    genType,
    keepFolderStructure
  } = config

  if (!isPreview) logger.progress('Start creating markdown files...')

  if (typeof include === 'string') include = [include]
  if (typeof exclude === 'string') exclude = [exclude]
  exclude = exclude.concat('node_modules/**/*.(vue|js)')

  const files = await fg(include.concat(exclude.map(p => `!${p}`)))

  return files.map(async (p: string) => {
    const abs = path.resolve(p)
    const source = await fs.readFile(abs, 'utf-8')
    try {
      const { parserOptions } = await getConfig({});
      const parserRes = parser(source, Object.assign({
        babelParserPlugins,
        basedir: path.dirname(abs),
        jsFile: abs.endsWith('.js')
      }, parserOptions))
      const r = new Render(parserRes)
      const markdownRes = r.renderMarkdown()

      if (!markdownRes) return

      let str = markdownRes.content
      const compName = markdownRes.componentName
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

      const folderStructureMiddlePath: string = keepFolderStructure
        ? getGlobPatternMatchPath(include as string[], path.dirname(p))
        : ''
      const target = path.resolve(
        targetDir,
        folderStructureMiddlePath,
        targetFile + '.md'
      )
      if (!isPreview) {
        await fs.ensureDir(path.resolve(targetDir, folderStructureMiddlePath))
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

function getGlobPatternMatchPath(
  globPatternList: string[],
  targetPath: string
): string {
  let index = Infinity
  let res = ''
  for (let i = 0; i < globPatternList.length; i++) {
    let ep: string = explicitPrefix(globPatternList[i])
    if (targetPath.startsWith(ep) && ep.length < index) {
      index = ep.length
      res = ep
    }
  }
  res = targetPath.slice(res.length)
  return res[0] === '/' ? res.slice(1) : res
}

function explicitPrefix(pattern: string): string {
  let patternList = pattern.split('/')
  let resi = 0
  while (patternList[resi] && patternList[resi] !== '**') {
    resi++
  }
  return patternList.slice(0, resi).join('/')
}
