import * as path from 'path'
import * as fs from 'fs'
import sfcToEstree from '../sfcToEstree'

export function getAST(fileName: string): object {
  const p = path.resolve(__dirname, `../../__fixtures__/${fileName}`)
  const source = fs.readFileSync(p, 'utf-8')
  return sfcToEstree(source)
}

test('placeholder', () => {})
