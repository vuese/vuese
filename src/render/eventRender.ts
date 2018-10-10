import { EventResult } from '../parser'
import { renderTabelHeader, renderTabelRow } from './tabelRender'
import config from '../config'

export default function(propsRes: EventResult[]) {
  const eventConfig = config.render.events
  let code = renderTabelHeader(eventConfig)
  const row: string[] = []
  propsRes.forEach((event: EventResult) => {
    for (let i = 0; i < eventConfig.length; i++) {
      if (eventConfig[i] === 'Event Name') {
        row.push(event.name)
      } else if (eventConfig[i] === 'Description') {
        if (event.describe) {
          row.push(event.describe.join(''))
        } else {
          row.push('-')
        }
      } else if (eventConfig[i] === 'Parameters') {
        if (event.argumentsDesc) {
          row.push(event.argumentsDesc.join(''))
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
