<template>
  <div @click="trueValue && $emit('close'); that.$emit('some'); $emit('click')" ></div>
</template>

<script>
export default {
  methods: {
    fn () {

      const a = { b: 1 }
      // Triggered when clicked
      /**
       * @arg The first parameter is a Boolean value that represents...
       */
      this.$emit('click', someVal)
      
      this.$emit('update:some-prop', 1)
    },
    trick() {
      let someVal = true
      // event desc
      someVar && this.$emit('some-event')
    }
  }
}
</script>
