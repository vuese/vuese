/* eslint-disable @typescript-eslint/no-empty-function */
import {
  parseJavascript,
  ParserOptions,
  PropsResult,
  EventResult,
  MethodResult,
  SlotResult,
  MixInResult,
  DataResult,
  ComputedResult,
  WatchResult,
  parseTemplate
} from '@vuese/parser'
import * as path from 'path'
import * as fs from 'fs'
import { sfcToAST, AstResult, BabelParserPlugins } from '@vuese/parser'
import * as bt from '@babel/types'
import { Seen } from '../lib/seen'

function getAST(
  fileName: string,
  babelParserPlugins?: BabelParserPlugins
): AstResult {
  const p = path.resolve(__dirname, `./__fixtures__/${fileName}`)
  const source = fs.readFileSync(p, 'utf-8')
  return sfcToAST(source, babelParserPlugins, path.dirname(p))
}

test('get namedExport component metadata correctly', () => {
  const sfc: AstResult = getAST('namedExport.vue')
  const mockOnName = jest.fn(() => {})
  const mockOnDesc = jest.fn(() => {})
  const mockOnData = jest.fn(() => {})
  const mockOnProp = jest.fn(() => {})

  const options: ParserOptions = {
    onName: mockOnName,
    onDesc: mockOnDesc,
    onData: mockOnData,
    onProp: mockOnProp
  }
  const seen = new Seen()
  parseJavascript(sfc.jsAst as bt.File, seen, options, sfc.jsSource)

  expect(mockOnName.mock.calls.length).toBe(1)
  expect(mockOnDesc.mock.calls.length).toBe(1)
  expect(mockOnData.mock.calls.length).toBe(1)
  expect(mockOnProp.mock.calls.length).toBe(1)

  const arg1 = mockOnName.mock.calls[0][0]
  const arg2 = mockOnDesc.mock.calls[0][0]
  const arg3 = mockOnData.mock.calls[0][0]
  const arg4 = mockOnProp.mock.calls[0][0]

  expect(arg1).toBe('compName')
  expect(arg2).toEqual({ default: ['This is a description of the component'] })
  expect(arg3).toEqual({
    default: '1',
    describe: [],
    name: 'a',
    type: 'Number'
  })
  expect(arg4).toEqual({ describe: [], name: 'a', type: 'String' })
})

test('get component metadata that generated from a callExpression  correctly', () => {
  const sfc: AstResult = getAST('callExpressionExport.vue')
  const mockOnName = jest.fn(() => {})
  const mockOnDesc = jest.fn(() => {})
  const mockOnData = jest.fn(() => {})
  const mockOnProp = jest.fn(() => {})

  const options: ParserOptions = {
    onName: mockOnName,
    onDesc: mockOnDesc,
    onData: mockOnData,
    onProp: mockOnProp
  }
  const seen = new Seen()
  parseJavascript(sfc.jsAst as bt.File, seen, options, sfc.jsSource)

  expect(mockOnName.mock.calls.length).toBe(1)
  expect(mockOnDesc.mock.calls.length).toBe(1)
  expect(mockOnData.mock.calls.length).toBe(1)
  expect(mockOnProp.mock.calls.length).toBe(1)

  const arg1 = mockOnName.mock.calls[0][0]
  const arg2 = mockOnDesc.mock.calls[0][0]
  const arg3 = mockOnData.mock.calls[0][0]
  const arg4 = mockOnProp.mock.calls[0][0]

  expect(arg1).toBe('compName')
  expect(arg2).toEqual({ default: ['This is a description of the component'] })
  expect(arg3).toEqual({
    default: '1',
    describe: [],
    name: 'a',
    type: 'Number'
  })
  expect(arg4).toEqual({ describe: [], name: 'a', type: 'String' })
})

