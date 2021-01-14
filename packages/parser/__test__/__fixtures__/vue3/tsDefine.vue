<template>
  <div></div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api'
import { Type, Align } from 'antd/types/table-column'
import { CreateElement, VNode } from 'vue'

export interface AtuoTableColumn {
  slot?: string
  type?: Type
  label?: string
  className?: string
  labelClass?: string
  prop?: string
  width?: string
  minWidth?: string
  renderHeader?: (h: CreateElement, data: any) => VNode | string
  sortable?: string | boolean
  sortMethod?: (row1: any, row2: any) => number
  align?: Align
  headerAlign?: Align
  fixed?: string | boolean
  showOverflowTooltip?: string | boolean
  formatter?: (row: object, column: any) => any
}

interface AutoTableProps {
  columns: AtuoTableColumn[]
}

export default defineComponent<AutoTableProps>({
  name: 'auto-table',
  props: {
    columns: {
      type: Array,
      default: () => [],
    },
  },
  setup(props, context) {
    console.log(props)
    return {
      name: 'hello',
      age: 12
    }
  },
})
</script>

<style></style>
