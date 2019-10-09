<template>
  <div></div>
</template>

<script>
export default {
  props: {
    a: String,
    b: [Number, String],
    c: {
      type: Object,
      default: function () {
        return {
          val: 1
        }
      },
      required: true,
      validator: function () {
        return true
      }
    },
    d: 'null',
    e: {
      type: Function,
      default () {}
    },
    'g': {
      type: String,
      default: 'HELLO'
    }
  }
}
</script>
