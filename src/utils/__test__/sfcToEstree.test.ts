import sfcToEstree from '../sfcToEstree'
import * as path from 'path'
import * as fs from 'fs'

const p = path.resolve(__dirname, '../../../__fixtures__/common.vue')
const source = fs.readFileSync(p, 'utf-8')

test('works2', () => {
  console.log(sfcToEstree(source))
})
