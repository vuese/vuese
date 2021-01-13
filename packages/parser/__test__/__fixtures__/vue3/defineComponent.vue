<template>
  <div></div>
</template>

<script>
import { defineComponent } from '@vue/composition-api'


export default defineComponent(
  // here is a commet
  {
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