test('Get the component name correctly', () => {
  const sfc: AstResult = getAST('name.vue')
  const mockOnName = jest.fn(() => {})
  const mockOnDesc = jest.fn(() => {})
  const options: ParserOptions = {
    onName: mockOnName,
    onDesc: mockOnDesc
  }
  const seen = new Seen()
  parseJavascript(sfc.jsAst as bt.File, seen, options, sfc.jsSource)
  const arg1 = mockOnName.mock.calls[0][0]
  const arg2 = mockOnDesc.mock.calls[0][0]

  expect(mockOnName.mock.calls.length).toBe(1)
  expect(arg1).toBe('compName')
  expect(arg2).toEqual({ default: ['This is a description of the component'] })
  expect(arg2).toMatchSnapshot()
})

test('Ability to correctly handle props that is an array of string', () => {
  const sfc: AstResult = getAST('arrayProps.vue')
  const mockOnProp = jest.fn(() => {})
  const options: ParserOptions = {
    onProp: mockOnProp
  }
  const seen = new Seen()
  parseJavascript(sfc.jsAst as bt.File, seen, options)
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
  const seen = new Seen()
  parseJavascript(sfc1.jsAst as bt.File, seen, options)
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
  const seen = new Seen()
  parseJavascript(sfc1.jsAst as bt.File, seen, options)
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
  const seen = new Seen()
  parseJavascript(sfc1.jsAst as bt.File, seen, options)
  const arg = mockOnProp.mock.calls[2][0]

  expect(mockOnProp.mock.calls.length).toBe(6)
  expect(arg.name).toBe('c')
  expect(arg.default).toEqual('{"val":1}')
})

test('Get the `required` value correctly', () => {
  const mockOnProp = jest.fn(() => {})
  const options: ParserOptions = {
    onProp: mockOnProp
  }
  const seen = new Seen()
  parseJavascript(sfc1.jsAst as bt.File, seen, options)
  const arg = mockOnProp.mock.calls[2][0]

  expect(mockOnProp.mock.calls.length).toBe(6)
  expect(arg.required).toBe(true)
})

test('The validator function should be used as a string representation', () => {
  const mockOnProp = jest.fn(() => {})
  const options: ParserOptions = {
    onProp: mockOnProp
  }
  const seen = new Seen()
  parseJavascript(sfc1.jsAst as bt.File, seen, options)
  const arg = mockOnProp.mock.calls[2][0]

  expect(mockOnProp.mock.calls.length).toBe(6)
  expect(arg.validator).toMatchSnapshot()
})

test('The `prop` that does not satisfy the `prop` writing specification should be treated as no type', () => {
  const mockOnProp = jest.fn(() => {})
  const options: ParserOptions = {
    onProp: mockOnProp
  }
  const seen = new Seen()
  parseJavascript(sfc1.jsAst as bt.File, seen, options)
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
  const seen = new Seen()
  parseJavascript(sfc1.jsAst as bt.File, seen, options)
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
  const seen = new Seen()
  parseJavascript(sfc1.jsAst as bt.File, seen, options, sfc1.jsSource)
  const arg = mockOnProp.mock.calls[5][0]

  expect(mockOnProp.mock.calls.length).toBe(6)
  expect(arg.name).toBe('g')
  expect(arg.default).toBe('HELLO')
})

test('Get comments as a description', () => {
  const sfc: AstResult = getAST('commentProps.vue')
  const mockOnProp = jest.fn(() => {})
  const options: ParserOptions = {
    onProp: mockOnProp
  }
  const seen = new Seen()
  parseJavascript(sfc.jsAst as bt.File, seen, options)
  const arg = mockOnProp.mock.calls[0][0]

  expect(mockOnProp.mock.calls.length).toBe(1)
  expect((arg.describe as []).length).toBe(3)
  expect(arg.describe).toMatchSnapshot()
})

test('Get comments maintaining markdown code blocks original indentation', () => {
  const sfc: AstResult = getAST('markdownCodeBlocks.vue')
  const mockOnDesc = jest.fn(() => {})
  const options: ParserOptions = {
    onDesc: mockOnDesc
  }
  const seen = new Seen()
  parseJavascript(sfc.jsAst as bt.File, seen, options)
  const arg = mockOnDesc.mock.calls[0][0]

  expect(mockOnDesc.mock.calls.length).toBe(1)
  expect((arg.default as []).length).toBe(10)
  expect(arg.default).toMatchSnapshot()
})

