import { renderTabelHeader } from '../tabelRender'

test('Proper rendering of the table header', () => {
  const header = ['Name', 'Description', 'Type', 'Required', 'Default']
  const str = renderTabelHeader(header)
  expect(str).toMatchSnapshot()
})
