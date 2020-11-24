<template>
  <ClefDetection/>
</template>

<script>
import ClefDetection from './components/ClefDetection.vue'

export default {
  name: 'App',
  components: {
    ClefDetection
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
}
</style>
