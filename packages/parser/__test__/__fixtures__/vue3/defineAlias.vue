<template>
  <div></div>
</template>

<script>
import { defineComponent as define } from '@vue/composition-api'

export default define(
  // This is a description of the component
  {
  name: 'MyComponent',
  props: {
    // The name of the form, up to 8 characters
    name: {
      type: [String, Number],
      required: true,
      validator() {}
    }
  },
  methods: {
    // @vuese
    // Used to manually clear the form
    clear() {
      // Fire when the form is cleared
      // @arg The argument is a boolean value representing xxx
      this.$emit('onclear', true)
    }
  }
})
</script>

<style></style>
