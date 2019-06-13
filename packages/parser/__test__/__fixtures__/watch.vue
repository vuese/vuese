<template>
  <div></div>
</template>

<script>
export default {
  watch: {
   /**
     * @vuese
     * Stores paths in store
     * @arg val - the value
     */
    watchArrow : (val) => {
      this.val.doSomething()
    },
    /**
     * @vuese
     * Sets the current page to 1
     * @arg variable - does something
     */
    watchFunction: function(variable) {
      this.otherVariable = variable
    },
    /**
     * @vuese
     * Sets the current page to 1
     */
    noArgument: function() {
      this.isFunctionUseless = true;
    },
    undocumentedWatch() {
      return true
    }
  }
}
</script>
