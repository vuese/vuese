import * as bt from '@babel/types'
import { sfcToAST, AstResult } from '@vuese/parser'
import * as path from 'path'
import * as fs from 'fs'

function getAST(fileName: string): AstResult {
  const p = path.resolve(__dirname, `./__fixtures__/${fileName}`)
  const source = fs.readFileSync(p, 'utf-8')
  return sfcToAST(source)
}

test('The type of `jsAst` should be File', () => {
  const sfc = getAST('common.vue')
  expect(bt.isFile(sfc.jsAst as object)).toBe(true)
  expect(sfc.sourceType).toBe('js')
  expect((sfc.templateAst as any).type).toBe(1)
  expect((sfc.templateAst as any).tag).toBe('div')
})
