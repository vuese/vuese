<template>
  <div></div>
</template>

<script lang="ts">
@Component
export default class Child extends Vue {
  
  // Fire when the form is cleared
  // @arg The argument is a boolean value representing xxx
  @Emit()
  onClick() {}

  @Emit('reset')
  resetHandle() {}

  @Emit('update:some-prop')
  updateProp() {}
}
</script>
