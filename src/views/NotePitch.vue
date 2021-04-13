<template>
  <div class="task" style="margin-bottom: 80px;">
    <div class="task-header">
      <h2 style="margin-left: 48px;">Pitch Transcription</h2>
          <HelpPopup>
      <img style="width: 50%;" src="@/assets/tutorial_gifs/pitchtrans.gif">
      <p>In this task we will modify the pitch (vertical position) of the notes to match the image.</p>
      <p>Use the buttons with horizontal arrows to navigate the notes, and use the buttons with vertical arrows to control the vertical position.</p>
      <p>If you see a key symbol on the note, you can add it with the toggles to the right.</p>
      <p>In case you don't understand what to do, or the task is malfunctioning, you may skip it with the "skip" button at the bottom right.</p>
      <p>When done, you can click "Confirm"!</p>
    </HelpPopup>
      <!-- The given segment to the left might contain notes and rests. <br>
      Use:<br>
      - The slider to control the duration of the music element<br>
      - The toggle to add a dot<br>
      - The "Note" or "Rest" buttons to add the music element<br>
      When you have input all the elements, select "Completed Sequence"<br><br> -->
    </div>
    <div class="task-viewports">
      <div class="img-viewer">
        <SliceViewer :slice-file="selectedTask.image_path"/>
      </div>
      <div class="mei-viewer">
        <VerovioLoader  @svg-updated="updateHighlights" :context="selectedTask.context" :measure-snippet="editedSnippet"/>
      </div>



      <span class="note-navigation">
                <Button type="button" style="grid-col: 1 / 2;" icon="pi pi-chevron-left" class="btn-h p-button-lg p-button-outlined p-button-secondary" @click="decrease"
                :disabled="!canDecrease"/>
        <span style="grid-col: 2 / 3;">
        <Button type="button" icon="pi pi-angle-double-up"  class="btn-v p-button-outlined p-button-secondary" @click="octUp"/>
        <Button type="button" icon="pi pi-angle-up"  class="btn-v p-button-outlined p-button-secondary" @click="pitchUp"/>
        <Divider class="divider"/>
        <Button type="button" icon="pi pi-angle-down"  class="btn-v p-button-outlined p-button-secondary" @click="pitchDown"/>
        <Button type="button" icon="pi pi-angle-double-down"  class="btn-v p-button-outlined p-button-secondary" @click="octDown"/>
        </span>
                <Button style="grid-col: 3 / 4;" type="button"  icon="pi pi-chevron-right"
                class="btn-h p-button-lg p-button-outlined p-button-secondary" @click="increase"
                :disabled="!canIncrease"/>
            <div class="btn-group" style="grid-col: 3 / 4;">
        <div>
          <ToggleButton :disabled="submitted" @click="setKey('s');" class="btn" v-model="useSharpToggle" onIcon="key-sharp-icon" offIcon="key-sharp-icon"/>
          <ToggleButton :disabled="submitted" @click="setKey('f');" class="btn" v-model="useFlatToggle" onIcon="key-flat-icon" offIcon="key-flat-icon"/>
        </div>
        <div>
          <ToggleButton :disabled="submitted" @click="setKey('n');" class="btn" v-model="useNaturalToggle" onIcon="key-natural-icon" offIcon="key-natural-icon"/>
          <ToggleButton :disabled="submitted" @click="setKey('undefined');" class="btn" v-model="noKeyToggle" onLabel="None" offLabel="None"/>
        </div>
      </div>
      </span>

    </div>
      <SubmitButton :taskID="sliceId" :resultXml="editedSnippet"/>
  </div>
</template>

<script>
import {useRoute} from 'vue-router';

import axios from 'axios'

import SliceViewer from "@/components/SliceViewer"
import VerovioLoader from "@/components/VerovioLoader"
import Button from 'primevue/button';
// import SelectButton from 'primevue/selectbutton';
import {VerovioHelper} from "@/scripts/VerovioHelper";
import {settings} from "@/scripts/Settings";
import SubmitButton from "@/components/SubmitButton";
import HelpPopup from "@/components/HelpPopup"
import Divider from 'primevue/divider';
import ToggleButton from 'primevue/togglebutton';

