<template>
  <div></div>
</template>

<script>
export default {
  methods: {
    fn () {
      // Triggered when clicked
      /**
       * @arg The first parameter is a Boolean value that represents...
       */
      this.$emit('click', someVal)
      this.$emit('click', someVal)
    }
  }
}
</script>
