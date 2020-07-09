<template></template>
<script lang="ts">
import { Vue, Component, Watch, Prop } from 'nuxt-property-decorator'

const sortFunctionMap = [
  sortFunctionGen(
    (a: any, b: any, order: number) =>
      a.name.localeCompare(b.name, 'zh') * order,
    unSortedList,
    'asc'
  ),
  (a: any, b: any) => a.size - b.size,
  (a: any, b: any) => a.time - b.time
] as const

</script>