test('Get comments maintaining markdown code blocks original indentation with block comment', () => {
  const sfc: AstResult = getAST('markdownCodeBlocksWithBlockComment.vue')
  const mockOnDesc = jest.fn(() => {})
  const options: ParserOptions = {
    onDesc: mockOnDesc
  }
  const seen = new Seen()
  parseJavascript(sfc.jsAst as bt.File, seen, options)
  const arg = mockOnDesc.mock.calls[0][0]

  expect(mockOnDesc.mock.calls.length).toBe(1)
  expect((arg.default as []).length).toBe(10)
  expect(arg.default).toMatchSnapshot()
})

test('Gets a description of the default value and a description of the validator', () => {
  const sfc: AstResult = getAST('propFieldComment.vue')
  const mockOnProp = jest.fn(() => {})
  const options: ParserOptions = {
    onProp: mockOnProp
  }
  const seen = new Seen()
  parseJavascript(sfc.jsAst as bt.File, seen, options)
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
    onEvent: mockOnEvent,
    includeSyncEvent: true
  }
  const seen = new Seen()
  parseJavascript(sfc.jsAst as bt.File, seen, options)
  parseTemplate(sfc.templateAst, seen, options)
  const arg1 = mockOnEvent.mock.calls[0][0]
  const arg2 = mockOnEvent.mock.calls[1][0]
  const arg3 = mockOnEvent.mock.calls[2][0]
  const arg4 = mockOnEvent.mock.calls[3][0]

  expect(mockOnEvent.mock.calls.length).toBe(4)
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

  expect((arg3 as EventResult).name).toBe('some-event')
  expect((arg3 as EventResult).isSync).toBe(false)
  expect((arg3 as EventResult).describe).toEqual(['event desc'])
  expect((arg4 as EventResult).argumentsDesc).toBe(undefined)

  // event emit from template
  // two CallExpression should only call once, valid is $emit, invalid is `that.$emit`, the `$emit('click')` in template will ignore, cause emit in the javascript file.
  expect((arg4 as EventResult).name).toBe('close')
  expect((arg4 as EventResult).isSync).toBe(false)
  expect((arg4 as EventResult).syncProp).toBe('')
  expect(((arg4 as EventResult).describe as string[]).length).toBe(0)
  expect((arg4 as EventResult).argumentsDesc).toBe(undefined)
  expect((arg4 as EventResult).describe).toMatchSnapshot()
  expect((arg4 as EventResult).argumentsDesc).toMatchSnapshot()
})

test('Correct handling of events, but exclude syncEvent', () => {
  const sfc: AstResult = getAST('emit.vue')
  const mockOnEvent = jest.fn(() => {})
  const options: ParserOptions = {
    onEvent: mockOnEvent
  }
  const seen = new Seen()
  parseJavascript(sfc.jsAst as bt.File, seen, options)
  parseTemplate(sfc.templateAst, seen, options)
  const arg1 = mockOnEvent.mock.calls[0][0]
  const arg2 = mockOnEvent.mock.calls[1][0]
  const arg3 = mockOnEvent.mock.calls[2][0]

  expect(mockOnEvent.mock.calls.length).toBe(3)
  expect((arg1 as EventResult).name).toBe('click')

  expect((arg2 as EventResult).name).toBe('some-event')
  // event emit from template
  // two CallExpression should only call once, valid is $emit, invalid is `that.$emit`, the `$emit('click')` in template will ignore, cause emit in the javascript file.
  expect((arg3 as EventResult).name).toBe('close')
})

test('Only call onEvent once for the same event', () => {
  const sfc: AstResult = getAST('repeatEmit.vue')
  const mockOnEvent = jest.fn(() => {})
  const options: ParserOptions = {
    onEvent: mockOnEvent
  }
  const seen = new Seen()
  parseJavascript(sfc.jsAst as bt.File, seen, options)

  expect(mockOnEvent.mock.calls.length).toBe(1)
})

