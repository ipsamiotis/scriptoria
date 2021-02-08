<template>
    <div class="task">
        <div class="task-header">
            <h3>Note Transcription: Position</h3>
            The given segment to the left contains notes. <br>
            Add the proper amount notes to the right-hand panel, by using the buttons right below it<br>
            +: Add note <br>
            ^: Transpose note higher <br>
            : Transpose note lower <br>
        </div>
        <div class="task-viewports">
            <div class="img-viewer">
                <SliceViewer :slice-file="state.selectedTask.image_path"/>
            </div>
            <div class="mei-viewer">
                <VerovioLoader />
                <ClefRecButtons :taskID="state.sliceId" :xml="state.selectedTask.xml"/>
            </div>
        </div>
    </div>
</template>

<script>
import {reactive, onMounted, computed} from "vue"
import {useRoute} from 'vue-router';

import axios from 'axios'
// import verovio from 'verovio'

import SliceViewer from "@/components/SliceViewer"
import VerovioLoader from "@/components/VerovioLoader"

export default {
    name: "NotePosition",
    components: {
        SliceViewer,
        VerovioLoader
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
.task-viewports {
    border: 3px solid rgb(0, 0, 0);
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 20px;
}

</style>