import eventRender from '../eventRender'
import { EventResult } from '../../parser'

test('Proper rendering of props', () => {
  const eventsRes: EventResult[] = [
    {
      name: 'click',
      describe: ['Fire when the button is clicked'],
      argumentsDesc: ['true when it appears, and false otherwise']
    }
  ]
  const str = eventRender(eventsRes)
  expect(str).toMatchSnapshot()
})
