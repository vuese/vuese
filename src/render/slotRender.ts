import { SlotResult } from '../parser'
import { renderTabelHeader, renderTabelRow } from './tabelRender'
import config from '../config'

export default function(slotsRes: SlotResult[]) {
  const slotConfig = config.render.slots
  let code = renderTabelHeader(slotConfig)
  const row: string[] = []
  slotsRes.forEach((slot: SlotResult) => {
    for (let i = 0; i < slotConfig.length; i++) {
      if (slotConfig[i] === 'Name') {
        row.push(slot.name)
      } else if (slotConfig[i] === 'Description') {
        if (slot.describe) {
          row.push(slot.describe)
        } else {
          row.push('-')
        }
      } else if (slotConfig[i] === 'Default Slot Content') {
        if (slot.backerDesc) {
          row.push(slot.backerDesc)
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
