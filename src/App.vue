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
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  display: flex;
  justify-content: center;
}

.task-header {
  margin: 16px;
}
.task-header > * {
  display: inline-block;
}
</style>
