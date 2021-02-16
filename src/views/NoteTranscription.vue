<template>
    <div class="task">
        <div class="task-header">
            <h3>Note Transcription</h3>
            The given segment to the left might contain notes and rests. <br>
            In the text area to the right, indicate the type of note (c,d,e,f,g,a,b) or rest(r) with the appropriate letter, while <b>separating by comma</b> (,).<br><br>
            In case of an accidental, add "s" for ♯, "f" for ♭ or "n" for ♮ <b>after</b> the note letter, e.g. fs or ff or fn<br><br>
        </div>
        <div class="task-viewports">
            <div class="img-viewer">
                <SliceViewer :slice-file="state.selectedTask.image_path"/>
            </div>
            <div class="btn-viewer">
                <TextNotes :taskID="state.sliceId" :xml="state.selectedTask.xml"/>
            </div>
        </div>
    </div>
</template>

<script>
import {reactive, onMounted, computed} from "vue"
import {useRoute} from 'vue-router';

import axios from 'axios'

import SliceViewer from "@/components/SliceViewer"
import TextNotes from "@/components/TextNotes"

export default {
    name: "NotePosition",
    components: {
        SliceViewer,
        TextNotes
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
    grid-template-columns: 1fr 1fr 1fr;
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