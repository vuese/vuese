import { parse as vueSFCParse } from '@vue/component-compiler-utils'
import * as vueTemplateCompiler from 'vue-template-compiler'
import { parse as babelParse, ParserPlugin } from '@babel/parser'
import * as bt from '@babel/types'

export interface AstResult {
  sourceType?: string
  jsAst?: bt.File
  templateAst?: object
}

export default function(
  source: string,
  babelParserPlugins?: ParserPlugin[]
): AstResult {
  const sfc = vueSFCParse({
    source: source,
    compiler: vueTemplateCompiler,
    needMap: false
  })
  const res: AstResult = {}
  if (sfc.script && sfc.script.content) {
    res.sourceType = sfc.script.lang || 'js'
    res.jsAst = babelParse(sfc.script.content, {
      sourceType: 'module',
      plugins: babelParserPlugins || [
        'objectRestSpread',
        'dynamicImport',
        'decorators-legacy',
        'typescript'
      ]
    })
  }
  if (sfc.template && sfc.template.content) {
    res.templateAst = vueTemplateCompiler.compile(sfc.template.content, {
      comments: true
    }).ast
  }
  return res
}
