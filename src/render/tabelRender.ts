export function renderTabelHeader(header: string[]): string {
  const headerString = renderTabelRow(header)
  const splitLine = renderSplitLine(headerString.length)
  return headerString + splitLine + '\n'
}

export function renderTabelRow(row: string[]): string {
  return row.map(n => `|${n}`).join('') + '|\n'
}

function renderSplitLine(num: number): string {
  let line = ''
  for (let i = 0; i < num; i++) {
    line += '='
  }
  return line
}
