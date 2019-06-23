import Render, { RenderResult, MarkdownResult } from '@vuese/markdown-render'
import { ParserResult } from '@vuese/parser'

test('Proper rendering of the table header', () => {
  const res: ParserResult = {
    name: 'MyComponent',
    componentDesc: {
      default: ['This is a description of the component'],
      group: ['My Group']
    },
    props: [
      {
        name: 'someProp',
        type: ['String'],
        typeDesc: ['`TOP` / `BOTTOM`'],
        required: true,
        defaultDesc: ['`TOP`'],
        describe: ['Represents the direction of the arrow']
      }
    ],
    events: [
      {
        name: 'click',
        isSync: false,
        syncProp: '',
        describe: ['Triggered when clicked'],
        argumentsDesc: ['a boolean value']
      }
    ],
    slots: [
      {
        name: 'header',
        describe: 'Table header',
        backerDesc: '`<th>{{title}}</th>`',
        bindings: {},
        scoped: false,
        target: 'template'
      },
      {
        name: 'header',
        describe: 'Table header',
        backerDesc: '`<th>{{title}}</th>`',
        bindings: {},
        scoped: false,
        target: 'script'
      }
    ],
    methods: [
      {
        name: 'clear',
        describe: ['Clear form'],
        argumentsDesc: ['a boolean value']
      }
    ],
    mixIns: [
      {
        mixIn: 'MixIn'
      }
    ],
    data: [
      {
        name: 'someVariable',
        type: 'String',
        describe: ['Does something'],
        default: ''
      }
    ],
    watch: [
      {
        name: 'question',
        describe: ['Something about a question'],
        argumentsDesc: ['a string value']
      }
    ]
  }
  const render = new Render(res)
  const renderRes: RenderResult = render.render()
  const markdownRes = render.renderMarkdown() as MarkdownResult
  expect(renderRes).toMatchSnapshot()
  expect(markdownRes).toMatchSnapshot()
})

describe('Empty Components (without slots,methods,props,events) can be forced to be rendered', () => {
  test('Does not render an empty component by defaut', () => {
    const res: ParserResult = {
      name: 'MyComponent',
      componentDesc: {
        default: ['This is a description of the component']
      }
    }
    const render = new Render(res)
    const renderRes: RenderResult = render.render()
    const markdownRes = render.renderMarkdown() as MarkdownResult
    expect(markdownRes).toBeNull()
    expect(renderRes).toEqual({})
  })
  test('Does render an empty component by with @vuese in the description', () => {
    const res: ParserResult = {
      name: 'MyComponent',
      componentDesc: {
        default: [
          'This is a description of the component.',
          'Supplementary description'
        ],
        vuese: ['']
      }
    }
    const render = new Render(res)
    const renderRes: RenderResult = render.render()
    const markdownRes = render.renderMarkdown() as MarkdownResult
    expect(markdownRes).not.toBeNull()
    expect(markdownRes).toMatchSnapshot()
    expect(renderRes).toMatchSnapshot()
  })
})
