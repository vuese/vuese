export class Seen {
  seenSet = new Set()

  seen(label: string): boolean {
    const yes = this.seenSet.has(label)
    if (!yes) this.seenSet.add(label)
    return yes
  }
}