test('Correct handling of methods', () => {
  const sfc: AstResult = getAST('methods.vue')
  const mockOnMethod = jest.fn(() => {})
  const options: ParserOptions = {
    onMethod: mockOnMethod
  }
  const seen = new Seen()
  parseJavascript(sfc.jsAst as bt.File, seen, options)
  const arg = mockOnMethod.mock.calls[0][0]

  expect(mockOnMethod.mock.calls.length).toBe(1)
  expect((arg as MethodResult).name).toBe('fn')
  expect(((arg as MethodResult).describe as string[]).length).toBe(1)
  expect((arg as MethodResult).describe).toEqual(['Do something'])
  expect(((arg as MethodResult).argumentsDesc as string[]).length).toBe(1)
  expect((arg as MethodResult).argumentsDesc).toEqual([
    'The first parameter is a Boolean value that represents...'
  ])
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
  const seen = new Seen()
  parseJavascript(sfc.jsAst as bt.File, seen, options)

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
  const seen = new Seen()
  parseJavascript(sfc.jsAst as bt.File, seen, options, sfc.jsSource)

  const arg1 = mockOnProp.mock.calls[0][0]
  const arg2 = mockOnProp.mock.calls[1][0]
  const arg3 = mockOnProp.mock.calls[2][0]
  const arg4 = mockOnProp.mock.calls[3][0]
  const arg5 = mockOnProp.mock.calls[4][0]
  const arg6 = mockOnProp.mock.calls[5][0]

  expect(mockOnProp.mock.calls.length).toBe(6)
  expect((arg1 as PropsResult).name).toBe('a')
  expect((arg1 as PropsResult).type).toBe('Number')
  expect((arg1 as PropsResult).describe).toMatchSnapshot()

  expect((arg2 as PropsResult).name).toBe('b')
  expect((arg2 as PropsResult).type).toEqual(['Number', 'String'])

  expect((arg3 as PropsResult).name).toBe('c')
  expect((arg3 as PropsResult).type).toBe('Number')
  expect((arg3 as PropsResult).required).toBe(true)
  expect((arg3 as PropsResult).defaultDesc).toMatchSnapshot()

  expect((arg4 as PropsResult).name).toBe('d')
  expect((arg4 as PropsResult).type).toBe('string')

  expect((arg5 as PropsResult).name).toBe('e')
  expect((arg5 as PropsResult).type).toBe('number')

  expect((arg6 as PropsResult).name).toBe('comment')
  expect((arg6 as PropsResult).type).toBe('CommentType')
})

