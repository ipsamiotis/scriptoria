<template>
    <div class="task">
        <div class="task-header">
            <h3>Segment Verification</h3>
            <p>Compare the two. Is the version on the right is correct or problematic?</p>
        </div>
        <div class="task-items">
            <SliceViewer :task-type="state.randomPick.taskType" :slice-file="state.randomPick.filename"/>
            <VerovioViewer :task-type="state.randomPick.taskType" :slice-file="state.randomPick.filename"/>
        </div>
        <div class="task-input">
            <BooleanBtnInput :task-type="state.randomPick.taskType" @need-slice="getSlice"/>
        </div>
    </div>
</template>

<script>
import {reactive, onMounted} from 'vue'

import {tasks} from "@/assets/slices"

import SliceViewer from "@/components/SliceViewer"
import VerovioViewer from "@/components/VerovioViewer"
import BooleanBtnInput from "@/components/BooleanBtnInput"

export default {
    name: "VerifySlices",
    components: {
        SliceViewer,
        VerovioViewer,
        BooleanBtnInput
    },
    setup () {
        const state = reactive({
            randomPick: {}
        })

        function getSlice(needSlice){
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