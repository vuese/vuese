import parser, { ParserResult } from './parser'
import Render, { RenderResult } from './render'

export default function(source: string): string {
  const pr: ParserResult = parser(source)
  const r = new Render(pr)
  const renderRes: RenderResult = r.render()
  let mdString = ''
  if (renderRes.props) {
    mdString += renderRes.props + '\n'
  }
  if (renderRes.events) {
    mdString += renderRes.events + '\n'
  }
  if (renderRes.slots) {
    mdString += renderRes.slots + '\n'
  }
  if (renderRes.methods) {
    mdString += renderRes.methods + '\n'
  }

  return mdString
}
