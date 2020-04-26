<template>
  <div></div>
</template>

<script>
function callExpression() {
  // This is a description of the component
  /* eslint-disable camelcase */
  return {
    name: 'compName',
    data() {
      return {
        // @vuese
        a: 1
      }
    },
    props: {
      a: String
    }
  }
}
export default callExpression()
</script>

<style></style>
