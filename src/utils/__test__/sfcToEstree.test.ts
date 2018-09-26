import sfcToEstree from '../sfcToEstree'
import * as path from 'path'
import * as fs from 'fs'

const p: string = path.resolve(__dirname, './__fixtures__/common.vue')
const source: string = fs.readFileSync(p, 'utf-8')

test('works', () => {
  const ast = sfcToEstree(source)
  console.log(ast)
})
