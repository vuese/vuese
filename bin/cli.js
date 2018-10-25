#!/usr/bin/env node

const cac = require('cac')
const JoyCon = require('joycon')
const majo = require('majo')

const cli = cac()
const joycon = new JoyCon({
  packageKey: 'vuese'
})
joycon.addLoader({
  test: /\.vueserc$/,
  async load(filePath) {
    const source = await majo.fs.readFile(filePath, 'utf-8')
    return JSON.parse(source)
  }
})

async function getConfig (flags) {
  const { path, data } = await joycon.load(['vuese.config.js', '.vueserc', 'package.json'])
  const config = {
    include: '**/*.vue',
    exclude: [],
    outDir: 'website',
    markdownDir: 'components'
  }
  if (path) Object.assign(config, data, flags)
  return config
}

cli.command('*', 'vuese cli', () => {
  cli.showHelp()
})

cli.command('gen', 'Generate target resources', async (input, flags) => {
  const config = await getConfig(flags)
  const questions = require('./questions')
  if (['docute', 'markdown'].indexOf(config.genType) < 0) {
    const { genType } = await require('inquirer').prompt(questions)
    config.genType = genType
  }
  if (config.genType === 'docute') require('../lib/genDocute')(config)
  else if (config.genType === 'markdown') require('../lib')(config)
})

cli.command('serve', 'Serve generated docute website', async (input, flags) => {
  const config = await getConfig(flags)
  require('../lib/server')(config)
})

cli.parse()
