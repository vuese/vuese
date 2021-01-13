<template>
  <div></div>
</template>

<script>
import { defineComponent as define } from '@vue/composition-api'

export default define({
  name: 'MyComponent',
  props: {
    name: {
      type: [String, Number],
      required: true,
      validator() {}
    }
  }
})
</script>

<style></style>
