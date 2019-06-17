<template>
  <div></div>
</template>

<script>
export default {
  computed: {
    /**
     * @vuese
     * Returns filtered paths
     * @type String
     */
    normalComputedValue() {
      return "this might be a string".split('').reverse('').join('')
    },
    /**
     * @vuese
     * Returns filtered paths
     * @type Array
     */
    storeValue() {
      return this.$store.state.pathsFiltered;
    },
    undocumentedComputed() {
      return true
    }
  }
}
</script>
