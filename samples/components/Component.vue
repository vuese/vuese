<template>
  <div>
    <!-- Form header -->
    <slot name="header">
      <!-- `<th>title</th>` -->
      <th>title</th>
    </slot>
  </div>
</template>

<script>
/* eslint-disable camelcase */
export default {
    name: 'CustomComponent',
    methods: {
      test() {
        // event desc
        someVar && this.$emit('some-event')
      }
    }
}
</script>