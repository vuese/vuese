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

      // This is the default slot for functional components
      // @content Description of the slot default content (functional)
      ctx.$slots().default
    }
  }
}
</script>

<style>

</style>
