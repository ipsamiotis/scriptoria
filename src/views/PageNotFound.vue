<template>
  <div>
    <strong>
      Something went wrong. <br>
      Please reload the page.
    </strong>
  </div>
</template>

<script>
import {reactive} from "vue"

export default {
  setup() {
    const state = reactive({
      errorMsg: "HOW DID THEY REACH THIS??"
    })
    // send something through the API?
    console.log(state.errorMsg, Date.now())

    return {
      state
    }
  }
}
</script>

<style lang="scss" scoped>

</style>