import generate from '@babel/generator'
import * as bt from '@babel/types'
import { PropsResult } from './index'
import * as fs from 'fs'

/**
 * If a node satisfies the following conditions, then we will use this node as a Vue component.
 * 1. It is a default export
 * 2. others...
 */
export function isVueComponent(node: object): boolean {
  return bt.isExportDefaultDeclaration(node)
}

export function runFunction(fnCode: string): any {
  const { code: genCode } = generate(fnCode)
  const code = `return (${genCode})()`
  const fn = new Function(code)
  try {
    return fn()
  } catch (e) {
    console.error(e)
  }
}

export function getValueFromGenerate(node: any) {
  let code: string = 'return'
  const { code: genCode } = generate(node)
  code += genCode
  const fn = new Function(code)
  try {
    return fn()
  } catch (e) {
    console.error(e)
  }
}

export function isPropsOption(path: any): boolean {
  if (
    bt.isObjectProperty(path.node) &&
    path.parentPath &&
    path.parentPath.parentPath &&
    isVueComponent(path.parentPath.parentPath.node)
  ) {
    const keyPath = path.get('key')
    return keyPath.node.name === 'props'
  }
  return false
}

export function normalizeProps(props: string[]): PropsResult[] {
  return props.map(prop => ({
    type: null,
    name: prop
  }))
}

const josnCache: [] = []
export function writeFileSync(str: any, keep?: boolean) {
  const filePath = __dirname + '/a.txt'
  const preContent = fs.readFileSync(filePath)
  const content = JSON.stringify(
    str,
    function(key, value: string | number) {
      if (typeof value === 'object' && value !== null) {
        if (josnCache.indexOf(value) !== -1) {
          // Duplicate reference found
          try {
            // If this value does not reference a parent it can be deduped
            return JSON.parse(JSON.stringify(value))
          } catch (error) {
            // discard key if value cannot be deduped
            return
          }
        }
        // Store value in our collection
        josnCache.push(value)
        key
      }
      return value
    },
    2
  )
  fs.writeFileSync(__dirname + '/a.txt', keep ? preContent + content : content)
}
