import parseJavascript from '../parseJavascript'
import { ParserOptions, PropsResult, EventResult } from '../index'
import * as path from 'path'
import * as fs from 'fs'
import sfcToAST, { AstResult } from '../sfcToAST'

function getAST(fileName: string): object {
  const p = path.resolve(__dirname, `../../../__fixtures__/${fileName}`)
  const source = fs.readFileSync(p, 'utf-8')
  return sfcToAST(source)
}

test('Ability to correctly handle props that is an array of string', () => {
  const sfc: AstResult = getAST('arrayProps.vue')
  const options: ParserOptions = {
    onProp: (propsRes?: PropsResult[]) => {
      expect((propsRes as PropsResult[])[0]).toEqual({
        type: null,
        name: 'a'
      })
    }
  }
  parseJavascript(sfc.jsAst, options)
})

const sfc1: AstResult = getAST('objectProps.vue')
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
  parseJavascript(sfc1.jsAst, options)
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
  parseJavascript(sfc1.jsAst, options)
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
  parseJavascript(sfc1.jsAst, options)
})

test('Get the `required` value correctly', () => {
  const options: ParserOptions = {
    onProp: (propsRes?: PropsResult[]) => {
      const propRes = (propsRes as PropsResult[])[2]
      expect(propRes.required).toBe(true)
    }
  }
  parseJavascript(sfc1.jsAst, options)
})

test('The validator function should be used as a string representation', () => {
  const options: ParserOptions = {
    onProp: (propsRes?: PropsResult[]) => {
      const propRes = (propsRes as PropsResult[])[2]
      expect(propRes.validator).toMatchSnapshot()
    }
  }
  parseJavascript(sfc1.jsAst, options)
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
  parseJavascript(sfc1.jsAst, options)
})

test('When the `type` definition contains `Function`, should get a string representation of the `default` function.', () => {
  const options: ParserOptions = {
    onProp: (propsRes?: PropsResult[]) => {
      const propRes = (propsRes as PropsResult[])[4]
      expect(propRes.name).toBe('e')
      expect(propRes.default).toMatchSnapshot()
    }
  }
  parseJavascript(sfc1.jsAst, options)
})

test('Get comments as a description', () => {
  const sfc: AstResult = getAST('commentProps.vue')
  const options: ParserOptions = {
    onProp: (propsRes?: PropsResult[]) => {
      const propRes = (propsRes as PropsResult[])[0]
      expect((propRes.describe as []).length).toBe(3)
      expect(propRes.describe).toMatchSnapshot()
    }
  }
  parseJavascript(sfc.jsAst, options)
})

test('Gets a description of the default value and a description of the validator', () => {
  const sfc: AstResult = getAST('propFieldComment.vue')
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
  parseJavascript(sfc.jsAst, options)
})

test('Correct handling of events', () => {
  const sfc: AstResult = getAST('emit.vue')
  const options: ParserOptions = {
    onEvent(eventRes?: EventResult) {
      expect((eventRes as EventResult).name).toBe('click')
      expect(((eventRes as EventResult).describe as string[]).length).toBe(1)
      expect(((eventRes as EventResult).argumentsDesc as string[]).length).toBe(
        1
      )
      expect((eventRes as EventResult).describe).toMatchSnapshot()
      expect((eventRes as EventResult).argumentsDesc).toMatchSnapshot()
    }
  }
  parseJavascript(sfc.jsAst, options)
})
