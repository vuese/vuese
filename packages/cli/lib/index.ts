import cac from 'cac'
import JoyCon from 'joycon'
import fs from 'fs-extra'
import inquirer from 'inquirer'
import { ParserPlugin } from '@babel/parser'
import Log from 'log-horizon'
import preview from './preview'
import questions from './questions'
import genDocute from './genDocute'
import genMarkdown from './genMarkdown'
import server from './server'

const logger = Log.create()
const cli = cac()
const joycon = new JoyCon({
  packageKey: 'vuese'
})
joycon.addLoader({
  test: /\.vueserc$/,
  async load(filePath) {
    const source = await fs.readFile(filePath, 'utf-8')
    return JSON.parse(source)
  }
})

export type CliOptions = {
  include: string | string[]
  exclude: string | string[]
  outDir: string
  markdownDir: string
  genType: 'docute' | 'markdown'
  title: string
  babelParserPlugins: ParserPlugin[]
  isPreview: boolean
  open: boolean
}
type PartialCliOptions = Partial<CliOptions>

async function getConfig(flags: PartialCliOptions) {
  const { path, data } = await joycon.load([
    'vuese.config.js',
    '.vueserc',
    'package.json'
  ])
  const config: PartialCliOptions = {
    include: '**/*.vue',
    exclude: [],
    outDir: 'website',
    markdownDir: 'components'
  }
  if (path) Object.assign(config, data, flags)
  Object.assign(config, flags || {})
  return config
}

cli.command('').action(() => {
  cli.outputHelp()
})

cli
  .command('preview [file]', 'Preview a vue component as a document')
  .example('vuese preview path-to-the-component.vue')
  .action(async (file, flags) => {
    if (!file) {
      logger.error('Missing component path.')
      cli.outputHelp()
    }
    const config = await getConfig(flags)
    config.include = file
    config.isPreview = true
    preview(config as CliOptions)
  })

cli
  .command('gen', 'Generate target resources')
  .allowUnknownOptions()
  .action(async flags => {
    const config = await getConfig(flags)
    if (['docute', 'markdown'].indexOf(config.genType as string) < 0) {
      const { genType } = await inquirer.prompt(questions)
      config.genType = genType
    }
    if (config.genType === 'docute') genDocute(config as CliOptions)
    else if (config.genType === 'markdown') genMarkdown(config as CliOptions)
  })

cli.command('serve', 'Serve generated docute website').action(async flags => {
  const config = await getConfig(flags)
  server(config as CliOptions)
})

cli.version(require('../package.json').version)
cli.help()

cli.parse()
