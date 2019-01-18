<template>
  <div></div>
</template>

<script>
export default {
  render() {
    // The scoped slot named title
    // @content Default content of title
    this.$scopedSlots.title()

    _c(
      'div',
      // The scoped slot named tip
      // @content Default content of tip
      this.$scopedSlots.tip()
    )
  }
}
</script>

