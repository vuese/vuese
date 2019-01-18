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
    }
  }
}
</script>

<style>

</style>
