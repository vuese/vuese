import propRender from '../propRender'
import { PropsResult } from '../../parser'

test('Proper rendering of props', () => {
  const propsRes: PropsResult[] = [
    {
      name: 'propName',
      type: 'String',
      typeDesc: ['`TOP` | `BOTTOM`'],
      required: true,
      defaultDesc: ['`TOP`'],
      validatorDesc: [''],
      describe: ['Direction of the arrow']
    }
  ]
  const str = propRender(propsRes)
  expect(str).toMatchSnapshot()
})
