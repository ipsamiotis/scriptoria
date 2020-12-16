<template>
    <div class="task">
        <div class="task-header">
            <h3>Clef Recognition</h3>
            The given segment might contain a clef. <br>
            Select "No Clef" or the types of clef(s), in case you recognise any.<br>
            <strong> Ignore the starting ones!</strong>
        </div>
        <div class="task-items">
            <SliceViewer :task-type="state.selectedTask.taskType" :slice-file="state.selectedTask.filename"/>
        </div>
        <div class="task-input">
            <ClefRecButtons :task-type="state.selectedTask.taskType" @need-slice="getSlice"/>
        </div>
    </div>
</template>

<script>
import {reactive, onMounted, computed} from "vue"
import {useRoute} from 'vue-router';

import axios from 'axios'

import SliceViewer from "@/components/SliceViewer"
import ClefRecButtons from "@/components/ClefRecButtons"

export default {
    name: "ClefRecognition",
    components: {
        SliceViewer,
        ClefRecButtons
    },

    setup () {
        const route = useRoute();
        const taskId = computed(() => route.params.taskId)

        const state = reactive({
            selectedTask: {},
            totalTasks: {}
        })



        function getSlice(...args){
            const [needSlice, label] = args
            console.log(label)
            if (needSlice) {
                for (let task in state.totalTasks.tasks) {
                    if (state.totalTasks.tasks[task]._id == taskId.value) {
                        state.selectedTask = state.totalTasks.tasks[task]
                    }
                }
                console.log(state.selectedTask)
            }
        }

        onMounted(() => {
            axios.get("https://crowdmanager.eu/tasks")
                    .then(response => {
                        state.totalTasks = response.data
                        getSlice(true)
                        });
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