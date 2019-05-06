import Render from '@vuese/markdown-render'
import { ParserResult } from '@vuese/parser'
import EventsRender from '../lib/events-render'
import PropsRender from '../lib/props-render'
import ComputedRender from '../lib/computed-render'
import SlotsRender from '../lib/slots-render'
import MethodsRender from '../lib/methods-render'
import MixinsRender from '../lib/mixins-render'

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
        scoped: false
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
  const render = new Render(res, {
    plugins: [
      new PropsRender(),
      new MethodsRender(),
      new EventsRender(),
      new ComputedRender(),
      new SlotsRender(),
      new MixinsRender()
    ]
  })
  const renderRes = render.render()
  expect(renderRes).toMatchSnapshot()
})

describe('Empty Components (without slots,methods,props,events) can be forced to be rendered', () => {
  test('Does not render an empty component by defaut', () => {
    const res: ParserResult = {
      name: 'MyComponent',
      componentDesc: {
        default: ['This is a description of the component']
      }
    }
    const render = new Render(res, {
      plugins: [
        new PropsRender(),
        new MethodsRender(),
        new EventsRender(),
        new ComputedRender(),
        new SlotsRender(),
        new MixinsRender()
      ]
    })
    const renderRes = render.render()
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
    const render = new Render(res, {
      plugins: [
        new PropsRender(),
        new MethodsRender(),
        new EventsRender(),
        new ComputedRender(),
        new SlotsRender(),
        new MixinsRender()
      ]
    })
    const renderRes = render.render()
    expect(renderRes).toMatchSnapshot()
  })
})
