import Render, { RenderResult, MarkdownResult } from '@vuese/markdown-render'
import { ParserResult } from '@vuese/parser'

test('Proper rendering of the table header', () => {
  const res: ParserResult = {
    name: 'MyComponent',
    componentDesc: {
      default: ['This is a description of the component']
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
        bindings: {}
      }
    ],
    methods: [
      {
        name: 'clear',
        describe: ['Clear form'],
        argumentsDesc: ['a boolean value']
      }
    ]
  }
  const render = new Render(res)
  const renderRes: RenderResult = render.render()
  const markdownRes = render.renderMarkdown() as MarkdownResult
  expect(renderRes).toMatchSnapshot()
  expect(markdownRes).toMatchSnapshot()
})
