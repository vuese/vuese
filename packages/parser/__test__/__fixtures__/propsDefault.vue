<template>
  <div></div>
</template>

<script>
export default {
  props: {
    a: {
      type: Object,
      // `{ val: 1 }`
      default: function () {
        return {
          val: 1
        }
      }
    },
    b: {
      type: Object,
      // `{ val: 1, a: 2 }`
      default: () => ({ val: 1, a: 2 })
    },
    c: {
      type: Object,
      // `{ val: 1}`
      default(){
        return { val: 1 }
      }
    },
    d: {
      type: Boolean,
      default: true
    },
    e: {
      type: String,
      default: 'string literal'
    },
    f: {
      type: Number,
      default: 2
    },
    g: {
      type: Date,
      default: Date.now()
    },
    h: {
      type: RegExp,
      default: /test/
    },
  }
}
</script>
