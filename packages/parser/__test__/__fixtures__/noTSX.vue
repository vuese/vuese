<template>
  <div></div>
</template>

<script lang="ts">
@Component
// This is a description of the component
export default class Child extends Vue {
  // @vuese
  public get foo(): number {
    return (<any>this).$refs.navBar.offsetHeight
  }
}
</script>
