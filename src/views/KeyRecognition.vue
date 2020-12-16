<template>
    <div class="task">
        <div class="task-header">
            <h3>Key Recognition</h3>
            The given segment might contain a key signature. <br>
            Select "No Signature" or select the correct type in case you recognise any, alongside the amount.<br>
        </div>
        <div class="task-items">
            <SliceViewer :slice-file="state.selectedTask.image_path"/>
        </div>
        <div class="task-input">
            <KeyRecButtons/>
        </div>
    </div>
</template>

<script>
import {reactive, onMounted, computed} from "vue"
import {useRoute} from 'vue-router';

import axios from 'axios'

import SliceViewer from "@/components/SliceViewer"
import KeyRecButtons from "@/components/KeyRecButtons"

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

        function getSlice(taskObj){
            state.selectedTask = taskObj
        }

        onMounted(() => {
            axios.get(`http://localhost:443/tasks/${taskId.value}`)
                    .then(response => {
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