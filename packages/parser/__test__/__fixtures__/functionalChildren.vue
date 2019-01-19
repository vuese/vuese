<template>
  <div></div>
</template>

<script>
export default {
  render: (h, ctx) => {
    return h(
      'div',
      {},
      // This is the default slot
      // @content Default content
      ctx.children
    )
  }
}
</script>

