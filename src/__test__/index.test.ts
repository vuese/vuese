import vuese, { ParserOptions } from '../index'
import { getAST } from './utils'

test('get the correct props value', () => {
  const ast = getAST('common.vue')
  const options: ParserOptions = {
    onProp: origValue => {
      expect(origValue).toEqual({ a: String })
    }
  }
  vuese(ast, options)
})
