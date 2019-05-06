import { renderTitle, renderTabelHeader, renderTabelRow } from './utils'
import { ParserResult } from '@vuese/parser'

export default class MethodsRender {
  options = {
    descriptors: ['Method', 'Description', 'Parameters']
  }
  constructor(options?: { descriptors?: string[] }) {
    this.options = Object.assign({}, this.options, options)
  }
  render(parserResult: ParserResult, topTitleLevel: number) {
    let content = ''
    if (parserResult.methods) {
      content += renderTitle(topTitleLevel + 1, 'Methods')
      content += renderTabelHeader(this.options.descriptors)
      parserResult.methods.forEach(method => {
        const row = []
        for (let i = 0; i < this.options.descriptors.length; i++) {
          if (this.options.descriptors[i] === 'Method') {
            row.push(method.name)
          } else if (this.options.descriptors[i] === 'Description') {
            if (method.describe) {
              row.push(method.describe.join(''))
            } else {
              row.push('-')
            }
          } else if (this.options.descriptors[i] === 'Parameters') {
            if (method.argumentsDesc) {
              row.push(method.argumentsDesc.join(''))
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
