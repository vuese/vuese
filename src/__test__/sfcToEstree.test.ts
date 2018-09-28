import * as bt from '@babel/types'
import { getAST } from './utils'

test('The type of AST should be File', () => {
  const ast = getAST('common.vue')
  expect(bt.isFile(ast)).toBe(true)
})
