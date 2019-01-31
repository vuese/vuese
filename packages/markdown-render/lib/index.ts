import {
  ParserResult,
  PropsResult,
  SlotResult,
  EventResult,
  MethodResult
} from '@vuese/parser'
import renderMarkdown, { MarkdownResult } from './renderMarkdown'

export { MarkdownResult }

interface RenderOptions {
  props: string[]
  slots: string[]
  events: string[]
  methods: string[]
}

export interface RenderResult {
  props?: string
  slots?: string
  events?: string
  methods?: string
}

export class Render {
  constructor(
    public parserResult: ParserResult,
    public options?: RenderOptions
  ) {
    this.options = Object.assign(
      {},
      {
        props: ['Name', 'Description', 'Type', 'Required', 'Default'],
        events: ['Event Name', 'Description', 'Parameters'],
        slots: ['Name', 'Description', 'Default Slot Content'],
        methods: ['Method', 'Description', 'Parameters']
      },
      this.options
    )
  }

  render(): RenderResult {
    const { props, slots, events, methods } = this.parserResult
    let md: RenderResult = {}
    if (props) {
      md.props = this.propRender(props)
    }
    if (slots) {
      md.slots = this.slotRender(slots)
    }
    if (events) {
      md.events = this.eventRender(events)
    }
    if (methods) {
      md.methods = this.methodRender(methods)
    }

    return md
  }

  propRender(propsRes: PropsResult[]) {
    const propConfig = (this.options as RenderOptions).props
    let code = this.renderTabelHeader(propConfig)
    propsRes.forEach((prop: PropsResult) => {
      const row: string[] = []
      for (let i = 0; i < propConfig.length; i++) {
        if (propConfig[i] === 'Name') {
          row.push(prop.name)
        } else if (propConfig[i] === 'Description') {
          let desc: string[] = ['-']
          if (prop.describe && prop.describe.length) {
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
                .map(t => `\`${t}\` / `)
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
        } else {
          row.push('-')
        }
      }
      code += this.renderTabelRow(row)
    })

    return code
  }

  slotRender(slotsRes: SlotResult[]) {
    const slotConfig = (this.options as RenderOptions).slots
    let code = this.renderTabelHeader(slotConfig)
    slotsRes.forEach((slot: SlotResult) => {
      const row: string[] = []
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
      code += this.renderTabelRow(row)
    })

    return code
  }

  eventRender(propsRes: EventResult[]) {
    const eventConfig = (this.options as RenderOptions).events
    let code = this.renderTabelHeader(eventConfig)
    propsRes.forEach((event: EventResult) => {
      const row: string[] = []
      for (let i = 0; i < eventConfig.length; i++) {
        if (eventConfig[i] === 'Event Name') {
          row.push(event.name)
        } else if (eventConfig[i] === 'Description') {
          if (event.describe && event.describe.length) {
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
      code += this.renderTabelRow(row)
    })

    return code
  }

  methodRender(slotsRes: MethodResult[]) {
    const methodConfig = (this.options as RenderOptions).methods
    let code = this.renderTabelHeader(methodConfig)
    slotsRes.forEach((method: MethodResult) => {
      const row: string[] = []
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
      code += this.renderTabelRow(row)
    })

    return code
  }

  renderTabelHeader(header: string[]): string {
    const headerString = this.renderTabelRow(header)
    const splitLine = this.renderSplitLine(header.length)
    return headerString + splitLine + '\n'
  }

  renderTabelRow(row: string[]): string {
    return row.map(n => `|${n}`).join('') + '|\n'
  }

  renderSplitLine(num: number): string {
    let line = ''
    for (let i = 0; i < num; i++) {
      line += '|---'
    }
    return line + '|'
  }

  renderMarkdown(): MarkdownResult | null {
    return renderMarkdown(this.render(), this.parserResult)
  }
}

export default Render
