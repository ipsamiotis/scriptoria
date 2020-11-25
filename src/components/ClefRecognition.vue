<template>
    <div class="task">
        <div class="task-header">
            <h3>Clef Recognition</h3>
            <p>The given measure contains a clef, please select the type. Multiple answers possible</p>
        </div>
        <div class="task-items">
            <SliceViewer :task-type="state.randomPick.taskType" :slice-file="state.randomPick.filename"/>
        </div>
        <div class="task-input">
            <ClefBtnInput :task-type="state.randomPick.taskType" @need-slice="getSlice"/>
        </div>
    </div>
</template>

<script>
import {reactive, onMounted} from "vue"

import SliceViewer from "@/components/SliceViewer"
import ClefBtnInput from "@/components/ClefBtnInput"

import {tasks} from "@/assets/scannedMeasures"

export default {
    name: "ClefRecognition",
    components: {
        SliceViewer,
        ClefBtnInput
    },

    setup () {
        const state = reactive({
            randomPick: {}
        })

        function getSlice(...args){
            const [needSlice, label] = args
            console.log(needSlice, label)
            if (needSlice) {
                state.randomPick = tasks[Math.floor(Math.random() * tasks.length)]
            }
        }

        onMounted(() => {
            getSlice(true)
        })

        return {
            state,
            getSlice
        }
    }
}
</script>

<style lang="scss" scoped>

</style>