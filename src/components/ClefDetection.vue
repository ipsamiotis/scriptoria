<template>
    <div class="task">
        <div class="task-header">
            <h3>Task Description</h3>
            <p>Is there at least one cleff in this measure?</p>
            <h4>Example clefs:
            <img id="g-clef" class="clef" src="@/assets/icons/G-clef.svg" alt="">
            <img class="clef" src="@/assets/icons/FClef.svg" alt="">
            <img class="clef" src="@/assets/icons/CClef.svg" alt="">
            </h4>
        </div>
        <div class="task-items">
            <SliceViewer :task-type="state.randomPick.taskType" :slice-file="state.randomPick.filename"/>
        </div>
        <div class="task-input">
            <BooleanInput :task-type="state.randomPick.taskType" @need-slice="getSlice"/>
        </div>
    </div>
</template>

<script>
import {reactive, onMounted} from "vue"

import SliceViewer from "@/components/SliceViewer"
import BooleanInput from "@/components/BooleanInput"

import {tasks} from "@/assets/scannedMeasures"

export default {
    name: "ClefDetection",
    components: {
        SliceViewer,
        BooleanInput
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
    .task {
        display: grid;
        grid-template-rows: 1fr 2.3fr 1fr;
        .task-header {
            h4 {
                text-align: center;
            }
            .clef {
                margin: 6px;
                height: 20px;
            }
            #g-clef {
                height: 30px;
            }
        }
    }
</style>