import traverse from '@babel/traverse'
import { getValueFromGenerate, isPropsOption } from './helpers'

const mainTraveres = {
  ObjectProperty(path: any) {
    if (isPropsOption(path)) {
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

export default function(ast: any, options: ParserOptions = {}) {
  traverse(ast, {
    ExportDefaultDeclaration(path: any) {
      path.traverse(mainTraveres, {
        options
      })
    }
  })
}
