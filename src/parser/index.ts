import sfcToAST from './sfcToAST'
import parseJavascript from './parseJavascript'
import parseTemplate from './parseTemplate'
import { ParserPlugin } from '@babel/parser'

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
    (propsRes?: PropsResult[]): any
  }
  onEvent?: {
    (eventRes?: EventResult): any
  }
  onMethod?: {
    (methodRes?: MethodResult): any
  }
  onSlot?: {
    (slotRes?: SlotResult): any
  }
  onName?: {
    (name: string): any
  }
  babelParserPlugins?: ParserPlugin[]
}

export interface ParserResult {
  props?: PropsResult[]
  events?: EventResult[]
  slots?: SlotResult[]
  methods?: MethodResult[]
  name?: string
}

export default function(
  source: string,
  options: ParserOptions = {}
): ParserResult {
  const astRes = sfcToAST(source, options.babelParserPlugins)
  const res: ParserResult = {}
  const defaultOptions: ParserOptions = {
    onName(name: string) {
      res.name = name
    },
    onProp(propsRes?: PropsResult[]) {
      if (propsRes) {
        res.props = propsRes
      }
    },
    onEvent(eventsRes?: EventResult) {
      if (eventsRes) {
        ;(res.events || (res.events = [])).push(eventsRes)
      }
    },
    onSlot(slotRes?: SlotResult) {
      if (slotRes) {
        ;(res.slots || (res.slots = [])).push(slotRes)
      }
    },
    onMethod(methodRes?: MethodResult) {
      if (methodRes) {
        ;(res.methods || (res.methods = [])).push(methodRes)
      }
    },
    babelParserPlugins: ['objectRestSpread', 'dynamicImport']
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
