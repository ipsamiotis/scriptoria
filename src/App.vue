// NEED TO RETRIEVE NEW SLICE FROM BUTTON COMPONENT

<template>
    <!-- <div v-if="state.typeOfTask == 'clef_detection'">
        <ClefDetection/>
    </div>
    <div v-else-if="state.typeOfTask == 'clef_recognition'"> -->
        <ClefRecognition/>
    <!-- </div> -->
    <!-- <div v-else-if="state.typeOfTask == 'clef_recognition'"> -->
        <!-- <VerifySlices/> -->
    <!-- </div> -->
</template>

<script>
// import ClefDetection from './components/ClefDetection.vue'
import ClefRecognition from '@/components/ClefRecognition.vue'
// import VerifySlices from '@/components/VerifySlices.vue'

import {tasks} from "@/assets/slices"

import {reactive, onMounted} from 'vue'

export default {
    name: 'App',
    components: {
        // ClefDetection,
        ClefRecognition
        // VerifySlices
    },
    setup(){
        const state = reactive({
            typeOfTask: {}
        })

        function receiveTasks(){
            for (let task in tasks) {
                state.typeOfTask = task
            }
        }

        onMounted(() => {
            receiveTasks()
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
}
</style>
