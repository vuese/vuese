import { ParserResult } from '@vuese/parser'

interface RenderOptions {
  plugins: any[]
  topTitleLevel?: number
}

export default class Render {
  options: RenderOptions = {
    plugins: [],
    topTitleLevel: 1
  }
  constructor(public parserResult: ParserResult, options?: RenderOptions) {
    this.options = Object.assign({}, this.options, options)
  }

  render(): string {
    const renderResult = []
    let content = ''
    if (this.options.plugins && Array.isArray(this.options.plugins)) {
      for (const plugin of this.options.plugins) {
        renderResult.push(
          plugin.render(this.parserResult, this.options.topTitleLevel)
        )
      }
      const cmptName = this.parserResult.name || 'unkonwn'
      content = `${''.padStart(
        this.options.topTitleLevel || 1,
        '#'
      )} ${cmptName}\n`
      content = renderResult.reduce((content, curResult) => {
        return content + curResult + '\n'
      }, content)
    }
    return content
  }
}