test('Class method', () => {
  const sfc: AstResult = getAST('tsMethod.vue')
  const mockOnMethod = jest.fn(() => {})
  const options: ParserOptions = {
    onMethod: mockOnMethod
  }
  const seen = new Seen()
  parseJavascript(sfc.jsAst as bt.File, seen, options)

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
    onEvent: mockOnEvent,
    includeSyncEvent: true
  }
  const seen = new Seen()
  parseJavascript(sfc.jsAst as bt.File, seen, options)

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

test('@Emit decorator, exclude syncEvent', () => {
  const sfc: AstResult = getAST('tsEmit.vue')
  const mockOnEvent = jest.fn(() => {})
  const options: ParserOptions = {
    onEvent: mockOnEvent
  }
  const seen = new Seen()
  parseJavascript(sfc.jsAst as bt.File, seen, options)
  const arg1 = mockOnEvent.mock.calls[0][0]
  const arg2 = mockOnEvent.mock.calls[1][0]

  expect(mockOnEvent.mock.calls.length).toBe(2)

  expect((arg1 as EventResult).name).toBe('on-click')

  expect((arg2 as EventResult).name).toBe('reset')
})

test('Slots in script', () => {
  const sfc: AstResult = getAST('slotsInScript.vue')
  const mockOnSlot = jest.fn(() => {})
  const options: ParserOptions = {
    onSlot: mockOnSlot
  }
  const seen = new Seen()
  parseJavascript(sfc.jsAst as bt.File, seen, options)

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
  const seen = new Seen()
  parseJavascript(sfc.jsAst as bt.File, seen, options)

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
  const seen = new Seen()
  parseJavascript(sfc.jsAst as bt.File, seen, options)

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
  const seen = new Seen()
  parseJavascript(sfc.jsAst as bt.File, seen, options)

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
  const seen = new Seen()
  parseJavascript(sfc.jsAst as bt.File, seen, options)

  expect(mockOnSlot.mock.calls.length).toBe(1)
  const arg = mockOnSlot.mock.calls[0][0]

  expect((arg as SlotResult).name).toBe('default')
  expect((arg as SlotResult).describe).toMatchSnapshot()
  expect((arg as SlotResult).backerDesc).toMatchSnapshot()
})

test('Mixin in the object', () => {
  const sfc: AstResult = getAST('mixins.vue')
  const mockOnMixin = jest.fn(() => {})
  const options: ParserOptions = {
    onMixIn: mockOnMixin
  }
  const seen = new Seen()
  parseJavascript(sfc.jsAst as bt.File, seen, options)

  expect(mockOnMixin.mock.calls.length).toBe(3)
  const arg1 = mockOnMixin.mock.calls[0][0]
  const arg2 = mockOnMixin.mock.calls[1][0]
  const arg3 = mockOnMixin.mock.calls[2][0]

  expect((arg1 as MixInResult).mixIn).toBe('MixinA')
  expect((arg2 as MixInResult).mixIn).toBe('MixinB')
  expect((arg3 as MixInResult).mixIn).toBe('MixinC')
})

test('data in the object', () => {
  const sfc: AstResult = getAST('data.vue')
  const mockOnData = jest.fn(() => {})
  const options: ParserOptions = {
    onData: mockOnData
  }
  const seen = new Seen()
  parseJavascript(sfc.jsAst as bt.File, seen, options)

  expect(mockOnData.mock.calls.length).toBe(3)
  const arg1 = mockOnData.mock.calls[0][0]
  const arg2 = mockOnData.mock.calls[1][0]
  const arg3 = mockOnData.mock.calls[2][0]

  expect((arg1 as DataResult).name).toBe('value')
  expect((arg1 as DataResult).type).toBe('Number')
  expect(((arg1 as DataResult).describe as string[]).length).toBe(1)
  expect((arg1 as DataResult).default).toBe('5')
  expect((arg1 as DataResult).type).toMatchSnapshot()
  expect((arg1 as DataResult).describe).toMatchSnapshot()
  expect((arg1 as DataResult).default).toMatchSnapshot()

  expect((arg2 as DataResult).name).toBe('stringVariable')
  expect((arg2 as DataResult).type).toBe('String')
  expect(((arg2 as DataResult).describe as string[]).length).toBe(1)
  expect((arg2 as DataResult).default).toBe('A String')
  expect((arg2 as DataResult).type).toMatchSnapshot()
  expect((arg2 as DataResult).describe).toMatchSnapshot()
  expect((arg2 as DataResult).default).toMatchSnapshot()

  expect((arg3 as DataResult).name).toBe('arrayVariable')
  expect((arg3 as DataResult).type).toBe('Array')
  expect(((arg3 as DataResult).describe as string[]).length).toBe(1)
  expect((arg3 as DataResult).default).toBe('[An,Array]')
  expect((arg3 as DataResult).type).toMatchSnapshot()
  expect((arg3 as DataResult).describe).toMatchSnapshot()
  expect((arg3 as DataResult).default).toMatchSnapshot()
})

test('data in the object, arrow function with returnStatement.', () => {
  const sfc: AstResult = getAST('data2.vue')
  const mockOnData = jest.fn(() => {})
  const options: ParserOptions = {
    onData: mockOnData
  }
  const seen = new Seen()
  parseJavascript(sfc.jsAst as bt.File, seen, options)

  expect(mockOnData.mock.calls.length).toBe(3)
  const arg1 = mockOnData.mock.calls[0][0]
  const arg2 = mockOnData.mock.calls[1][0]
  const arg3 = mockOnData.mock.calls[2][0]

  expect((arg1 as DataResult).name).toBe('value')
  expect((arg1 as DataResult).type).toBe('Number')
  expect(((arg1 as DataResult).describe as string[]).length).toBe(1)
  expect((arg1 as DataResult).default).toBe('5')
  expect((arg1 as DataResult).type).toMatchSnapshot()
  expect((arg1 as DataResult).describe).toMatchSnapshot()
  expect((arg1 as DataResult).default).toMatchSnapshot()

  expect((arg2 as DataResult).name).toBe('stringVariable')
  expect((arg2 as DataResult).type).toBe('String')
  expect(((arg2 as DataResult).describe as string[]).length).toBe(1)
  expect((arg2 as DataResult).default).toBe('A String')
  expect((arg2 as DataResult).type).toMatchSnapshot()
  expect((arg2 as DataResult).describe).toMatchSnapshot()
  expect((arg2 as DataResult).default).toMatchSnapshot()

  expect((arg3 as DataResult).name).toBe('arrayVariable')
  expect((arg3 as DataResult).type).toBe('Array')
  expect(((arg3 as DataResult).describe as string[]).length).toBe(1)
  expect((arg3 as DataResult).default).toBe('[An,Array]')
  expect((arg3 as DataResult).type).toMatchSnapshot()
  expect((arg3 as DataResult).describe).toMatchSnapshot()
  expect((arg3 as DataResult).default).toMatchSnapshot()
})

test('computed in the object', () => {
  const sfc: AstResult = getAST('computed.vue')
  const mockOnComputed = jest.fn(() => {})
  const options: ParserOptions = {
    onComputed: mockOnComputed
  }
  const seen = new Seen()
  parseJavascript(sfc.jsAst as bt.File, seen, options)

  expect(mockOnComputed.mock.calls.length).toBe(2)
  const arg1 = mockOnComputed.mock.calls[0][0]
  const arg2 = mockOnComputed.mock.calls[1][0]

  expect((arg1 as ComputedResult).name).toBe('normalComputedValue')
  expect((arg1 as ComputedResult).type).toEqual(['String'])
  expect(((arg1 as ComputedResult).describe as string[]).length).toBe(1)
  expect((arg1 as ComputedResult).isFromStore).toBe(false)
  expect((arg1 as ComputedResult).type).toMatchSnapshot()
  expect((arg1 as ComputedResult).describe).toMatchSnapshot()
  expect((arg1 as ComputedResult).isFromStore).toMatchSnapshot()

  expect((arg2 as ComputedResult).name).toBe('storeValue')
  expect((arg2 as ComputedResult).type).toEqual(['Array'])
  expect(((arg2 as ComputedResult).describe as string[]).length).toBe(1)
  expect((arg2 as ComputedResult).isFromStore).toBe(true)
  expect((arg2 as ComputedResult).type).toMatchSnapshot()
  expect((arg2 as ComputedResult).describe).toMatchSnapshot()
  expect((arg2 as ComputedResult).isFromStore).toMatchSnapshot()
})

test('watch in the object', () => {
  const sfc: AstResult = getAST('watch.vue')
  const mockOnWatch = jest.fn(() => {})
  const options: ParserOptions = {
    onWatch: mockOnWatch
  }
  const seen = new Seen()
  parseJavascript(sfc.jsAst as bt.File, seen, options)

  expect(mockOnWatch.mock.calls.length).toBe(3)
  const arg1 = mockOnWatch.mock.calls[0][0]
  const arg2 = mockOnWatch.mock.calls[1][0]
  const arg3 = mockOnWatch.mock.calls[2][0]

  expect((arg1 as WatchResult).name).toBe('watchArrow')
  expect(((arg1 as WatchResult).describe as string[]).length).toBe(1)
  expect(((arg1 as WatchResult).argumentsDesc as string[]).length).toBe(1)
  expect((arg1 as WatchResult).describe).toMatchSnapshot()
  expect((arg1 as WatchResult).argumentsDesc).toMatchSnapshot()

  expect((arg2 as WatchResult).name).toBe('watchFunction')
  expect(((arg2 as WatchResult).describe as string[]).length).toBe(1)
  expect(((arg2 as WatchResult).argumentsDesc as string[]).length).toBe(1)
  expect((arg2 as WatchResult).describe).toMatchSnapshot()
  expect((arg2 as WatchResult).argumentsDesc).toMatchSnapshot()

  expect((arg3 as WatchResult).name).toBe('noArgument')
  expect(((arg3 as WatchResult).describe as string[]).length).toBe(1)
  expect((arg3 as WatchResult).argumentsDesc).toBe(undefined)
  expect((arg3 as WatchResult).describe).toMatchSnapshot()
  expect((arg3 as WatchResult).argumentsDesc).toMatchSnapshot()
})

test('Set jsx to false to use `<any>Var` in ts', () => {
  const mockOnMethod = jest.fn(() => {})
  const options: ParserOptions = {
    onMethod: mockOnMethod,
    babelParserPlugins: {
      jsx: false
    }
  }
  const sfc: AstResult = getAST('noTSX.vue', options.babelParserPlugins)
  const seen = new Seen()
  parseJavascript(sfc.jsAst as bt.File, seen, options)

  expect(mockOnMethod.mock.calls.length).toBe(1)
  const arg = mockOnMethod.mock.calls[0][0]
  expect((arg as MethodResult).name).toBe('foo')
})

test('The default value of Props', () => {
  const mockOnProp = jest.fn(() => {})
  const options: ParserOptions = {
    onProp: mockOnProp
  }
  const sfc: AstResult = getAST('propsDefault.vue')
  const seen = new Seen()
  parseJavascript(sfc.jsAst as bt.File, seen, options, sfc.jsSource)

  expect(mockOnProp.mock.calls.length).toBe(8)
  const arg1 = mockOnProp.mock.calls[0][0]
  const arg2 = mockOnProp.mock.calls[1][0]
  const arg3 = mockOnProp.mock.calls[2][0]
  const arg4 = mockOnProp.mock.calls[3][0]
  const arg5 = mockOnProp.mock.calls[4][0]
  const arg6 = mockOnProp.mock.calls[5][0]
  const arg7 = mockOnProp.mock.calls[6][0]
  const arg8 = mockOnProp.mock.calls[7][0]

  expect((arg1 as PropsResult).default).toMatchSnapshot()
  expect((arg2 as PropsResult).default).toMatchSnapshot()
  expect((arg3 as PropsResult).default).toMatchSnapshot()

  expect((arg1 as PropsResult).defaultDesc).toMatchSnapshot()
  expect((arg2 as PropsResult).defaultDesc).toMatchSnapshot()
  expect((arg3 as PropsResult).defaultDesc).toMatchSnapshot()

  expect((arg4 as PropsResult).default).toEqual('true')
  expect((arg4 as PropsResult).type).toEqual('Boolean')

  expect((arg5 as PropsResult).default).toEqual('string literal')
  expect((arg5 as PropsResult).type).toEqual('String')

  expect((arg6 as PropsResult).default).toEqual('2')
  expect((arg6 as PropsResult).type).toEqual('Number')

  expect((arg7 as PropsResult).default).toEqual('Date.now()')
  expect((arg7 as PropsResult).type).toEqual('Date')

  expect((arg8 as PropsResult).default).toEqual('/test/')
  expect((arg8 as PropsResult).type).toEqual('RegExp')
})

test('The seperated block should be handled correctly', () => {
  const sfc: AstResult = getAST('seperate/seperate.vue')
  const mockOnProp = jest.fn(() => {})
  const options: ParserOptions = {
    onProp: mockOnProp
  }
  const seen = new Seen()
  parseJavascript(sfc.jsAst as bt.File, seen, options)
  const arg = mockOnProp.mock.calls[0][0]

  expect(mockOnProp.mock.calls.length).toBe(1)
  expect(arg as PropsResult).toEqual({
    type: null,
    name: 'a'
  })
})

test('the Typescript const assertion should parsing correctly', () => {
  const sfc: AstResult = getAST('tsConstAssertion.vue')
  const mockOnProp = jest.fn(() => {})
  const options: ParserOptions = {
    onProp: mockOnProp
  }
  const seen = new Seen()
  parseJavascript(sfc.jsAst as bt.File, seen, options)
})