export default {
  name: "NotePitch",
  components: {
    SliceViewer,
    Button,
    // SelectButton,
    VerovioLoader,
    SubmitButton,
    HelpPopup,
    ToggleButton,
    Divider
  },
  data() {
    return {
      currentIndex: 0,
      elements: [],
      selectedTask: {},
      sliceId: "",
      useSharpToggle: false,
      useFlatToggle: false,
      useNaturalToggle: false,
      noKeyToggle: true,
      // accidentalOptions: [
      //   {name: 'Sharp', value: 's'},
      //   {name: 'Flat', value: 'f'},
      //   {name: 'Natural', value: 'n'},
      //   {name: 'None', value: undefined},
      // ],
    }
  },
  computed: {
    filteredLength() {
      return this.filteredElements.length;
    },
    filteredElements() {
      const filteredElements = [];
      this.elements.forEach(element => {
        switch (element.type) {
          case 'note':  filteredElements.push(element); 
                        break;
          case 'beam':  element.notes.forEach(note => {
                          filteredElements.push(note);
                        })
                        break;
        }
      });
      return filteredElements;
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
    // TODO: Need to make a component with toggle buttons eventually that does this + layout automatically 
    setToggles(boolArray) {
      this.useSharpToggle = boolArray[0];
      this.useFlatToggle = boolArray[1];
      this.useNaturalToggle = boolArray[2];
      this.noKeyToggle = boolArray[3];
    },
    setKey(key) {
      this.currentElement.accidental = key;
      switch (key) {
        case "s": this.setToggles([true, false, false, false]);
                      break;
        case "f":  this.setToggles([false, true, false, false]);
                      break;
        case "n": this.setToggles([false, false, true, false]);
                      break;
        case "undefined":  this.setToggles([false, false, false, true]);
                      break;
      }
    },
    increase() {
      this.currentIndex++;
    },
    decrease() {
      this.currentIndex--;
    },
    updateHighlights() {
      let elements = document.getElementsByClassName("layer")[0]?.children;
      
      if (!elements) {
        return;
      }      
      
      // Convert to array
      elements = [...elements]
      const filtered = [];

      elements.forEach(element => {
        if (element.id.includes('note')) {
            filtered.push(element);
        } else if (element.id.includes('beam')) {
          const children = element.children;
          if (children) {
            [...children].forEach(child => {
              if (child.id.includes('note')) {
                filtered.push(child);
              }
            })
          }
        }
      });

      if (filtered.length === 0) {
        return;
      }

      for (const element of filtered) {
        element.style.animation = "";
      }
      filtered[this.currentIndex].style.animation = "pulse 1s ease-in-out infinite";
    },

    svgUpdated(svg) {
      this.editedSnippet = svg;
    },
    pitchDown() {
      this.filteredElements[this.currentIndex].pitchDown()
    },
    pitchUp() {
      this.filteredElements[this.currentIndex].pitchUp()
    },
    octDown() {
      this.filteredElements[this.currentIndex].octDown()
    },
    octUp() {
      this.filteredElements[this.currentIndex].octUp()
    }
  },

  updated() {
    this.updateHighlights();
  },
  mounted() {
    axios.get(`${settings.apiUrl}/tasks/${this.taskId}`)
        .then(response => {
          this.sliceId = this.taskId
          this.getSlice(response.data)
          this.elements = VerovioHelper.getElementsFromSectionXml(this.selectedTask.xml);
        });

    // Easy pitch controls
    window.addEventListener("keydown", e => {
      switch (e.key) {
        case "ArrowUp": e.preventDefault(); this.pitchUp(); break;
        case "ArrowDown": e.preventDefault(); this.pitchDown(); break;
        case "ArrowLeft": e.preventDefault(); if (this.canDecrease) {this.decrease();} break;
        case "ArrowRight": e.preventDefault(); if (this.canIncrease) {this.increase();} break;
      }
    });
  },


}
</script>

<style>
/* Needs to be global, otherwise webpack will rename the keyframes and we can no longer set it dynamically */
@keyframes pulse {
  0% { fill: darkred; }
  50% { fill: red; }
  100% { fill: darkred; }
}
.key-natural-icon {
    background: url("../assets/icons/key_signatures/natural.png");
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;
    height: 90%;
    width: 90%;
    position: relative;
}
  .key-sharp-icon {
      background: url("../assets/icons/key_signatures/sharp.png");
      background-repeat: no-repeat;
      background-size: contain;
      background-position: center;
      height: 90%;
      width: 90%;
      position: relative;
  }
  .key-flat-icon {
      background: url("../assets/icons/key_signatures/flat.png");
      background-repeat: no-repeat;
      background-size: contain;
      background-position: center;
      height: 90%;
      width: 90%;
      position: relative;
  }
</style>

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
  .btn {
    justify-content: center;
    margin: 4px;
    width: 64px;
    height: 64px;
  }
  .btn-v {
    margin: 2px;
  }
  .btn-h {
    height: 50%;
    width: 40%;
  }
  .btn-group {
    align-self: end;
    justify-self: center;
  }
  .divider {
    margin-top: 5px;
    margin-bottom: 6px;
  }
  .note-navigation {
    display: grid;
    grid-template-columns: 1fr 0 1fr 1.5fr;
    width: 100%;
  }
  .note-navigation > * {
    justify-self: center;
        align-self: center;

  }
}
</style>