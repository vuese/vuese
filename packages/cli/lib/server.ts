import path from 'path'
import getPort from 'get-port'
import open from 'open'
import Log from 'log-horizon'
import { CliOptions } from '.'

const logger = Log.create()

export default async (config: CliOptions) => {
  const http = require('http')
  const handler = require('serve-handler')
  const server = http.createServer((req: any, res: any) => {
    return handler(req, res, {
      public: path.resolve(config.outDir)
    })
  })
  const port = config.port || (await getPort({ port: 5000 }))

  server.listen(port, config.host, () => {
    const addr = `http://${config.host}:${port}/`
    logger.success(`Server running at ${addr}`)
    if (config.open) open(addr)
  })
}
