export default Vue.extend({
  mixins: [MixinA, MixinB, MixinC],
  data () {
    return {
      // @vuese
      a: 1
    }
  },
  props: {
    // The name of the form, up to 8 characters
    name: {
      type: [String, Number],
      required: true,
      validator () { }
    }
  },
  methods: {
    // @vuese
    // Used to manually clear the form
    clear () {
      // Fire when the form is cleared
      // @arg The argument is a boolean value representing xxx
      this.$emit('onclear', true)
    }
  }
})