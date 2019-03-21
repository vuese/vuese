import {
  parseJavascript,
  ParserOptions,
  PropsResult,
  EventResult,
  MethodResult,
  SlotResult
} from '@vuese/parser'
import * as path from 'path'
import * as fs from 'fs'
import { sfcToAST, AstResult } from '@vuese/parser'
import * as bt from '@babel/types'

function getAST(fileName: string): object {
  const p = path.resolve(__dirname, `./__fixtures__/${fileName}`)
  const source = fs.readFileSync(p, 'utf-8')
  return sfcToAST(source)
}

test('Get the component name correctly', () => {
  const sfc: AstResult = getAST('name.vue')
  const mockOnName = jest.fn(() => {})
  const mockOnDesc = jest.fn(() => {})
  const options: ParserOptions = {
    onName: mockOnName,
    onDesc: mockOnDesc
  }
  parseJavascript(sfc.jsAst as bt.File, options)
  const arg1 = mockOnName.mock.calls[0][0]
  const arg2 = mockOnDesc.mock.calls[0][0]

  expect(mockOnName.mock.calls.length).toBe(1)
  expect(arg1).toBe('compName')
  expect(arg2).toMatchSnapshot()
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
  expect(arg as PropsResult).toEqual({
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

  expect(mockOnProp.mock.calls.length).toBe(6)
  expect(arg as PropsResult).toEqual({
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
  const arg = mockOnProp.mock.calls[1][0]

  expect(mockOnProp.mock.calls.length).toBe(6)
  expect(arg as PropsResult).toEqual({
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
  const arg = mockOnProp.mock.calls[2][0]

  expect(mockOnProp.mock.calls.length).toBe(6)
  expect(arg.name).toBe('c')
  expect(arg.default).toEqual({
    val: 1
  })
})

test('Get the `required` value correctly', () => {
  const mockOnProp = jest.fn(() => {})
  const options: ParserOptions = {
    onProp: mockOnProp
  }
  parseJavascript(sfc1.jsAst as bt.File, options)
  const arg = mockOnProp.mock.calls[2][0]

  expect(mockOnProp.mock.calls.length).toBe(6)
  expect(arg.required).toBe(true)
})

test('The validator function should be used as a string representation', () => {
  const mockOnProp = jest.fn(() => {})
  const options: ParserOptions = {
    onProp: mockOnProp
  }
  parseJavascript(sfc1.jsAst as bt.File, options)
  const arg = mockOnProp.mock.calls[2][0]

  expect(mockOnProp.mock.calls.length).toBe(6)
  expect(arg.validator).toMatchSnapshot()
})

test('The `prop` that does not satisfy the `prop` writing specification should be treated as no type', () => {
  const mockOnProp = jest.fn(() => {})
  const options: ParserOptions = {
    onProp: mockOnProp
  }
  parseJavascript(sfc1.jsAst as bt.File, options)
  const arg = mockOnProp.mock.calls[3][0]

  expect(mockOnProp.mock.calls.length).toBe(6)
  expect(arg as PropsResult).toEqual({
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
  const arg = mockOnProp.mock.calls[4][0]

  expect(mockOnProp.mock.calls.length).toBe(6)
  expect(arg.name).toBe('e')
  expect(arg.default).toMatchSnapshot()
})

test('Props: gets correct name for a quoted property', () => {
  const mockOnProp = jest.fn(() => {})
  const options: ParserOptions = {
    onProp: mockOnProp
  }
  parseJavascript(sfc1.jsAst as bt.File, options)
  const arg = mockOnProp.mock.calls[5][0]

  expect(mockOnProp.mock.calls.length).toBe(6)
  expect(arg.name).toBe('g')
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
  expect((arg.describe as []).length).toBe(3)
  expect(arg.describe).toMatchSnapshot()
})

test('Gets a description of the default value and a description of the validator', () => {
  const sfc: AstResult = getAST('propFieldComment.vue')
  const mockOnProp = jest.fn(() => {})
  const options: ParserOptions = {
    onProp: mockOnProp
  }
  parseJavascript(sfc.jsAst as bt.File, options)
  const arg1 = mockOnProp.mock.calls[0][0]
  const arg2 = mockOnProp.mock.calls[1][0]
  const arg3 = mockOnProp.mock.calls[2][0]

  expect(mockOnProp.mock.calls.length).toBe(3)
  expect((arg1.defaultDesc as string[]).length).toBe(1)
  expect(arg1.defaultDesc).toEqual(['An empty function'])
  expect((arg2.validatorDesc as string[]).length).toBe(1)
  expect(arg2.validatorDesc).toEqual(['Must be a number greater than 0'])
  expect((arg3.typeDesc as string[]).length).toBe(1)
  expect(arg3.typeDesc).toMatchSnapshot()
})

test('Correct handling of events', () => {
  const sfc: AstResult = getAST('emit.vue')
  const mockOnEvent = jest.fn(() => {})
  const options: ParserOptions = {
    onEvent: mockOnEvent
  }
  parseJavascript(sfc.jsAst as bt.File, options)
  const arg1 = mockOnEvent.mock.calls[0][0]
  const arg2 = mockOnEvent.mock.calls[1][0]

  expect(mockOnEvent.mock.calls.length).toBe(2)
  expect((arg1 as EventResult).name).toBe('click')
  expect(((arg1 as EventResult).describe as string[]).length).toBe(1)
  expect(((arg1 as EventResult).argumentsDesc as string[]).length).toBe(1)
  expect((arg1 as EventResult).describe).toMatchSnapshot()
  expect((arg1 as EventResult).argumentsDesc).toMatchSnapshot()

  // .sync
  expect((arg2 as EventResult).name).toBe('update:some-prop')
  expect((arg2 as EventResult).isSync).toBe(true)
  expect((arg2 as EventResult).syncProp).toBe('some-prop')
  expect(((arg2 as EventResult).describe as string[]).length).toBe(0)
  expect((arg2 as EventResult).argumentsDesc).toBe(undefined)
  expect((arg2 as EventResult).describe).toMatchSnapshot()
  expect((arg2 as EventResult).argumentsDesc).toMatchSnapshot()
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

test('The options in @Component should be parsed correctly', () => {
  const sfc: AstResult = getAST('tsBase.vue')
  const mockOnMethod = jest.fn(() => {})
  const mockOnEvent = jest.fn(() => {})
  const mockOnProp = jest.fn(() => {})
  const mockOnDesc = jest.fn(() => {})
  const options: ParserOptions = {
    onMethod: mockOnMethod,
    onEvent: mockOnEvent,
    onProp: mockOnProp,
    onDesc: mockOnDesc
  }
  parseJavascript(sfc.jsAst as bt.File, options)

  const arg = mockOnMethod.mock.calls[0][0]
  expect(mockOnMethod.mock.calls.length).toBe(1)
  expect((arg as MethodResult).name).toBe('clear')
  expect(((arg as MethodResult).describe as string[]).length).toBe(1)
  expect(((arg as MethodResult).argumentsDesc as string[]).length).toBe(1)
  expect((arg as MethodResult).describe).toMatchSnapshot()
  expect((arg as MethodResult).argumentsDesc).toMatchSnapshot()

  const arg1 = mockOnEvent.mock.calls[0][0]
  expect(mockOnEvent.mock.calls.length).toBe(1)
  expect((arg1 as EventResult).name).toBe('onclear')
  expect(((arg1 as EventResult).describe as string[]).length).toBe(1)
  expect(((arg1 as EventResult).argumentsDesc as string[]).length).toBe(1)
  expect((arg1 as EventResult).describe).toMatchSnapshot()
  expect((arg1 as EventResult).argumentsDesc).toMatchSnapshot()

  const arg2 = mockOnProp.mock.calls[0][0]
  expect(mockOnProp.mock.calls.length).toBe(1)
  expect(arg2 as PropsResult).toMatchSnapshot()

  const arg4 = mockOnDesc.mock.calls[0][0]
  expect(arg4).toMatchSnapshot()
})

test('@Prop decorator', () => {
  const sfc: AstResult = getAST('tsProp.vue')
  const mockOnProp = jest.fn(() => {})
  const options: ParserOptions = {
    onProp: mockOnProp
  }
  parseJavascript(sfc.jsAst as bt.File, options)

  const arg1 = mockOnProp.mock.calls[0][0]
  const arg2 = mockOnProp.mock.calls[1][0]
  const arg3 = mockOnProp.mock.calls[2][0]

  expect(mockOnProp.mock.calls.length).toBe(3)
  expect((arg1 as PropsResult).name).toBe('a')
  expect((arg1 as PropsResult).type).toBe('Number')
  expect((arg1 as PropsResult).describe).toMatchSnapshot()

  expect((arg2 as PropsResult).name).toBe('b')
  expect((arg2 as PropsResult).type).toEqual(['Number', 'String'])

  expect((arg3 as PropsResult).name).toBe('c')
  expect((arg3 as PropsResult).type).toBe('Number')
  expect((arg3 as PropsResult).required).toBe(true)
  expect((arg3 as PropsResult).defaultDesc).toMatchSnapshot()
})

test('Class method', () => {
  const sfc: AstResult = getAST('tsMethod.vue')
  const mockOnMethod = jest.fn(() => {})
  const options: ParserOptions = {
    onMethod: mockOnMethod
  }
  parseJavascript(sfc.jsAst as bt.File, options)

  const arg = mockOnMethod.mock.calls[0][0]
  expect(mockOnMethod.mock.calls.length).toBe(1)
  expect((arg as MethodResult).name).toBe('someMethod')
  expect(((arg as MethodResult).describe as string[]).length).toBe(1)
  expect(((arg as MethodResult).argumentsDesc as string[]).length).toBe(1)
  expect((arg as MethodResult).describe).toMatchSnapshot()
  expect((arg as MethodResult).argumentsDesc).toMatchSnapshot()
})

test('@Emit decorator', () => {
  const sfc: AstResult = getAST('tsEmit.vue')
  const mockOnEvent = jest.fn(() => {})
  const options: ParserOptions = {
    onEvent: mockOnEvent
  }
  parseJavascript(sfc.jsAst as bt.File, options)

  const arg1 = mockOnEvent.mock.calls[0][0]
  const arg2 = mockOnEvent.mock.calls[1][0]
  const arg3 = mockOnEvent.mock.calls[2][0]

  expect(mockOnEvent.mock.calls.length).toBe(3)
  expect((arg1 as EventResult).name).toBe('on-click')
  expect(((arg1 as EventResult).describe as string[]).length).toBe(1)
  expect(((arg1 as EventResult).argumentsDesc as string[]).length).toBe(1)
  expect((arg1 as EventResult).describe).toMatchSnapshot()
  expect((arg1 as EventResult).argumentsDesc).toMatchSnapshot()

  expect((arg2 as EventResult).name).toBe('reset')

  expect((arg3 as EventResult).name).toBe('update:some-prop')
  expect((arg3 as EventResult).isSync).toBe(true)
  expect((arg3 as EventResult).syncProp).toBe('some-prop')
})

test('Slots in script', () => {
  const sfc: AstResult = getAST('slotsInScript.vue')
  const mockOnSlot = jest.fn(() => {})
  const options: ParserOptions = {
    onSlot: mockOnSlot
  }
  parseJavascript(sfc.jsAst as bt.File, options)

  const arg1 = mockOnSlot.mock.calls[0][0]
  const arg2 = mockOnSlot.mock.calls[1][0]
  const arg3 = mockOnSlot.mock.calls[2][0]
  const arg4 = mockOnSlot.mock.calls[3][0]

  expect(mockOnSlot.mock.calls.length).toBe(4)
  expect((arg1 as SlotResult).name).toBe('header')
  expect((arg1 as SlotResult).describe).toMatchSnapshot()
  expect((arg1 as SlotResult).backerDesc).toMatchSnapshot()

  expect((arg2 as SlotResult).name).toBe('default')
  expect((arg2 as SlotResult).describe).toMatchSnapshot()
  expect((arg2 as SlotResult).backerDesc).toMatchSnapshot()

  expect((arg3 as SlotResult).name).toBe('footer')
  expect((arg3 as SlotResult).describe).toMatchSnapshot()
  expect((arg3 as SlotResult).backerDesc).toMatchSnapshot()

  expect((arg4 as SlotResult).name).toBe('sidebar')
  expect((arg4 as SlotResult).describe).toMatchSnapshot()
  expect((arg4 as SlotResult).backerDesc).toMatchSnapshot()
})

test('Scoped slots in script', () => {
  const sfc: AstResult = getAST('scopedSlotsInScript.vue')
  const mockOnSlot = jest.fn(() => {})
  const options: ParserOptions = {
    onSlot: mockOnSlot
  }
  parseJavascript(sfc.jsAst as bt.File, options)

  const arg1 = mockOnSlot.mock.calls[0][0]
  const arg2 = mockOnSlot.mock.calls[1][0]

  expect(mockOnSlot.mock.calls.length).toBe(2)
  expect((arg1 as SlotResult).name).toBe('title')
  expect((arg1 as SlotResult).describe).toMatchSnapshot()
  expect((arg1 as SlotResult).backerDesc).toMatchSnapshot()

  expect((arg2 as SlotResult).name).toBe('tip')
  expect((arg2 as SlotResult).describe).toMatchSnapshot()
  expect((arg2 as SlotResult).backerDesc).toMatchSnapshot()
})

test('Functional children', () => {
  const sfc: AstResult = getAST('functionalChildren.vue')
  const mockOnSlot = jest.fn(() => {})
  const options: ParserOptions = {
    onSlot: mockOnSlot
  }
  parseJavascript(sfc.jsAst as bt.File, options)

  const arg = mockOnSlot.mock.calls[0][0]

  expect(mockOnSlot.mock.calls.length).toBe(1)
  expect((arg as SlotResult).name).toBe('default')
  expect((arg as SlotResult).describe).toMatchSnapshot()
  expect((arg as SlotResult).backerDesc).toMatchSnapshot()
})

test('@Component: Functional children', () => {
  const sfc: AstResult = getAST('functionalChildrenDecorator.vue')
  const mockOnSlot = jest.fn(() => {})
  const options: ParserOptions = {
    onSlot: mockOnSlot
  }
  parseJavascript(sfc.jsAst as bt.File, options)

  expect(mockOnSlot.mock.calls.length).toBe(1)
  const arg = mockOnSlot.mock.calls[0][0]

  expect((arg as SlotResult).name).toBe('default')
  expect((arg as SlotResult).describe).toMatchSnapshot()
  expect((arg as SlotResult).backerDesc).toMatchSnapshot()
})

test('Render function in class method: Functional children', () => {
  const sfc: AstResult = getAST('functionalChildrenClassMethod.vue')
  const mockOnSlot = jest.fn(() => {})
  const options: ParserOptions = {
    onSlot: mockOnSlot
  }
  parseJavascript(sfc.jsAst as bt.File, options)

  expect(mockOnSlot.mock.calls.length).toBe(1)
  const arg = mockOnSlot.mock.calls[0][0]

  expect((arg as SlotResult).name).toBe('default')
  expect((arg as SlotResult).describe).toMatchSnapshot()
  expect((arg as SlotResult).backerDesc).toMatchSnapshot()
})
