// Use vue-template-compiler/build to avoid detection of vue versions
// in vue-template-compiler/index.js
import { parseComponent, compile } from 'vue-template-compiler/build'
import { BabelParserPlugins } from '@vuese/parser'
import { parse as babelParse } from '@babel/parser'
import * as bt from '@babel/types'
import * as path from 'path'
import * as fs from 'fs'

type pluginKeys = keyof BabelParserPlugins

export interface AstResult {
  sourceType?: string
  jsAst?: bt.File
  templateAst?: object
}

export function sfcToAST(
  source: string,
  babelParserPlugins?: BabelParserPlugins,
  basedir?: string
): AstResult {
  const plugins = getBabelParserPlugins(babelParserPlugins)
  const sfc = parseComponent(source)
  const res: AstResult = {}
  if (sfc.script) {
    if (!sfc.script.content && sfc.script.src) {
      // Src Imports
      if (basedir) {
        try {
          sfc.script.content = fs.readFileSync(
            path.resolve(basedir, sfc.script.src),
            'utf-8'
          )
        } catch (e) {
          console.error(e)
          sfc.script.content = ''
        }
      }
    }
    res.sourceType = sfc.script.lang || 'js'
    res.jsAst = babelParse(sfc.script.content, {
      sourceType: 'module',
      plugins
    })
  }
  if (sfc.template) {
    if (!sfc.template.content && sfc.template.src) {
      // Src Imports
      if (basedir) {
        try {
          sfc.template.content = fs.readFileSync(
            path.resolve(basedir, sfc.template.src),
            'utf-8'
          )
        } catch (e) {
          console.error(e)
          sfc.template.content = ''
        }
      }
    }
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
