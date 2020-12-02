/* eslint-disable @typescript-eslint/no-empty-function */
import {
  parseJavascript,
  ParserOptions,
  PropsResult,
  EventResult,
  MethodResult,
  SlotResult,
  MixInResult,
  DataResult,
  ComputedResult,
  WatchResult,
  parseTemplate,
  sfcToAST,
  AstResult,
  BabelParserPlugins
} from '../lib/index'
import * as path from 'path'
import * as fs from 'fs'
import * as bt from '@babel/types'
import { Seen } from '../lib/seen'

function getAST(
  fileName: string,
  babelParserPlugins?: BabelParserPlugins,
  jsFile = false
): AstResult {
  const p = path.resolve(__dirname, `../__test__/__fixtures__/${fileName}`)
  const source = fs.readFileSync(p, 'utf-8')
  return sfcToAST(source, babelParserPlugins, path.dirname(p), jsFile)
}

const sfc1: AstResult = getAST('vueExtend.vue')
const mockOnProp = () => {}
const options: ParserOptions = {
  onProp: mockOnProp
}
debugger
const seen = new Seen()
parseJavascript(sfc1.jsAst as bt.File, seen, options)
// const arg = mockOnProp.mock.calls[0][0]
