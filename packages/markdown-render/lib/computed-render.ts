import { renderTitle, renderTabelHeader, renderTabelRow } from './utils'
import { ParserResult } from '@vuese/parser'

export default class ComputedRender {
  options = {
    descriptors: ['Computed', 'Description']
  }
  constructor(options?: { descriptors?: string[] }) {
    this.options = Object.assign({}, this.options, options)
  }
  render(parserResult: ParserResult, topTitleLevel: number) {
    let content = ''
    if (parserResult.computed) {
      content += renderTitle(topTitleLevel + 1, 'Computed')
      content += renderTabelHeader(this.options.descriptors)
      parserResult.computed.forEach(computed => {
        const row = []
        for (let i = 0; i < this.options.descriptors.length; i++) {
          if (this.options.descriptors[i] === 'Computed') {
            row.push(computed.name)
          } else if (this.options.descriptors[i] === 'Description') {
            if (computed.describe) {
              row.push(computed.describe.join(''))
            } else {
              row.push('-')
            }
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
