<template>
    <div class="task">
        <div class="task-header">
            <h3>Note Transcription: Duration</h3>
            The given segment to the left might contain notes and rests. <br>
            Use the buttons "Note" and "Rest" to represent the sequence of notes you see.<br><br>
            Example: note,note,note,note -OR- rest,note,note <br><br>
        </div>
        <div class="task-viewports">
            <div class="img-viewer">
                <SliceViewer :slice-file="state.selectedTask.image_path"/>
            </div>
            <div class="btn-viewer">
                <VerovioLoader/>
                <AddNoteButtons :taskID="state.sliceId" :xml="state.selectedTask.xml"/>
            </div>
        </div>
    </div>
</template>

<script>
import {reactive, onMounted, computed} from "vue"
import {useRoute} from 'vue-router';

import axios from 'axios'

import SliceViewer from "@/components/SliceViewer"
import VerovioLoader from "@/components/VerovioLoader"
import AddNoteButtons from "@/components/AddNoteButtons"

export default {
    name: "NotePosition",
    components: {
        SliceViewer,
        VerovioLoader,
        AddNoteButtons
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
    // border: 3px solid rgb(0, 0, 0);
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-gap: 20px;
    .img-viewer {
        align-self: center;
        justify-self: center;
    }
    .mei-viewer {
        align-self: center;
        justify-self: center;
    }
    .btn-viewer {
        align-self: center;
        justify-self: center;
    }
}

</style>