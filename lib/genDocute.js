const sao = require('sao')
const path = require('path')
const lib = require('./index')
const logger = require('log-horizon').create()

module.exports = async config => {
  try {
    const componentsPromise = await lib(config)
    const componentRes = await Promise.all(componentsPromise)
    const componentNames = componentRes.filter(_ => _).map(res => {
      return res.compName
    })
    logger.progress('Start generating...')
    await sao({
      template: path.resolve(__dirname, './templates/docute'),
      targetPath: path.resolve(config.outDir),
      configOptions: {
        componentNames,
        title: config.title,
        markdownDir: config.markdownDir
      }
    })
    logger.success('Generated successfully')
  } catch (err) {
    console.error(err.name === 'SAOError' ? err.message : err.stack)
    process.exit(1)
  }
}
