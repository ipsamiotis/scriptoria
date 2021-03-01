<template>
    <div class="task">
        <div class="task-header">
            <h3>Note Transcription</h3>
            The given segment to the left might contain notes and rests. <br>
            Use:<br>
            - The slider to control the duration of the music element<br>
            - The toggle to add a dot<br>
            - The "Note" or "Rest" buttons to add the music element<br>
            When you have input all the elements, select "Completed Sequence"<br><br>
        </div>
        <div class="task-viewports">
            <div class="img-viewer">
                <SliceViewer :slice-file="state.selectedTask.image_path"/>
            </div>
            <div class="mei-viewer">
                <VerovioLoader/>
                <!-- <div id="loader"></div> -->
            </div>
            <div class="btn-group">
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
import AddNoteButtons from "@/components/AddNoteButtons"
import VerovioLoader from "@/components/VerovioLoader"

export default {
    name: "NotePitch",
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
        // align-items: flex-end;
        justify-content: center;
        .img-viewer {
            // grid-column-start: 1;
            // grid-column-end: 2;
            grid-row-start: 1;
            grid-row-end: 4;
        }
        .mei-viewer {
            align-self: center;
            justify-self: center;
        }
        .btn-group {
            align-self: end;
            justify-self: center;
        }
    }
    [v-cloak] + .loader::before {
        content: "Loading…"
    }
</style>