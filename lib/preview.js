const carlo = require('carlo')
const { EventEmitter } = require('events')
const parser = require('./markedParser')
const path = require('path')
const fs = require('fs')
const lib = require('./index')
const chokidar = require('chokidar')
const logger = require('log-horizon').create()

module.exports = async config => {
  const sfc = config.include[0]
  config.isPreview = true
  if (!sfc) {
    logger.error('Must provide the path to the .vue file.')
    process.exit(1)
  }
  const vueFile = path.resolve(sfc)

  if (fs.existsSync(vueFile)) {
    async function generate() {
      const componentsPromise = await lib(config)
      const componentsRes = await Promise.all(componentsPromise)
      const content = componentsRes.map(res => res.content)[0]
      return parser(content)
    }

    const app = await carlo.launch()
    app.on('exit', () => process.exit())
    app.serveFolder(__dirname + '/templates/preview')

    class Events extends EventEmitter {}
    const event = new Events()
    await app.exposeObject('event', event)
    await app.exposeFunction('generate', async () => {
      return await generate()
    })

    await app.load('index.html')

    chokidar
      .watch(vueFile, {
        ignoreInitial: true
      })
      .on('change', () => {
        event.emit('update')
      })
  }
}
