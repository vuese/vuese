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

const ast1 = getAST('objectProps.vue')
test('Is a prop using a shorthand type', () => {
  const options: ParserOptions = {
    onProp: (propsRes?: PropsResult[]) => {
      expect((propsRes as PropsResult[])[0]).toEqual({
        name: 'a',
        type: 'String',
        describe: []
      })
    }
  }
  vuese(ast1, options)
})

test('`prop` defined using a type array', () => {
  const options: ParserOptions = {
    onProp: (propsRes?: PropsResult[]) => {
      expect((propsRes as PropsResult[])[1]).toEqual({
        name: 'b',
        type: ['Number', 'String'],
        describe: []
      })
    }
  }
  vuese(ast1, options)
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
  vuese(ast1, options)
})

test('Get the `required` value correctly', () => {
  const options: ParserOptions = {
    onProp: (propsRes?: PropsResult[]) => {
      const propRes = (propsRes as PropsResult[])[2]
      expect(propRes.required).toBe(true)
    }
  }
  vuese(ast1, options)
})

test('The validator function should be used as a string representation', () => {
  const options: ParserOptions = {
    onProp: (propsRes?: PropsResult[]) => {
      const propRes = (propsRes as PropsResult[])[2]
      expect(propRes.validator).toMatchSnapshot()
    }
  }
  vuese(ast1, options)
})

test('The `prop` that does not satisfy the `prop` writing specification should be treated as no type', () => {
  const options: ParserOptions = {
    onProp: (propsRes?: PropsResult[]) => {
      expect((propsRes as PropsResult[])[3]).toEqual({
        name: 'd',
        type: null,
        describe: []
      })
    }
  }
  vuese(ast1, options)
})

test('When the `type` definition contains `Function`, you should get a string representation of the `default` function.', () => {
  const options: ParserOptions = {
    onProp: (propsRes?: PropsResult[]) => {
      const propRes = (propsRes as PropsResult[])[4]
      expect(propRes.name).toBe('e')
      expect(propRes.default).toMatchSnapshot()
    }
  }
  vuese(ast1, options)
})

test('Get comments as a description', () => {
  const ast = getAST('commentProps.vue')
  const options: ParserOptions = {
    onProp: (propsRes?: PropsResult[]) => {
      const propRes = (propsRes as PropsResult[])[0]
      expect((propRes.describe as []).length).toBe(2)
      expect(propRes.describe).toMatchSnapshot()
    }
  }
  vuese(ast, options)
})

test('Gets a description of the default value and a description of the validator', () => {
  const ast = getAST('propFieldComment.vue')
  const options: ParserOptions = {
    onProp: (propsRes?: PropsResult[]) => {
      let propRes = (propsRes as PropsResult[])[0]
      expect((propRes.defaultDesc as string[]).length).toBe(1)
      expect(propRes.defaultDesc).toEqual(['An empty function'])

      propRes = (propsRes as PropsResult[])[1]
      expect((propRes.validatorDesc as string[]).length).toBe(1)
      expect(propRes.validatorDesc).toEqual(['Must be a number greater than 0'])

      propRes = (propsRes as PropsResult[])[2]
      expect((propRes.typeDesc as string[]).length).toBe(1)
      expect(propRes.typeDesc).toMatchSnapshot()
    }
  }
  vuese(ast, options)
})
