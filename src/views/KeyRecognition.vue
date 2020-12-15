<template>
    <div class="task">
        <div class="task-header">
            <h3>Key Recognition</h3>
            <strong>{{taskId}}</strong>
            <p>The given measure contains a key signature, please select the type. Multiple answers possible</p>
        </div>
        <div class="task-items">
            <SliceViewer :task-type="state.selectedTask.taskType" :slice-file="state.selectedTask.filename"/>
        </div>
        <div class="task-input">
            <KeyRecButtons :task-type="state.selectedTask.taskType" @need-slice="getSlice"/>
        </div>
    </div>
</template>

<script>
import {reactive, onMounted, computed} from "vue"
import {useRoute} from 'vue-router';

import SliceViewer from "@/components/SliceViewer"
import KeyRecButtons from "@/components/KeyRecButtons"

import {tasks} from "@/assets/slices"

export default {
    name: "KeyRecognition",
    components: {
        SliceViewer,
        KeyRecButtons
    },

    setup () {
        const route = useRoute();
        const taskId = computed(() => route.params.taskId)


        const state = reactive({
            selectedTask: {}
        })

        function getSlice(...args){
            const [needSlice, label] = args
            console.log(label)
            // console.log(taskId.value)
            if (needSlice) {
                for (let task in tasks) {
                    // If (taskId) fetchTaskFromApi(taskId) -> for tasksIDs from backend
                    if (tasks[task].taskID == taskId.value) {
                        state.selectedTask = tasks[task]
                    }
                }
            }
        }

        onMounted(() => {
            getSlice(true)
        })

        return {
            state,
            getSlice,
            taskId
        }
    }
}
</script>

<style lang="scss" scoped>

</style>