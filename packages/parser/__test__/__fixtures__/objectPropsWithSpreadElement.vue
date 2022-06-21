<template>
  <div></div>
</template>

<script>

const anotherProps = {
  c: String,
}

const otherProps = {
  b: Number,
  ...anotherProps,
}

export default {
  props: {
    a: String,
    ...otherProps,
  }
}
</script>
