import { renderTitle, renderTabelHeader, renderTabelRow } from './utils'
import { ParserResult } from '@vuese/parser'

export default class EventsRender {
  options = {
    descriptors: ['Event Name', 'Description', 'Parameters']
  }
  constructor(options?: { descriptors?: string[] }) {
    this.options = Object.assign({}, this.options, options)
  }
  render(parserResult: ParserResult, topTitleLevel: number) {
    let content = ''
    if (parserResult.events) {
      content += renderTitle(topTitleLevel + 1, 'Events')
      content += renderTabelHeader(this.options.descriptors)
      parserResult.events.forEach(event => {
        const row = []
        for (let i = 0; i < this.options.descriptors.length; i++) {
          if (this.options.descriptors[i] === 'Event Name') {
            row.push(event.name)
          } else if (this.options.descriptors[i] === 'Description') {
            if (event.describe && event.describe.length) {
              row.push(event.describe.join(''))
            } else {
              row.push('-')
            }
          } else if (this.options.descriptors[i] === 'Parameters') {
            if (event.argumentsDesc) {
              row.push(event.argumentsDesc.join(''))
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
