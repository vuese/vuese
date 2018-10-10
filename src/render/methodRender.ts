import { MethodResult } from '../parser'
import { renderTabelHeader, renderTabelRow } from './tabelRender'
import config from '../config'

export default function(slotsRes: MethodResult[]) {
  const methodConfig = config.render.methods
  let code = renderTabelHeader(methodConfig)
  const row: string[] = []
  slotsRes.forEach((method: MethodResult) => {
    for (let i = 0; i < methodConfig.length; i++) {
      if (methodConfig[i] === 'Method') {
        row.push(method.name)
      } else if (methodConfig[i] === 'Description') {
        if (method.describe) {
          row.push(method.describe.join(''))
        } else {
          row.push('-')
        }
      } else if (methodConfig[i] === 'Parameters') {
        if (method.argumentsDesc) {
          row.push(method.argumentsDesc.join(''))
        } else {
          row.push('-')
        }
      } else {
        row.push('-')
      }
    }
  })

  code += renderTabelRow(row)
  return code
}
