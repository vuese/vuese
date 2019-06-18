<template>
  <div>
    <!-- head slot -->
    <slot name="header">
      <!-- Default Slot Content -->
      <p></p>
    </slot>
  </div>
</template>

<script>
export default {
  computed: {
    hasBack() {
      return this.$slots.header != null
    }
  }
}
</script>

<style>

</style>
