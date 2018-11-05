import parseJavascript from '../parseJavascript'
import { ParserOptions, PropsResult, EventResult, MethodResult } from '../index'
import * as path from 'path'
import * as fs from 'fs'
import sfcToAST, { AstResult } from '../sfcToAST'
import * as bt from '@babel/types'

function getAST(fileName: string): object {
  const p = path.resolve(__dirname, `../../../__fixtures__/${fileName}`)
  const source = fs.readFileSync(p, 'utf-8')
  return sfcToAST(source)
}

test('Get the component name correctly', () => {
  const sfc: AstResult = getAST('name.vue')
  const mockOnName = jest.fn(() => {})
  const options: ParserOptions = {
    onName: mockOnName
  }
  parseJavascript(sfc.jsAst as bt.File, options)
  const arg = mockOnName.mock.calls[0][0]

  expect(mockOnName.mock.calls.length).toBe(1)
  expect(arg).toBe('compName')
})

test('Ability to correctly handle props that is an array of string', () => {
  const sfc: AstResult = getAST('arrayProps.vue')
  const mockOnProp = jest.fn(() => {})
  const options: ParserOptions = {
    onProp: mockOnProp
  }
  parseJavascript(sfc.jsAst as bt.File, options)
  const arg = mockOnProp.mock.calls[0][0]

  expect(mockOnProp.mock.calls.length).toBe(1)
  expect((arg as PropsResult[])[0]).toEqual({
    type: null,
    name: 'a'
  })
})

const sfc1: AstResult = getAST('objectProps.vue')
test('Is a prop using a shorthand type', () => {
  const mockOnProp = jest.fn(() => {})
  const options: ParserOptions = {
    onProp: mockOnProp
  }
  parseJavascript(sfc1.jsAst as bt.File, options)
  const arg = mockOnProp.mock.calls[0][0]

  expect(mockOnProp.mock.calls.length).toBe(1)
  expect((arg as PropsResult[])[0]).toEqual({
    name: 'a',
    type: 'String',
    describe: []
  })
})

test('`prop` defined using a type array', () => {
  const mockOnProp = jest.fn(() => {})
  const options: ParserOptions = {
    onProp: mockOnProp
  }
  parseJavascript(sfc1.jsAst as bt.File, options)
  const arg = mockOnProp.mock.calls[0][0]

  expect(mockOnProp.mock.calls.length).toBe(1)
  expect((arg as PropsResult[])[1]).toEqual({
    name: 'b',
    type: ['Number', 'String'],
    describe: []
  })
})

test('Execute the default function and get the default value correctly', () => {
  const mockOnProp = jest.fn(() => {})
  const options: ParserOptions = {
    onProp: mockOnProp
  }
  parseJavascript(sfc1.jsAst as bt.File, options)
  const arg = mockOnProp.mock.calls[0][0]

  expect(mockOnProp.mock.calls.length).toBe(1)
  expect(arg[2].name).toBe('c')
  expect(arg[2].default).toEqual({
    val: 1
  })
})

test('Get the `required` value correctly', () => {
  const mockOnProp = jest.fn(() => {})
  const options: ParserOptions = {
    onProp: mockOnProp
  }
  parseJavascript(sfc1.jsAst as bt.File, options)
  const arg = mockOnProp.mock.calls[0][0]

  expect(mockOnProp.mock.calls.length).toBe(1)
  expect(arg[2].required).toBe(true)
})

test('The validator function should be used as a string representation', () => {
  const mockOnProp = jest.fn(() => {})
  const options: ParserOptions = {
    onProp: mockOnProp
  }
  parseJavascript(sfc1.jsAst as bt.File, options)
  const arg = mockOnProp.mock.calls[0][0]

  expect(mockOnProp.mock.calls.length).toBe(1)
  expect(arg[2].validator).toMatchSnapshot()
})

test('The `prop` that does not satisfy the `prop` writing specification should be treated as no type', () => {
  const mockOnProp = jest.fn(() => {})
  const options: ParserOptions = {
    onProp: mockOnProp
  }
  parseJavascript(sfc1.jsAst as bt.File, options)
  const arg = mockOnProp.mock.calls[0][0]

  expect(mockOnProp.mock.calls.length).toBe(1)
  expect((arg as PropsResult[])[3]).toEqual({
    name: 'd',
    type: null,
    describe: []
  })
})

