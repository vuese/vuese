<template>
  <div></div>
</template>

<script lang="ts">
@Component
export default class Child extends Vue {
  // Description of prop
  @Prop(Number)
  a: number = 1

  @Prop([Number, String])
  b: number | string

  @Prop({
    type: Number,
    // The default value is 1
    default: 1,
    required: true
  })
  c: number

  @Prop() d: string
  @Prop e: number
  @Prop
  /**
   * Passed comment from the parent component.
   */
  
  comment!: CommentType
  @Action g: string // Non prop
}
</script>
