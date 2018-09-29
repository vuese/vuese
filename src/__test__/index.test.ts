import vuese, { ParserOptions, PropsResult } from '../index'
import { getAST } from './utils'

test('Ability to correctly handle props of arrays of type string', () => {
  const ast = getAST('arrayProps.vue')
  const options: ParserOptions = {
    onProp: (propsRes?: PropsResult[]) => {
      expect((propsRes as PropsResult[])[0]).toEqual({
        type: null,
        name: 'a'
      })
    }
  }
  vuese(ast, options)
})

test('Ability to correctly handle props that is object', () => {
  const ast = getAST('objectProps.vue')
  const options: ParserOptions = {
    onProp: () => {}
  }
  vuese(ast, options)
})
