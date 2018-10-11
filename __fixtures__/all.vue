<template>
  <div>
    <!-- 表单头部 -->
    <slot name="header">
      <!-- `<th>title</th>` -->
      <th>title</th>
    </slot>
  </div>
</template>

<script>
export default {
  props: {
    // 表单的名称，最多8个字符
    name: {
      type: [String, Number],
      required: true,
      validator () {}
    }
  },
  methods: {
    // @vuese
    // 用来手动清空表单
    clear () {
      // 清空表单时触发
      // @arg 参数是一个布尔值，代表xxx
      this.$emit('onclear', true)
    }
  }
}
</script>

<style>

</style>
