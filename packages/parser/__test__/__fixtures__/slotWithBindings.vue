<template>
  <div>
    <!-- Named slot -->
    <slot name="header" :a="someData" b="str">
      <!-- Default Slot Content -->
      <p></p>
    </slot>
  </div>
</template>

<script>
export default {

}
</script>

<style>

</style>
