<template>
  <div></div>
</template>

<script lang="ts">
@Component
export default class Child extends Vue {
  render(h, ctx) {
    return h(
      'div',
      {},
      // Default slot in the decorator
      // @content Default content in the decorator
      ctx.children
    )
  }
}
</script>
