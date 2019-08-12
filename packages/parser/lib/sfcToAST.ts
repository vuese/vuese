// Use vue-template-compiler/build to avoid detection of vue versions
// in vue-template-compiler/index.js
import { parseComponent, compile } from 'vue-template-compiler/build'
import { BabelParserPlugins } from '@vuese/parser'
import { parse as babelParse } from '@babel/parser'
import * as bt from '@babel/types'

type pluginKeys = keyof BabelParserPlugins

export interface AstResult {
  sourceType?: string
  jsAst?: bt.File
  templateAst?: object
}

export function sfcToAST(
  source: string,
  babelParserPlugins?: BabelParserPlugins,
  jsFile?: boolean
): AstResult {
  const plugins = getBabelParserPlugins(babelParserPlugins)
  const sfc = parseComponent(source)
  const res: AstResult = {}

  if ((sfc.script && sfc.script.content) || jsFile) {
    res.sourceType = sfc.script && sfc.script.lang ? sfc.script.lang : 'js'
    res.jsAst = babelParse(jsFile ? source : sfc.script.content, {
      sourceType: 'module',
      plugins
    })
  }
  if (sfc.template && sfc.template.content) {
    res.templateAst = compile(sfc.template.content, {
      comments: true
    }).ast
  }
  return res
}

function getBabelParserPlugins(plugins?: BabelParserPlugins): pluginKeys[] {
  const defaultBabelParserPlugins: BabelParserPlugins = {
    objectRestSpread: true,
    dynamicImport: true,
    'decorators-legacy': true,
    classProperties: true,
    typescript: true,
    jsx: true
  }
  const finallyBabelParserPlugins = Object.assign(
    defaultBabelParserPlugins,
    plugins || {}
  )

  return Object.keys(finallyBabelParserPlugins).filter(
    (k: pluginKeys) => finallyBabelParserPlugins[k]
  ) as pluginKeys[]
}
