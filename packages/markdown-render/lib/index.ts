import {
  ParserResult,
  MixInResult,
  PropsResult,
  SlotResult,
  EventResult,
  DataResult,
  MethodResult,
  ComputedResult,
  WatchResult
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
  data: string[]
  watch: string[]
}

export interface RenderResult {
  props?: string
  slots?: string
  events?: string
  methods?: string
  computed?: string
  mixIns?: string
  data?: string
  watch?: string
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
        methods: ['Method', 'Description', 'Parameters'],
        computed: ['Computed', 'Type', 'Description', 'From Store'],
        mixIns: ['MixIn'],
        data: ['Name', 'Type', 'Description', 'Default'],
        watch: ['Name', 'Description', 'Parameters']
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
      data,
      computed,
      watch
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
    if (data) {
      md.data = this.dataRender(data)
    }
    if (watch) {
      md.watch = this.watchRender(watch)
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
          row.push(desc.join(' '))
        } else if (propConfig[i] === 'Type') {
          if (prop.typeDesc) {
            row.push(prop.typeDesc.join(' '))
          } else if (!prop.type) {
            row.push('—')
          } else if (typeof prop.type === 'string') {
            row.push(`\`${prop.type}\``)
          } else if (Array.isArray(prop.type)) {
            row.push(
              prop.type
                .map(t => `\`${t}\` / `)
                .join(' ')
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
            row.push(prop.defaultDesc.join(' '))
          } else if (prop.default) {
            row.push(
              typeof prop.default === 'object'
                ? JSON.stringify(prop.default)
                : prop.default
            )
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

    // If the template and script contain slots with the same name,
    // only the slots in the template are rendered
    const slotInTemplate: SlotResult[] = []
    const slotInScript: SlotResult[] = []
    slotsRes.forEach((slot: SlotResult) => {
      slot.target === 'template'
        ? slotInTemplate.push(slot)
        : slotInScript.push(slot)
    })

    slotsRes = slotInTemplate.concat(
      slotInScript.filter(ss => {
        for (let i = 0; i < slotInTemplate.length; i++) {
          if (ss.name === slotInTemplate[i].name) return false
        }
        return true
      })
    )

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
            row.push(event.describe.join(' '))
          } else {
            row.push('-')
          }
        } else if (eventConfig[i] === 'Parameters') {
          if (event.argumentsDesc) {
            row.push(event.argumentsDesc.join(' '))
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

  methodRender(methodsRes: MethodResult[]) {
    const methodConfig = (this.options as RenderOptions).methods
    let code = this.renderTabelHeader(methodConfig)
    methodsRes.forEach((method: MethodResult) => {
      const row: string[] = []
      for (let i = 0; i < methodConfig.length; i++) {
        if (methodConfig[i] === 'Method') {
          row.push(method.name)
        } else if (methodConfig[i] === 'Description') {
          if (method.describe) {
            row.push(method.describe.join(' '))
          } else {
            row.push('-')
          }
        } else if (methodConfig[i] === 'Parameters') {
          if (method.argumentsDesc) {
            row.push(method.argumentsDesc.join(' '))
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

  computedRender(computedRes: ComputedResult[]) {
    const computedConfig = (this.options as RenderOptions).computed
    let code = this.renderTabelHeader(computedConfig)
    computedRes.forEach((computed: ComputedResult) => {
      const row: string[] = []
      for (let i = 0; i < computedConfig.length; i++) {
        if (computedConfig[i] === 'Computed') {
          row.push(computed.name)
        } else if (computedConfig[i] === 'Type') {
          if (computed.type) {
            row.push(`\`${computed.type.join(' ')}\``)
            row.push()
          } else {
            row.push('-')
          }
        } else if (computedConfig[i] === 'Description') {
          if (computed.describe) {
            row.push(computed.describe.join(' '))
          } else {
            row.push('-')
          }
        } else if (computedConfig[i] === 'From Store') {
          if (computed.isFromStore) {
            row.push('Yes')
          } else {
            row.push('No')
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

  dataRender(dataRes: DataResult[]) {
    const dataConfig = (this.options as RenderOptions).data
    let code = this.renderTabelHeader(dataConfig)
    dataRes.forEach((data: DataResult) => {
      const row: string[] = []
      for (let i = 0; i < dataConfig.length; i++) {
        if (dataConfig[i] === 'Name') {
          row.push(data.name)
        } else if (dataConfig[i] === 'Description') {
          if (data.describe) {
            row.push(data.describe.join(' '))
          } else {
            row.push('-')
          }
        } else if (dataConfig[i] === 'Type') {
          if (data.type.length > 0) {
            row.push(`\`${data.type}\``)
          } else {
            row.push('—')
          }
        } else if (dataConfig[i] === 'Default') {
          if (data.default) {
            row.push(data.default)
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

  watchRender(watchRes: WatchResult[]) {
    const watchConfig = (this.options as RenderOptions).watch
    let code = this.renderTabelHeader(watchConfig)
    watchRes.forEach((watch: WatchResult) => {
      const row: string[] = []
      for (let i = 0; i < watchConfig.length; i++) {
        if (watchConfig[i] === 'Name') {
          row.push(watch.name)
        } else if (watchConfig[i] === 'Description') {
          if (watch.describe) {
            row.push(watch.describe.join(' '))
          } else {
            row.push('-')
          }
        } else if (watchConfig[i] === 'Parameters') {
          if (watch.argumentsDesc) {
            row.push(watch.argumentsDesc.join(' '))
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
