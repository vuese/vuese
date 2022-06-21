<template>
  <div></div>
</template>

<script>

const rootProps = {
  root: {
    type: Boolean,
    default: true,
  }
}

const commonProps = {
  type: {
    type: String,
    required: true,
  },
  ...rootProps,
}

const baseProps = {
  base: String,
  ...commonProps,
}

const anotherProps = {
  c: String,
  ...baseProps,
}

const otherProps = {
  b: Number,
  ...anotherProps,
}

export default {
  props: {
    a: {
      type: String,
    },
    ...otherProps,
  }
}
</script>
