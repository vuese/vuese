<template>
  <div></div>
</template>

<script>
const noop = () => {}
export default {
  props: {
    a: {
      type: Function,
      // An empty function
      default: noop
    },
    b: {
      type: Number,
      default: 1,
      // Must be a number greater than 0
      validator (value) {
        return value > 0
      }
    },
    c: {
      // 'TOP' | 'LEFT'
      type: String
    }
  }
}
</script>
