import { renderTitle, renderTabelHeader, renderTabelRow } from './utils'
import { ParserResult } from '@vuese/parser'

export default class SlotsRender {
  options = {
    descriptors: ['Name', 'Description', 'Default Slot Content']
  }
  constructor(options?: { descriptors?: string[] }) {
    this.options = Object.assign({}, this.options, options)
  }
  render(parserResult: ParserResult, topTitleLevel: number) {
    let content = ''
    if (parserResult.slots) {
      content += renderTitle(topTitleLevel + 1, 'Slots')
      content += renderTabelHeader(this.options.descriptors)
      parserResult.slots.forEach(slot => {
        const row = []
        for (let i = 0; i < this.options.descriptors.length; i++) {
          if (this.options.descriptors[i] === 'Name') {
            row.push(slot.name)
          } else if (this.options.descriptors[i] === 'Description') {
            if (slot.describe) {
              row.push(slot.describe)
            } else {
              row.push('-')
            }
          } else if (this.options.descriptors[i] === 'Default Slot Content') {
            if (slot.backerDesc) {
              row.push(slot.backerDesc)
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
