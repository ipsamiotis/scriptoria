<template>
    <div class="task">
        <div class="task-header">
            <h3>Clef Recognition</h3>
            The given segment might contain a clef. <br>
            Select "No Clef" or the types of clef(s), in case you recognise any.<br>
        </div>
        <div class="task-items">
            <SliceViewer :slice-file="state.selectedTask.image_path"/>
        </div>
        <div class="task-input">
            <ClefRecButtons :taskID="state.sliceId" :xml="state.selectedTask.xml"/>
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
            sliceId: ""
        })

        function getSlice(taskObj){
            state.selectedTask = taskObj
        }

        onMounted(() => {
            axios.get(`http://localhost:443/tasks/${taskId.value}`)
                    .then(response => {
                        state.sliceId = taskId.value
                        getSlice(response.data)
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