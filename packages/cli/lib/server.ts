import path from 'path'
import getPort from 'get-port'
import opn from 'opn'
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
  const port = await getPort({ port: 5000 })

  server.listen(port, '127.0.0.1', () => {
    const addr = `http://127.0.0.1:${port}/`
    logger.success(`Server running at ${addr}`)
    if (config.open) opn(addr)
  })
}
