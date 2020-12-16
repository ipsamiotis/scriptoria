<template>
    <!-- <router-link to="/">Home</router-link> | -->
    <!-- <router-link to="/about">About</router-link> -->
    <!-- <div v-if="state.typeOfTask == 'clef_detection'"> -->
        <!-- <ClefDetection/> -->
    <!-- </div> -->
    <!-- <div v-else-if="state.typeOfTask == 'clef_recognition'"> -->
        <!-- <ClefRecognition/> -->
    <!-- </div> -->
    <!-- <div v-else-if="state.typeOfTask == 'time_recognition'"> -->
        <!-- <TimeRecognition/> -->
    <!-- </div> -->
    <router-view></router-view>
</template>

<script>
// import ClefDetection from './components/ClefDetection.vue'
// import ClefRecognition from '@/components/ClefRecognition.vue'
// import TimeRecognition from '@/components/TimeRecognition.vue'

// import {tasks} from "@/assets/slices"

import {reactive} from 'vue'

export default {
    name: 'App',
    components: {
        // ClefDetection,
        // ClefRecognition,
        // TimeRecognition
    },
    setup(){
        const state = reactive({
            typeOfTask: {}
        })

        // function receiveTasks(){
        //     for (let task in tasks) {
        //         state.typeOfTask = tasks[task]
        //         // console.log(tasks[task])
        //     }
        // }

        // onMounted(() => {
        //     receiveTasks()
        // })

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
}
</style>
