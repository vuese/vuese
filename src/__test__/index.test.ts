import vuese, { ParserOptions, PropsResult } from '../index'
import { getAST } from './utils'

test('Ability to correctly handle props that is an array of string', () => {
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

const ast = getAST('objectProps.vue')
test('Is a prop using a shorthand type', () => {
  const options: ParserOptions = {
    onProp: (propsRes?: PropsResult[]) => {
      expect((propsRes as PropsResult[])[0]).toEqual({
        name: 'a',
        type: 'String'
      })
    }
  }
  vuese(ast, options)
})

test('`prop` defined using a type array', () => {
  const options: ParserOptions = {
    onProp: (propsRes?: PropsResult[]) => {
      expect((propsRes as PropsResult[])[1]).toEqual({
        name: 'b',
        type: ['Number', 'String']
      })
    }
  }
  vuese(ast, options)
})

test('Execute the default function and get the default value correctly', () => {
  const options: ParserOptions = {
    onProp: (propsRes?: PropsResult[]) => {
      const propRes = (propsRes as PropsResult[])[2]
      expect(propRes.name).toBe('c')
      expect(propRes.default).toEqual({
        val: 1
      })
    }
  }
  vuese(ast, options)
})

test('Get the `required` value correctly', () => {
  const options: ParserOptions = {
    onProp: (propsRes?: PropsResult[]) => {
      const propRes = (propsRes as PropsResult[])[2]
      expect(propRes.required).toBe(true)
    }
  }
  vuese(ast, options)
})

test('The validator function should be used as a string representation', () => {
  const options: ParserOptions = {
    onProp: (propsRes?: PropsResult[]) => {
      const propRes = (propsRes as PropsResult[])[2]
      expect(propRes.validator).toMatchSnapshot()
    }
  }
  vuese(ast, options)
})

test('The `prop` that does not satisfy the `prop` writing specification should be treated as no type', () => {
  const options: ParserOptions = {
    onProp: (propsRes?: PropsResult[]) => {
      expect((propsRes as PropsResult[])[3]).toEqual({
        name: 'd',
        type: null
      })
    }
  }
  vuese(ast, options)
})

test('When the `type` definition contains `Function`, you should get a string representation of the `default` function.', () => {
  const options: ParserOptions = {
    onProp: (propsRes?: PropsResult[]) => {
      const propRes = (propsRes as PropsResult[])[4]
      expect(propRes.name).toBe('e')
      expect(propRes.default).toMatchSnapshot()
    }
  }
  vuese(ast, options)
})