test('When the `type` definition contains `Function`, should get a string representation of the `default` function.', () => {
  const mockOnProp = jest.fn(() => {})
  const options: ParserOptions = {
    onProp: mockOnProp
  }
  parseJavascript(sfc1.jsAst as bt.File, options)
  const arg = mockOnProp.mock.calls[0][0]

  expect(mockOnProp.mock.calls.length).toBe(1)
  expect(arg[4].name).toBe('e')
  expect(arg[4].default).toMatchSnapshot()
})

test('Get comments as a description', () => {
  const sfc: AstResult = getAST('commentProps.vue')
  const mockOnProp = jest.fn(() => {})
  const options: ParserOptions = {
    onProp: mockOnProp
  }
  parseJavascript(sfc.jsAst as bt.File, options)
  const arg = mockOnProp.mock.calls[0][0]

  expect(mockOnProp.mock.calls.length).toBe(1)
  expect((arg[0].describe as []).length).toBe(3)
  expect(arg[0].describe).toMatchSnapshot()
})

test('Gets a description of the default value and a description of the validator', () => {
  const sfc: AstResult = getAST('propFieldComment.vue')
  const mockOnProp = jest.fn(() => {})
  const options: ParserOptions = {
    onProp: mockOnProp
  }
  parseJavascript(sfc.jsAst as bt.File, options)
  const arg = mockOnProp.mock.calls[0][0]

  expect(mockOnProp.mock.calls.length).toBe(1)
  expect((arg[0].defaultDesc as string[]).length).toBe(1)
  expect(arg[0].defaultDesc).toEqual(['An empty function'])
  expect((arg[1].validatorDesc as string[]).length).toBe(1)
  expect(arg[1].validatorDesc).toEqual(['Must be a number greater than 0'])
  expect((arg[2].typeDesc as string[]).length).toBe(1)
  expect(arg[2].typeDesc).toMatchSnapshot()
})

test('Correct handling of events', () => {
  const sfc: AstResult = getAST('emit.vue')
  const mockOnEvent = jest.fn(() => {})
  const options: ParserOptions = {
    onEvent: mockOnEvent
  }
  parseJavascript(sfc.jsAst as bt.File, options)
  const arg = mockOnEvent.mock.calls[0][0]

  expect(mockOnEvent.mock.calls.length).toBe(1)
  expect((arg as EventResult).name).toBe('click')
  expect(((arg as EventResult).describe as string[]).length).toBe(1)
  expect(((arg as EventResult).argumentsDesc as string[]).length).toBe(1)
  expect((arg as EventResult).describe).toMatchSnapshot()
  expect((arg as EventResult).argumentsDesc).toMatchSnapshot()
})

test('Only call onEvent once for the same event', () => {
  const sfc: AstResult = getAST('repeatEmit.vue')
  const mockOnEvent = jest.fn(() => {})
  const options: ParserOptions = {
    onEvent: mockOnEvent
  }
  parseJavascript(sfc.jsAst as bt.File, options)

  expect(mockOnEvent.mock.calls.length).toBe(1)
})

test('Correct handling of methods', () => {
  const sfc: AstResult = getAST('methods.vue')
  const mockOnMethod = jest.fn(() => {})
  const options: ParserOptions = {
    onMethod: mockOnMethod
  }
  parseJavascript(sfc.jsAst as bt.File, options)
  const arg = mockOnMethod.mock.calls[0][0]

  expect(mockOnMethod.mock.calls.length).toBe(1)
  expect((arg as MethodResult).name).toBe('fn')
  expect(((arg as MethodResult).describe as string[]).length).toBe(1)
  expect(((arg as MethodResult).argumentsDesc as string[]).length).toBe(1)
  expect((arg as MethodResult).describe).toMatchSnapshot()
  expect((arg as MethodResult).argumentsDesc).toMatchSnapshot()
})
