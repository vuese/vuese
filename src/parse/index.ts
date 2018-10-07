import sfcToAST from './sfcToAST'
import parseJavascript from './parseJavascript'
import parseTemplate from './parseTemplate'

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

export interface ParserOptions {
  onProp?: {
    (propsRes?: PropsResult[]): any
  }
  onEvent?: {
    (eventRes?: EventResult): any
  }
}

export default function(source: string, options: ParserOptions) {
  const astRes = sfcToAST(source)
  if (astRes.jsAst) {
    parseJavascript(astRes.jsAst, options)
  }
  if (astRes.templateAst) {
    parseTemplate(astRes.templateAst)
  }
}
