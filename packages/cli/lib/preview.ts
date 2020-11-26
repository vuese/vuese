import path from 'path'
import fs from 'fs-extra'
import parser from './markedParser'
import genMarkdown from './genMarkdown'
import chokidar from 'chokidar'
import Log from 'log-horizon'
import { CliOptions } from '.'
import puppeteer from 'puppeteer-core'
import { Launcher } from 'chrome-launcher'

const logger = Log.create()
const HTML_TPL_FOR_PREVIEW = './templates/preview/index.html'
const HTML_CONTAINER_ID = '#content'

export default async (config: CliOptions) => {
  const sfc = config.include as string
  if (!sfc) {
    logger.error('Must provide the path to the .vue file.')
    process.exit(1)
  }
  const vueFile = path.resolve(sfc)

  if (fs.existsSync(vueFile)) {
    async function generate() {
      const componentsPromise = await genMarkdown(config)
      const componentsRes = await Promise.all(componentsPromise)
      const content = componentsRes
        .filter(_ => _)
        .map((res: any) => res.content)[0]
      return parser(content)
    }

    // get the Chromium path
    const executablePath = Launcher.getFirstInstallation()
    const browser = await puppeteer.launch({
      executablePath,
      headless: false,
      defaultViewport: null,
      ignoreDefaultArgs: ['--disable-extensions'],
      args: [
        '--start-maximized',
        `--app=data:text/html,<title>${encodeURIComponent('Vuese CLI')}</title>`
      ],
    })
    await browser.target().createCDPSession()

    // get all of browser tab
    const pages = await browser.pages()
    // use default or create a browser tab
    const page = pages && pages.length > 0 ? pages[0] : await browser.newPage()
    const filePath = path.join(__dirname, HTML_TPL_FOR_PREVIEW)
    // open the default inner html template
    await page.goto(encodeURI(`file://${filePath}`))


    // Generate html content for the preview
    const renderer = async () => {
      const html = await generate()
      const container = await page.$(HTML_CONTAINER_ID)
      await page.evaluate((html: any, container: any) => container.innerHTML = html, html, container)
    }
    // init
    renderer()

    page.on('close', () => process.exit())

    chokidar
      .watch(vueFile, {
        ignoreInitial: true
      })
      .on('change', () => {
        // re render the html content
        renderer()
      })
  }
}
