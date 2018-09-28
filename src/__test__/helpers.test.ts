import traverse from '@babel/traverse'
import { getAST } from './utils'
import { isVueComponent, isPropsOption } from '../helpers'

describe('helpers', () => {
  const ast1 = getAST('validProps.vue')
  const ast2 = getAST('invalidProps.vue')

  test('The default export should be a Vue component', () => {
    traverse(ast1, {
      ExportDefaultDeclaration(path: any) {
        expect(isVueComponent(path.node)).toBe(true)
      }
    })
  })

  test('The props property is a Vue component option', () => {
    traverse(ast1, {
      ObjectProperty(path: any) {
        if (path.node.key.name === 'props') {
          expect(isPropsOption(path)).toBe(true)
        }
      }
    })
  })

  test('The props property is not a Vue component option', () => {
    traverse(ast2, {
      ObjectProperty(path: any) {
        if (path.node.key.name === 'props') {
          expect(isPropsOption(path)).toBe(false)
        }
      }
    })
  })
})
