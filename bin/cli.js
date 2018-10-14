#!/usr/bin/env node

const cac = require('cac')
const JoyCon = require('joycon')
const majo = require('majo')
const path = require('path')
const logger = require('log-horizon').create()

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
  const config = {}
  if (path) Object.assign(config, data, flags)
  return config
}

cli.command('*', 'vuese cli', async (input, flags) => {
  const config = await getConfig(flags)
  require('../lib')(config)
})

cli.command('gen', 'Generate target resources', async (input, flags) => {
  const config = await getConfig(flags)
  const questions = require('./questions')
  const answser = await require('inquirer').prompt(questions)
  if (answser.genType === 'docute') require('../lib/genDocute')(config)
})

cli.command('serve', 'Serve generated docute website', async (input, flags) => {
  const config = await getConfig(flags)
  const servePath = path.resolve(config.outDir)
  const http = require('http')
  const handler = require('serve-handler')
  const server = http.createServer((req, res) => {
    return handler(req, res, {
      public: path.resolve(config.outDir)
    })
  })
  
  server.listen('5000', '127.0.0.1',() => {
    logger.success(`Server running at http://127.0.0.1:5000/`);
  })
})

cli.parse()