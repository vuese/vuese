const path = require('path')
const getPort = require('get-port')
const opn = require('opn')
const logger = require('log-horizon').create()

module.exports = async (config) => {
  const servePath = path.resolve(config.outDir)
  const http = require('http')
  const handler = require('serve-handler')
  const server = http.createServer((req, res) => {
    return handler(req, res, {
      public: path.resolve(config.outDir)
    })
  })
  const port = await getPort({ port: 5000 })
  
  server.listen(port, '127.0.0.1',() => {
    const addr = `http://127.0.0.1:${port}/`
    logger.success(`Server running at ${addr}`);
    if (config.open) opn(addr)
  })
}
