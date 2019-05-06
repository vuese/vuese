export function renderTitle(n: number, title: string) {
  return `${''.padStart(n, '#')} ${title}\n`
}

export function renderTabelHeader(header: string[]) {
  const headerString = renderTabelRow(header)
  const splitLine = renderSplitLine(header.length)
  return headerString + splitLine + '\n'
}
export function renderTabelRow(row: string[]) {
  return row.map(n => `|${n}`).join('') + '|\n'
}

export function renderSplitLine(num: number) {
  let line = ''
  for (let i = 0; i < num; i++) {
    line += '|---'
  }
  return line + '|'
}
