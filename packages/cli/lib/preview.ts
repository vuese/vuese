import * as events from 'events';
const { EventEmitter } = events;
import path from 'path'
import carlo from 'carlo'
import fs from 'fs-extra'
import parser from './markedParser'
import genMarkdown from './genMarkdown'
import chokidar from 'chokidar'
import Log from 'log-horizon'
import { CliOptions } from '.'

const logger = Log.create()

export default async (config: CliOptions): Promise<void> => {
  const sfc = config.include as string
  if (!sfc) {
    logger.error('Must provide the path to the .vue file.')
    process.exit(1)
  }
  const vueFile = path.resolve(sfc)

  if (fs.existsSync(vueFile)) {
    async function generate(): Promise<any> {
      const componentsPromise = await genMarkdown(config)
      const componentsRes = await Promise.all(componentsPromise)
      const content = componentsRes
        .filter(_ => _)
        .map((res: any) => res.content)[0]
      return parser(content)
    }

    const app = await carlo.launch()
    app.on('exit', () => process.exit())
    app.serveFolder(__dirname + '/templates/preview')

    class Events extends EventEmitter {}
    const event = new Events()
    await app.exposeFunction('event', () => event)
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
