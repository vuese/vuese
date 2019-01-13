// Use vue-template-compiler/build to avoid detection of vue versions
// in vue-template-compiler/index.js
import { parseComponent, compile } from 'vue-template-compiler/build'
import { parse as babelParse, ParserPlugin } from '@babel/parser'
import * as bt from '@babel/types'

export interface AstResult {
  sourceType?: string
  jsAst?: bt.File
  templateAst?: object
}

export function sfcToAST(
  source: string,
  babelParserPlugins?: ParserPlugin[]
): AstResult {
  const sfc = parseComponent(source)
  const res: AstResult = {}
  if (sfc.script && sfc.script.content) {
    res.sourceType = sfc.script.lang || 'js'
    res.jsAst = babelParse(sfc.script.content, {
      sourceType: 'module',
      plugins: babelParserPlugins || [
        'objectRestSpread',
        'dynamicImport',
        'decorators-legacy',
        'classProperties',
        'typescript'
      ]
    })
  }
  if (sfc.template && sfc.template.content) {
    res.templateAst = compile(sfc.template.content, {
      comments: true
    }).ast
  }
  return res
}
