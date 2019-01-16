import { sfcToAST } from './sfcToAST'
import { parseJavascript } from './parseJavascript'
import { parseTemplate } from './parseTemplate'
import { ParserPlugin } from '@babel/parser'
import { CommentResult } from './jscomments'

export * from './sfcToAST'
export * from './parseJavascript'
export * from './parseTemplate'
export * from './helper'

export type PropType = string | string[] | null

export interface PropsResult {
  type: PropType
  name: string
  typeDesc?: string[]
  required?: boolean
  default?: string
  defaultDesc?: string[]
  validator?: string
  validatorDesc?: string[]
  describe?: string[]
}

export interface EventResult {
  name: string
  isSync: boolean
  syncProp: string
  describe?: string[]
  argumentsDesc?: string[]
}

export interface MethodResult {
  name: string
  describe?: string[]
  argumentsDesc?: string[]
}

export type AttrsMap = {
  [key: string]: string
}

export interface SlotResult {
  name: string
  describe: string
  backerDesc: string
  bindings: AttrsMap
}

export interface ParserOptions {
  onProp?: {
    (propsRes: PropsResult): void
  }
  onEvent?: {
    (eventRes: EventResult): void
  }
  onMethod?: {
    (methodRes: MethodResult): void
  }
  onSlot?: {
    (slotRes: SlotResult): void
  }
  onName?: {
    (name: string): void
  }
  onDesc?: {
    (desc: CommentResult): void
  }
  babelParserPlugins?: ParserPlugin[]
}

export interface ParserResult {
  props?: PropsResult[]
  events?: EventResult[]
  slots?: SlotResult[]
  methods?: MethodResult[]
  name?: string
  componentDesc?: CommentResult
}

export function parser(
  source: string,
  options: ParserOptions = {}
): ParserResult {
  const astRes = sfcToAST(source, options.babelParserPlugins)
  const res: ParserResult = {}
  const defaultOptions: ParserOptions = {
    onName(name: string) {
      res.name = name
    },
    onDesc(desc: CommentResult) {
      res.componentDesc = desc
    },
    onProp(propsRes: PropsResult) {
      ;(res.props || (res.props = [])).push(propsRes)
    },
    onEvent(eventsRes: EventResult) {
      ;(res.events || (res.events = [])).push(eventsRes)
    },
    onSlot(slotRes: SlotResult) {
      ;(res.slots || (res.slots = [])).push(slotRes)
    },
    onMethod(methodRes: MethodResult) {
      ;(res.methods || (res.methods = [])).push(methodRes)
    },
    babelParserPlugins: [
      'objectRestSpread',
      'dynamicImport',
      'decorators-legacy',
      'typescript'
    ]
  }

  const finallyOptions: ParserOptions = Object.assign(defaultOptions, options)
  if (astRes.jsAst) {
    parseJavascript(astRes.jsAst, finallyOptions)
  }
  if (astRes.templateAst) {
    parseTemplate(astRes.templateAst, finallyOptions)
  }

  return res
}
