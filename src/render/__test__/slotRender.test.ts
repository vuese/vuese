import slotRender from '../slotRender'
import { SlotResult } from '../../parser'

test('Proper rendering of props', () => {
  const slotsRes: SlotResult[] = [
    {
      name: 'header',
      describe: 'Custom table header',
      backerDesc: '`<th>{{title}}</th>`',
      bindings: {}
    }
  ]
  const str = slotRender(slotsRes)
  expect(str).toMatchSnapshot()
})
