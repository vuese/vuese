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

cli.command('*', 'vuese cli', async (input, flags) => {
  const { path, data } = await joycon.load(['vuese.config.js', '.vueserc', 'package.json'])
  const config = {}
  if (path) Object.assign(config, data, flags)
  require('./lib')(config)
})

cli.parse()