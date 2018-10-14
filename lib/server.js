const path = require('path')
const getProt = require('get-port')
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
  const port = await getProt({ prot: 5000 })
  
  server.listen(port, '127.0.0.1',() => {
    logger.success(`Server running at http://127.0.0.1:${port}/`);
  })
}