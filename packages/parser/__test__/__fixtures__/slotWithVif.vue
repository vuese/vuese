<template>
  <div>
    <a v-if="shouldDefaultSlot">noDefaultSlot</a>
    <div v-else>
      <!-- default slot -->
      <slot>
        <!-- Default Slot Content -->
        <p></p>
      </slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    shouldDefaultSlot: Boolean
  }
}
</script>

<style>
</style>
