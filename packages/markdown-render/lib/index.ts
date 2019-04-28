import {
  ParserResult,
  MixInResult,
  PropsResult,
  SlotResult,
  EventResult,
  MethodResult,
  ComputedResult
} from '@vuese/parser'
import renderMarkdown, { MarkdownResult } from './renderMarkdown'

export { MarkdownResult }

interface RenderOptions {
  props: string[]
  slots: string[]
  events: string[]
  methods: string[]
  computed: string[]
  mixIns: string[]
}

export interface RenderResult {
  props?: string
  slots?: string
  events?: string
  methods?: string
  computed?: string
  mixIns?: string
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
        events: ['Event Name', 'Description', 'Parameters', 'Type', 'Default'],
        slots: ['Name', 'Description', 'Default Slot Content'],
        methods: ['Method', 'Description', 'Parameters', 'Type', 'Default'],
        computed: ['Computed', 'Description'],
        mixIns: ['MixIn']
      },
      this.options
    )
  }

  render(): RenderResult {
    const {
      props,
      slots,
      events,
      methods,
      mixIns,
      computed
    } = this.parserResult
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
    if (computed) {
      md.computed = this.computedRender(computed)
    }
    if (mixIns) {
      md.mixIns = this.mixInRender(mixIns)
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

    const codes = ['<table><thead><tr>']

    codes.push(eventConfig.map(name => `<th>${name}</th>`).join(''))
    codes.push('</tr></thead><tbody>')

    function cellCode(content: String | undefined, rowspan: Number) {
      rowspan = rowspan || 1
      return `<td rowspan=${rowspan}>${content || '-'}</td>`
    }
    propsRes.forEach((event: EventResult) => {
      const rowCodes = ['<tr>']

      const argumentsDesc = event.argumentsDesc || []
      const argLength = argumentsDesc.length

      for (let i = 0; i < eventConfig.length; i++) {
        const paramed = argLength > 0
        switch (eventConfig[i]) {
          case 'Event Name':
            rowCodes.push(cellCode(event.name, argLength))
            break
          case 'Description':
            const descripted = event.describe && event.describe.length
            rowCodes.push(
              cellCode(
                descripted ? (event.describe || []).join('<br>') : '-',
                descripted ? argLength : 1
              )
            )
            break
          case 'Parameters':
            rowCodes.push(cellCode(paramed ? argumentsDesc[0].name : '-', 1))
            break
          case 'Type':
            rowCodes.push(cellCode(paramed ? argumentsDesc[0].type : '-', 1))
            break
          case 'Default':
            rowCodes.push(cellCode(paramed ? argumentsDesc[0].default : '-', 1))
            break
          default:
            rowCodes.push(cellCode('-', argLength))
            break
        }
      }

      let argCursor = 1
      while (argCursor < argLength) {
        rowCodes.push('</tr><tr>')
        rowCodes.push(cellCode(argumentsDesc[argCursor].name, 1))
        rowCodes.push(cellCode(argumentsDesc[argCursor].type, 1))
        rowCodes.push(cellCode(argumentsDesc[argCursor].default, 1))
        argCursor++
      }
      rowCodes.push('</tr>')

      codes.push(rowCodes.join(''))
    })
    codes.push('</tbody></table>')
    return codes.join('')
  }

  methodRender(methodsRes: MethodResult[]) {
    const methodConfig = (this.options as RenderOptions).methods

    const codes = ['<table><thead><tr>']

    codes.push(methodConfig.map(name => `<th>${name}</th>`).join(''))
    codes.push('</tr></thead><tbody>')

    function cellCode(content: String | undefined, rowspan: Number) {
      rowspan = rowspan || 1
      return `<td rowspan=${rowspan}>${content || '-'}</td>`
    }
    methodsRes.forEach((method: MethodResult) => {
      const rowCodes = ['<tr>']

      const argumentsDesc = method.argumentsDesc || []
      const argLength = argumentsDesc.length

      for (let i = 0; i < methodConfig.length; i++) {
        const paramed = argLength > 0

        switch (methodConfig[i]) {
          case 'Method':
            rowCodes.push(cellCode(method.name, argLength))
            break
          case 'Description':
            const descripted = method.describe && method.describe.length
            rowCodes.push(
              cellCode(
                descripted ? (method.describe || []).join('<br>') : '-',
                descripted ? argLength : 1
              )
            )
            break
          case 'Parameters':
            rowCodes.push(cellCode(paramed ? argumentsDesc[0].name : '-', 1))
            break
          case 'Type':
            rowCodes.push(cellCode(paramed ? argumentsDesc[0].type : '-', 1))
            break
          case 'Default':
            rowCodes.push(cellCode(paramed ? argumentsDesc[0].default : '-', 1))
            break
          default:
            rowCodes.push(cellCode('-', argLength))
            break
        }
      }
      let argCursor = 1
      while (argCursor < argLength) {
        rowCodes.push('</tr><tr>')
        rowCodes.push(cellCode(argumentsDesc[argCursor].name, 1))
        rowCodes.push(cellCode(argumentsDesc[argCursor].type, 1))
        rowCodes.push(cellCode(argumentsDesc[argCursor].default, 1))
        argCursor++
      }
      rowCodes.push('</tr>')

      codes.push(rowCodes.join(''))
    })
    codes.push('</tbody></table>')
    return codes.join('')
  }

  computedRender(computedRes: ComputedResult[]) {
    const computedConfig = (this.options as RenderOptions).computed
    let code = this.renderTabelHeader(computedConfig)
    computedRes.forEach((method: MethodResult) => {
      const row: string[] = []
      for (let i = 0; i < computedConfig.length; i++) {
        if (computedConfig[i] === 'Computed') {
          row.push(method.name)
        } else if (computedConfig[i] === 'Description') {
          if (method.describe) {
            row.push(method.describe.join(''))
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

  mixInRender(mixInsRes: MixInResult[]) {
    const mixInsConfig = (this.options as RenderOptions).mixIns
    let code = this.renderTabelHeader(mixInsConfig)
    mixInsRes.forEach((mixIn: MixInResult) => {
      const row: string[] = []
      for (let i = 0; i < mixInsConfig.length; i++) {
        if (mixInsConfig[i] === 'MixIn') {
          row.push(mixIn.mixIn)
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
