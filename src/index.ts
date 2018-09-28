import traverse from '@babel/traverse'
import { getValueFromGenerate } from './helpers/index'

const mainTraveres = {
  ObjectProperty(path: any) {
    const keyPath = path.get('key')
    if (keyPath.node.name === 'props') {
      const valuePath = path.get('value')
      const propsValue = getValueFromGenerate(valuePath.node)
      const { onProp } = (this as any).options
      if (onProp) onProp(propsValue)
    }
  }
}

export interface ParserOptions {
  onProp?: {
    (originalPropValue?: object): any
  }
}

export default function(ast: object, options: ParserOptions = {}) {
  traverse(ast, {
    ExportDefaultDeclaration(path: any) {
      path.traverse(mainTraveres, {
        options
      })
    }
  })
}
