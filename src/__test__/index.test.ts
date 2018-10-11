import vuese from '../index'
import * as path from 'path'
import * as fs from 'fs'

function getSource(fileName: string): string {
  const p = path.resolve(__dirname, `../../__fixtures__/${fileName}`)
  const source = fs.readFileSync(p, 'utf-8')
  return source
}

test('The generated document matches the expected results', () => {
  const source = getSource('all.vue')
  expect(vuese(source)).toMatchSnapshot()
})
