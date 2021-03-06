<template>
  <router-view></router-view>
</template>

<script>

import {reactive} from 'vue'

export default {
  name: 'App',
  setup() {
    const state = reactive({
      typeOfTask: {}
    })

    return {
      state
    }
  }
}
</script>

<style>

</style>
