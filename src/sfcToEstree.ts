import { parse as vueSFCParse } from '@vue/component-compiler-utils'
import * as vueTemplateCompiler from 'vue-template-compiler'
import { parse as babelParse } from '@babel/parser'

interface cacheObject {
  [key: string]: object
}

const cacheAst: cacheObject = {}
function getAST(jsSource: string): object {
  if (cacheAst[jsSource]) return cacheAst[jsSource]
  return (cacheAst[jsSource] = babelParse(jsSource, {
    sourceType: 'module'
  }))
}

export default function(source: string): object {
  const res = vueSFCParse({
    source: source,
    compiler: vueTemplateCompiler,
    needMap: false
  })
  if (res.script && res.script.content) {
    return getAST(res.script.content)
  }
  return {}
}
