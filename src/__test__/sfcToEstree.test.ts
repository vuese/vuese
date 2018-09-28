import sfcToEstree from '../sfcToEstree'
import * as path from 'path'
import * as fs from 'fs'
import * as bt from '@babel/types'

const p = path.resolve(__dirname, '../../__fixtures__/common.vue')
const source = fs.readFileSync(p, 'utf-8')

test('The type of AST should be File', () => {
  const ast = sfcToEstree(source)
  expect(bt.isFile(ast)).toBe(true)
})
