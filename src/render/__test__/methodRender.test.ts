import methodRender from '../methodRender'
import { MethodResult } from '../../parser'

test('Proper rendering of props', () => {
  const methodsRes: MethodResult[] = [
    {
      name: 'clear',
      describe: ['clear user selection']
    }
  ]
  const str = methodRender(methodsRes)
  expect(str).toMatchSnapshot()
})
