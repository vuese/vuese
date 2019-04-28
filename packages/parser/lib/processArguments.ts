import { ArgumentDelaration } from './index'

export function processArguments(
  args: String[]
): ArgumentDelaration[] | undefined {
  if (!args || args.length === 0) {
    return undefined
  }
  return (
    args.map(argDec => {
      const metaSplitter = ' - '
      const argMetaIndex = argDec.indexOf(metaSplitter)
      const structedArg = new ArgumentDelaration()

      if (argMetaIndex <= 0) {
        structedArg.description = argDec
        return structedArg
      }

      let argMetaString = argDec.substr(0, argMetaIndex)
      structedArg.description = argDec.substr(
        argMetaIndex + metaSplitter.length
      )

      const typeRe = /{[a-z0-9]+}/gi
      const typeName = (argMetaString.match(typeRe) || [])[0]
      structedArg.name = typeName ? typeName.replace(/[{}]/gi, '') : undefined
      argMetaString = argMetaString.replace(typeRe, '')

      const defaultRe = /\[[a-z0-9\-\.\_]+\]/gi
      const defaultValue = (argMetaString.match(defaultRe) || [])[0]
      structedArg.default = defaultValue
        ? defaultValue.replace(/[\[\]]/gi, '')
        : undefined
      argMetaString = argMetaString.replace(defaultRe, '')

      structedArg.name = argMetaString.trim()
      return structedArg
    }) || []
  )
}
