import { renderTitle, renderTabelHeader, renderTabelRow } from './utils'
import { ParserResult } from '@vuese/parser'

export default class MixinsRender {
  options = {
    descriptors: ['Mixin']
  }
  constructor(options?: { descriptors?: string[] }) {
    this.options = Object.assign({}, this.options, options)
  }
  render(parserResult: ParserResult, topTitleLevel: number) {
    let content = ''
    if (parserResult.mixIns) {
      content += renderTitle(topTitleLevel + 1, 'Mixin')
      content += renderTabelHeader(this.options.descriptors)
      parserResult.mixIns.forEach(mixIn => {
        const row = []
        for (let i = 0; i < this.options.descriptors.length; i++) {
          if (this.options.descriptors[i] === 'MixIn') {
            row.push(mixIn.mixIn)
          } else {
            row.push('-')
          }
        }
        content += renderTabelRow(row)
      })
    }
    return content
  }
}
