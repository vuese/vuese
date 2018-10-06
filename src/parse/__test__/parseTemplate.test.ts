import * as path from 'path'
import * as fs from 'fs'
import sfcToAST, { AstResult } from '../sfcToAST'
import parseTemplate, { SlotResult } from '../parseTemplate'

function getAST(fileName: string): object {
  const p = path.resolve(__dirname, `../../../__fixtures__/${fileName}`)
  const source = fs.readFileSync(p, 'utf-8')
  return sfcToAST(source)
}

test('Default slot with slot description', () => {
  const sfc: AstResult = getAST('defaultSlot.vue')
  const slotRes: SlotResult[] = parseTemplate(sfc.templateAst)
  expect(slotRes.length).toBe(1)
  expect(slotRes[0].name).toBe('default')
  expect(slotRes[0].describe).toBe('default slot')
  expect(slotRes[0].backerDesc).toBe('Default Slot Content')
  expect(slotRes[0].bindings).toEqual({})
})

test('Named slot with slot description', () => {
  const sfc: AstResult = getAST('namedSlot.vue')
  const slotRes: SlotResult[] = parseTemplate(sfc.templateAst)
  expect(slotRes.length).toBe(1)
  expect(slotRes[0].name).toBe('header')
  expect(slotRes[0].describe).toBe('head slot')
  expect(slotRes[0].backerDesc).toBe('Default Slot Content')
  expect(slotRes[0].bindings).toEqual({})
})

test('Named slot with slot description and bingdings', () => {
  const sfc: AstResult = getAST('slotWithBindings.vue')
  const slotRes: SlotResult[] = parseTemplate(sfc.templateAst)
  expect(slotRes.length).toBe(1)
  expect(slotRes[0].name).toBe('header')
  expect(slotRes[0].describe).toBe('Named slot')
  expect(slotRes[0].backerDesc).toBe('Default Slot Content')
  expect(slotRes[0].bindings).toEqual({
    a: 'someData',
    b: 'str'
  })
})
