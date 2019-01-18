<template>
  <div></div>
</template>

<script>
export default {
  methods: {
    m() {
      // This is the description of the slot
      // @content Description of the slot default content
      this.$slots.header

      // This will not be collected repeatedly
      this.$slots.header

      // This is the default slot for functional components
      // @content Description of the slot default content (functional)
      ctx.$slots().default

      _c(
        'div',
        // The slot named footer
        // @content Default content of footer
        ctx.$slots().footer
      )

      _c(
        'div',
        // The slot named sidebar
        // @content Default content of sidebar
        this.$slots.sidebar
      )
    }
  }
}
</script>

<style>

</style>
