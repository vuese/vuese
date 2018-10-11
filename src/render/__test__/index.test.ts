import Render, { RenderResult } from '../index'
import { ParserResult } from '../../parser'

test('Proper rendering of the table header', () => {
  const res: ParserResult = {
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
  expect(renderRes).toMatchSnapshot()
})
