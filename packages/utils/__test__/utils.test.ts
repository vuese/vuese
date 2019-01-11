import traverse from '@babel/traverse'
import * as path from 'path'
import * as fs from 'fs'
import { isVueComponent, isVueOption } from '@vuese/utils'
import { sfcToAST, AstResult } from '@vuese/parser'
import * as bt from '@babel/types'

function getAST(fileName: string): object {
  const p = path.resolve(__dirname, `./__fixtures__/${fileName}`)
  const source = fs.readFileSync(p, 'utf-8')
  return sfcToAST(source)
}

describe('utils', () => {
  const sfc1: AstResult = getAST('validProps.vue')
  const sfc2: AstResult = getAST('invalidProps.vue')
  test('The default export should be a Vue component', () => {
    traverse(sfc1.jsAst as bt.File, {
      ExportDefaultDeclaration(path: any) {
        expect(isVueComponent(path.node)).toBe(true)
      }
    })
  })

  test('The props property is a Vue component option', () => {
    traverse(sfc1.jsAst as bt.File, {
      ObjectProperty(path: any) {
        if (path.node.key.name === 'props') {
          expect(isVueOption(path, 'props')).toBe(true)
        }
      }
    })
  })

  test('The props property is not a Vue component option', () => {
    traverse(sfc2.jsAst as bt.File, {
      ObjectProperty(path: any) {
        if (path.node.key.name === 'props') {
          expect(isVueOption(path, 'props')).toBe(false)
        }
      }
    })
  })
})
