import { renderTitle, renderTabelHeader, renderTabelRow } from './utils'
import { ParserResult } from '@vuese/parser'

export default class PropsRender {
  options = {
    descriptors: ['Name', 'Description', 'Type', 'Required', 'Default']
  }
  constructor(options?: { descriptors?: string[] }) {
    this.options = Object.assign({}, this.options, options)
  }
  render(parserResult: ParserResult, topTitleLevel: number) {
    let content = ''
    if (parserResult.props) {
      content += renderTitle(topTitleLevel + 1, 'Props')
      content += renderTabelHeader(this.options.descriptors)
      parserResult.props.forEach(prop => {
        const row = []
        for (let i = 0; i < this.options.descriptors.length; i++) {
          if (this.options.descriptors[i] === 'Name') {
            row.push(prop.name)
          } else if (this.options.descriptors[i] === 'Description') {
            let desc = ['-']
            if (prop.describe && prop.describe.length) {
              desc = prop.describe
              if (prop.validatorDesc) {
                desc = prop.describe.concat(prop.validatorDesc)
              }
            }
            row.push(desc.join(''))
          } else if (this.options.descriptors[i] === 'Type') {
            if (prop.typeDesc) {
              row.push(prop.typeDesc.join(''))
            } else if (!prop.type) {
              row.push('—')
            } else if (typeof prop.type === 'string') {
              row.push(`\`${prop.type}\``)
            } else if (Array.isArray(prop.type)) {
              row.push(
                prop.type
                  .map(t => `\`${t}\` / `)
                  .join('')
                  .slice(0, -3)
              )
            } else {
              row.push('-')
            }
          } else if (this.options.descriptors[i] === 'Required') {
            if (typeof prop.required === 'undefined') {
              row.push('`false`')
            } else if (typeof prop.required === 'boolean') {
              row.push(`\`${String(prop.required)}\``)
            } else {
              row.push('-')
            }
          } else if (this.options.descriptors[i] === 'Default') {
            if (prop.defaultDesc) {
              row.push(prop.defaultDesc.join(''))
            } else if (prop.default) {
              row.push(prop.default.replace(/\n/g, ''))
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
