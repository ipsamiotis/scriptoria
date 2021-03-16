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
        <SliceViewer :slice-file="selectedTask.image_path"/>
      </div>
      <VerovioLoader :context="selectedTask.context" :measure-snippet="snippet"/>
      <div class="btn-group">
        <AddNoteButtons ref="buttons" @svg-updated="svgUpdated" :taskID="sliceId" :xml="selectedTask.xml"/>
      </div>
    </div>
  </div>
</template>

<script>

import axios from 'axios'

import SliceViewer from "@/components/SliceViewer"
import AddNoteButtons from "@/components/AddNoteButtons"
import VerovioLoader from "@/components/VerovioLoader";
import {useRoute} from "vue-router";

export default {
  name: "NoteTranscription",
  components: {
    VerovioLoader,
    SliceViewer,
    AddNoteButtons
  },
  data() {
    return {
      selectedTask: {},
      sliceId: "",
      snippet: '<section><measure label="41" n="41" xml:id="measure_80f64356-6e27-4a3b-a4d2-286d551012ad"><staff facs="#zone_8bfc7fe1-c5d5-44f0-a850-8e6193e75e77" label="6" n="6" xml:id="staff_8d881556-70dd-40c9-a476-ec5d03553a9e"><layer><clef xmlns="http://www.w3.org/1999/xhtml" shape="G" line="2"></clef></layer></staff></measure></section>',
    }
  },

  computed: {
    taskId() {
      const route = useRoute();
      return route.params.taskId
    }
  },
  updated() {
    this.updateHighlights();
  },

  methods: {
    updateHighlights() {
      let elements = document.getElementsByClassName("layer")[0]?.children;
      // Convert to array
      elements = [...elements]

      if (!elements) {
        return;
      }
      elements = elements.filter(elements => {
        return elements.id.includes('rest') || elements.id.includes('note');
      })

      if (elements.length === 0) {
        return;
      }

      for (const element of elements) {
        element.style.fill = "black"
      }
      const currentIndex = this.$refs.buttons.$data.currentIndex;
      console.log(currentIndex)
      elements[currentIndex].style.fill = "red";
    },
    svgUpdated(svg) {
      this.snippet = svg;
      this.updateHighlights();
    },
    getSlice(taskObj) {
      this.selectedTask = taskObj
    }
  },

  mounted() {
    axios.get(`http://localhost:443/tasks/${this.taskId}`)
        .then(response => {
          this.sliceId = this.taskId
          this.getSlice(response.data)
        });
  },
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

  // .mei-viewer {
  //     align-self: center;
  //     justify-self: center;
  // }
  .btn-group {
    align-self: center;
    justify-self: center;
  }
}

</style>