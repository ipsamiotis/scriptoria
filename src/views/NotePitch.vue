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
        <VerovioLoader :context="state.selectedTask.context" :measure-snippet="state.snippet"/>
        <!-- <div id="loader"></div> -->
      </div>
      <div class="btn-group">
        <AddNoteButtons @svg-updated="svgUpdated" :taskID="state.sliceId" :xml="state.selectedTask.xml"/>
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

  setup() {
    const route = useRoute();
    const taskId = computed(() => route.params.taskId)

    const state = reactive({
      selectedTask: {},
      sliceId: "",
      snippet: '<section><measure label="41" n="41" xml:id="measure_80f64356-6e27-4a3b-a4d2-286d551012ad"><staff facs="#zone_8bfc7fe1-c5d5-44f0-a850-8e6193e75e77" label="6" n="6" xml:id="staff_8d881556-70dd-40c9-a476-ec5d03553a9e"><layer><clef xmlns="http://www.w3.org/1999/xhtml" shape="G" line="2"></clef></layer></staff></measure></section>',
    })

    function svgUpdated(svg) {
      console.log("note pitch")
      state.snippet = svg;
    }

    function getSlice(taskObj) {
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
      svgUpdated,
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