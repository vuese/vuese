/* eslint-disable @typescript-eslint/no-var-requires */
import path from 'path'
import getPort from 'get-port'
import open from 'open'
import Log from 'log-horizon'
import { CliOptions } from '.'
import fs from 'fs-extra'

const logger = Log.create()

function getFirstPath(config: CliOptions): string {
  const entryPath = path.resolve(`${config.outDir}/index.html`)
  const reg = /(?:[\s\S]+)sidebar\:([\s\S]+)\}\)/
  const entrySourceStr: string = fs.readFileSync(entryPath, 'utf-8') || ''
  try {
    const regRes = (entrySourceStr as any).match(reg)[1]
    const routesConfig = new Function(`return ${regRes}`)()
    const firstRoute = routesConfig.reduce((p: string, v: any, i: number) => {
      if (i === 0) {
        const { links } = v
        return links[0] && links[0].link
      }
    }, '')
    // Read the first preview configuration injected when opening the browser.
    return `#${firstRoute}`
  } catch (e) {
    // If there's an error, follow the previous logic.
    return ''
  }
}

export default async (config: CliOptions): Promise<void> => {
  const http = require('http')
  const handler = require('serve-handler')
  const server = http.createServer((req: any, res: any) => {
    return handler(req, res, {
      public: path.resolve(config.outDir)
    })
  })
  const port = config.port || (await getPort({ port: 5000 }))

  server.listen(port, config.host, () => {
    const addr = `http://${config.host}:${port}/${getFirstPath(config)}`
    logger.success(`Server running at ${addr}`)
    if (config.open) open(addr)
  })
}
