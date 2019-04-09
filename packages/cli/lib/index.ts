import cac from 'cac'
import JoyCon from 'joycon'
import fs from 'fs-extra'
import { BabelParserPlugins } from '@vuese/parser'
import Log from 'log-horizon'
import preview from './preview'
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
  markdownFile: string
  genType: 'docute' | 'markdown'
  title: string
  babelParserPlugins: BabelParserPlugins
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
    genType: 'docute',
    title: 'Components',
    include: '**/*.vue',
    exclude: [],
    outDir: 'website',
    markdownDir: 'components',
    markdownFile: ''
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
    if (!['docute', 'markdown'].includes(config.genType as string)) {
      logger.error(`Please provide the correct genType: ${config.genType}`)
    }
    if (config.genType === 'docute') genDocute(config as CliOptions)
    else if (config.genType === 'markdown') genMarkdown(config as CliOptions)
  })

cli
  .command('serve', 'Serve generated docute website')
  .option('--open', 'Open the browser automatically')
  .action(async flags => {
    const config = await getConfig(flags)
    server(config as CliOptions)
  })

cli.version(require('../package.json').version)
cli.help()

cli.parse()
