<template>
  <div></div>
</template>

<script>
import { defineComponent } from '@vue/composition-api'

export default defineComponent(
  // Here is a description of the component
  {
    name: 'MyComponent',
    props: {
      // The name of the form, up to 8 characters
      name: {
        type: [String, Number],
        required: true,
        validator() {}
      }
    }
  }
)
</script>

<style></style>
