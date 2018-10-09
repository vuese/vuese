import { PropsResult } from '../parser'
import { renderTabelHeader, renderTabelRow } from './tabelRender'
import config from '../config'

export default function(propsRes: PropsResult[]) {
  const propConfig = config.render.props
  let code = renderTabelHeader(propConfig)
  const row: string[] = []
  propsRes.forEach((prop: PropsResult) => {
    for (let i = 0; i < propConfig.length; i++) {
      if (propConfig[i] === 'Name') {
        row.push(prop.name)
      } else if (propConfig[i] === 'Description') {
        let desc: string[] = []
        if (prop.describe) {
          desc = prop.describe
          if (prop.validatorDesc) {
            desc = prop.describe.concat(prop.validatorDesc)
          }
        }
        row.push(desc.join(''))
      } else if (propConfig[i] === 'Type') {
        if (prop.typeDesc) {
          row.push(prop.typeDesc.join(''))
        } else if (!prop.type) {
          row.push('—')
        } else if (typeof prop.type === 'string') {
          row.push(`\`${prop.type}\``)
        } else if (Array.isArray(prop.type)) {
          row.push(
            prop.type
              .map(t => `\`${t}\` | `)
              .join('')
              .slice(0, -3)
          )
        } else {
          row.push('-')
        }
      } else if (propConfig[i] === 'Required') {
        if (typeof prop.required === 'undefined') {
          row.push('`false`')
        } else if (typeof prop.required === 'boolean') {
          row.push(`\`${String(prop.required)}\``)
        } else {
          row.push('-')
        }
      } else if (propConfig[i] === 'Default') {
        if (prop.defaultDesc) {
          row.push(prop.defaultDesc.join(''))
        } else if (prop.default) {
          row.push(prop.default)
        } else {
          row.push('-')
        }
      }
    }
  })

  code += renderTabelRow(row)
  return code
}
