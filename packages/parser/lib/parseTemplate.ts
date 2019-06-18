import { ParserOptions, SlotResult, AttrsMap } from '@vuese/parser'

export function parseTemplate(templateAst: any, options: ParserOptions) {
  const parent = templateAst.parent
  if (templateAst.type === 1) {
    if (templateAst.tag === 'slot') {
      const slot: SlotResult = {
        name: 'default',
        describe: '',
        backerDesc: '',
        bindings: {},
        scoped: false,
        target: 'template'
      }
      slot.bindings = extractAndFilterAttr(templateAst.attrsMap)
      if (slot.bindings.name) {
        slot.name = slot.bindings.name
        delete slot.bindings.name
      }

      // scoped slot
      if (Object.keys(slot.bindings).length) slot.scoped = true

      if (parent) {
        const list: [] = parent.children
        let currentSlotIndex = 0
        for (let i = 0; i < list.length; i++) {
          let el = list[i]
          if (el === templateAst) {
            currentSlotIndex = i
            break
          }
        }

        // Find the first leading comment node as a description of the slot
        const copies = list.slice(0, currentSlotIndex).reverse()
        for (let i = 0; i < copies.length; i++) {
          let el: any = copies[i]
          if (el.type !== 3 || (!el.isComment && el.text.trim())) break
          if (
            el.isComment &&
            !(parent.tag === 'slot' && parent.children[0] === el)
          ) {
            slot.describe = el.text.trim()
            break
          }
        }

        // Find the first child comment node as a description of the default slot content
        if (templateAst.children.length) {
          for (let i = 0; i < templateAst.children.length; i++) {
            let el: any = templateAst.children[i]
            if (el.type !== 3 || (!el.isComment && el.text.trim())) break
            if (el.isComment) {
              slot.backerDesc = el.text.trim()
              break
            }
          }
        }
      }
      if (options.onSlot) options.onSlot(slot)
    }

    const parseChildren = (templateAst: any) => {
      for (let i = 0; i < templateAst.children.length; i++) {
        parseTemplate(templateAst.children[i], options)
      }
    }
    if (templateAst.if && templateAst.ifConditions) {
      // for if statement iterate through the branches
      templateAst.ifConditions.forEach((c: any) => {
        parseChildren(c.block)
      })
    } else {
      parseChildren(templateAst)
    }
  }
}

const dirRE = /^(v-|:|@)/
const allowRE = /^(v-bind|:)/
function extractAndFilterAttr(attrsMap: AttrsMap): AttrsMap {
  const res: AttrsMap = {}
  const keys = Object.keys(attrsMap)
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    if (!dirRE.test(key) || allowRE.test(key)) {
      res[key.replace(allowRE, '')] = attrsMap[key]
    }
  }
  return res
}
