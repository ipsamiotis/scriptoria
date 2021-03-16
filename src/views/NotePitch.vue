<template>
  <div class="task" style="margin-bottom: 80px;">
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
      <div class="mei-viewer">
        <VerovioLoader :context="selectedTask.context" :measure-snippet="editedSnippet"/>
      </div>

      <div class="btn-group">
        <Button type="button" label="Previous" class="p-button-outlined p-button-secondary" @click="decrease"
                :disabled="!canDecrease"/>
        <Button v-if="!canSubmit" type="button" label="Next"
                class="p-button-outlined p-button-secondary" @click="increase"
                :disabled="!canIncrease"/>
        <Button v-else type="button" label="Submit" class="p-button-outlined p-button-secondary" @click="submit"/>
      </div>
      <div class="btn-group">
        <SelectButton v-if="currentElement" v-model="currentElement.accidental" :options="accidentalOptions"
                      optionLabel="name" optionValue="value"/>
      </div>
      <div class="btn-group">
        <Button type="button" label="Pitch Down" class="p-button-outlined p-button-secondary" @click="pitchDown"/>
        <Button type="button" label="Pitch Up" class="p-button-outlined p-button-secondary" @click="pitchUp"/>
      </div>
    </div>
  </div>
</template>

<script>
import {useRoute} from 'vue-router';

import axios from 'axios'

import SliceViewer from "@/components/SliceViewer"
import VerovioLoader from "@/components/VerovioLoader"
import Button from 'primevue/button';
import SelectButton from 'primevue/selectbutton';
import {VerovioHelper} from "@/scripts/VerovioHelper";

export default {
  name: "NotePitch",
  components: {
    SliceViewer,
    Button,
    SelectButton,
    VerovioLoader,
  },
  data() {
    return {
      currentIndex: 0,
      elements: [],
      selectedTask: {},
      sliceId: "",
      accidentalOptions: [
        {name: 'Sharp', value: 's'},
        {name: 'Flat', value: 'f'},
        {name: 'Natural', value: 'n'},
        {name: 'None', value: undefined},
      ],
    }
  },
  computed: {
    filteredLength() {
      return this.filteredElements.length;
    },
    filteredElements() {
      return this.elements.filter(element => {
        return element.type === 'rest' || element.type === 'note';
      });
    },
    canSubmit() {
      return this.currentIndex === this.filteredLength - 1
    },
    currentElement() {
      return this.filteredElements[this.currentIndex];
    },
    editedSnippet() {
      if (!this.selectedTask.xml) {
        return "";
      }
      return VerovioHelper.getXmlFromElements(this.selectedTask.xml, this.elements, true)
    },
    canIncrease() {
      return this.currentIndex < this.filteredLength - 1;
    },
    canDecrease() {
      return this.currentIndex > 0;
    },
    taskId() {
      const route = useRoute();
      return route.params.taskId
    }
  },

  methods: {
    getSlice(taskObj) {
      this.selectedTask = taskObj
    },
    submit() {
      // TODO implement submit
      axios.post(`http://localhost:443/${this.taskId}`, this.editedSnippet);
      window.parent.postMessage('submit', '*')
    },
    increase() {
      this.currentIndex++;
    },
    decrease() {
      this.currentIndex--;
    },
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
      elements[this.currentIndex].style.fill = "red";
    },

    svgUpdated(svg) {
      this.editedSnippet = svg;
    },
    pitchDown() {
      this.filteredElements[this.currentIndex].pitchDown()
    },
    pitchUp() {
      this.filteredElements[this.currentIndex].pitchUp()
    }
  },

  updated() {
    this.updateHighlights();
  },
  mounted() {
    axios.get(`http://localhost:443/tasks/${this.taskId}`)
        .then(response => {
          this.sliceId = this.taskId
          this.getSlice(response.data)
          this.elements = VerovioHelper.getElementsFromSectionXml(this.selectedTask.xml);
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
  // align-items: flex-end;
  justify-content: center;

  .img-viewer {
    // grid-column-start: 1;
    // grid-column-end: 2;
    grid-row-start: 1;
    grid-row-end: 5;
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