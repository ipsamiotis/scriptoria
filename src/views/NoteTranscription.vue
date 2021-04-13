<template>
  <div class="task" style="margin-bottom: 80px;">
    <div class="task-header">
      <h2 style="margin-left: 48px;">Rhythm Transcription</h2>
      <!-- Try to match the left preview in the right panel, ignore the vertical position (pitch) of the notes. -->
    <HelpPopup>
      <img style="width: 50%;" src="@/assets/tutorial_gifs/notetrans.gif">
      <p>In this task, we will start adding notes and rests!</p>
      <p>For now, we only care about the rhythm, so ignore the vertical placement of the notes.</p>
      <p>Try to match the note/rest symbols in the preview with the ones you see in the image, by using the left buttons.</p>
      <p>You can hit the beam toggle and it will put the next notes you add in a beam, until you turn it off.</p>
      <p>The dot toggle allows you to add one dot to the note, in case you see that in the image.</p>
      <p>If you make a mistake, you can hit the undo button at the very right.</p>
      <p>In case you don't understand what to do, or the task is malfunctioning, you may skip it with the "skip" button at the bottom right.</p>
      <p>When done, you can click "Confirm"!</p>
    </HelpPopup>
    </div>
    <div class="task-viewports">
      <div class="img-viewer">
        <SliceViewer :slice-file="selectedTask.image_path"/>
      </div>
      <div class="mei-viewer">
        <VerovioLoader @svg-updated="updateHighlights" :context="selectedTask.context" :measure-snippet="snippet" ref="viewer"/>
      </div>
      <div class="btns">
            <div class="notes">
                <Button class="btn p-button-outlined" v-for="number of denominators" v-bind:key="number" @click="addNote(number)">
                  <img v-bind:src="require('@/assets/icons/notes/' + number + '.png')" />
                </Button>
            </div>
            <div class="rests">
                <Button class="btn p-button-outlined" v-for="number of denominators" v-bind:key="number" @click="addRest(number)">
                  <img v-bind:src="require('@/assets/icons/rests/' + number + '.png')" />
                </Button>
            </div>

            <ToggleButton class="btn" v-model="dotToggle" onLabel="DOT" offLabel="DOT"/>
            <ToggleButton class="btn" v-model="beamToggle" onLabel="BEAM" offLabel="BEAM"/>

            <div class="navigation">
                <Button class="btn-fill p-button-outlined" @click="undo">
                  <img src="@/assets/icons/undo.png"/>
                </Button>            
            </div>
      </div>
    </div>
      <SubmitButton :taskID="sliceId" :resultXml="snippet"/>
  </div>
</template>

<script>

import axios from 'axios'

import SliceViewer from "@/components/SliceViewer"
import VerovioLoader from "@/components/VerovioLoader";
import {useRoute} from "vue-router";
import Button from 'primevue/button';
import ToggleButton from 'primevue/togglebutton';
import {NoteElement} from "@/scripts/data/NoteElement";
import {RestElement} from "@/scripts/data/RestElement";
import {BeamElement} from "@/scripts/data/BeamElement";
import {VerovioHelper} from "@/scripts/VerovioHelper";
import {settings} from "@/scripts/Settings";
import SubmitButton from "@/components/SubmitButton";
import HelpPopup from "@/components/HelpPopup"


export default {
  name: "NoteTranscription",
  components: {
    VerovioLoader,
    SliceViewer,
    Button,
    ToggleButton,
    SubmitButton,
    HelpPopup
  },
  data() {
    return {
      selectedTask: {},
      clefMap: {
          ''  :['f', '5'],  // Should technically not happen, but we can have it just in case
          'G2':['b', '4'],
          'C3':['c', '4'],
          'F4':['d', '3']
      },
      undoStack: [],
      sliceElements: [],
      denominators: ['32', '16', '8', '4', '2', '1'],
      sliceId: "",
      dotToggle: false,
      beamToggle: false,
      snippet: '<section><measure label="41" n="41" xml:id="measure_80f64356-6e27-4a3b-a4d2-286d551012ad"><staff facs="#zone_8bfc7fe1-c5d5-44f0-a850-8e6193e75e77" label="6" n="6" xml:id="staff_8d881556-70dd-40c9-a476-ec5d03553a9e"><layer><clef xmlns="http://www.w3.org/1999/xhtml" shape="G" line="2"></clef></layer></staff></measure></section>',
    }
  },

  computed: {
    taskId() {
      const route = useRoute();
      return route.params.taskId
    },
    addDot() {
      return this.dotToggle ? "1" : "0";
    }
  },


  methods: {
    updateHighlights() {
      let elements = document.getElementsByClassName("layer")[0]?.children;

      // Otherwise crashes at array conversion
      if (!elements) {
        return;
      }

      // Convert to array
      elements = [...elements]

      elements = elements.filter(element => {
        return element.id.includes('rest') || element.id.includes('note') || element.id.includes('beam');
      })

      if (elements.length === 0) {
        return;
      }

      for (const element of elements) {
        element.style.fill = "black"
      }

      if (this.sliceElements.length > 0) {
        const last = elements[elements.length - 1];
        if (last.id.includes('beam') && last.children.length > 0) {
          last.children[last.children.length - 1].style.animation = "pulse 1s ease-in-out infinite";
        } else {
          last.style.animation = "pulse 1s ease-in-out infinite";
        }
      }
    },

    // NOTE: Only works for single-staff slices
    getNeutralPitch() {
        var clef = "";
        const parser = new DOMParser();
        var staffDefs = parser.parseFromString(this.selectedTask.xml, "text/xml").getElementsByTagName("staffDef");
        if (staffDefs.length == 0) {
          staffDefs = parser.parseFromString(this.selectedTask.context, "text/xml").getElementsByTagName("staffDef")
        }
        if (staffDefs.length > 0) {
           const staffDef = staffDefs[staffDefs.length - 1]
           const line = staffDef.getAttribute("clef.line");
           const shape = staffDef.getAttribute("clef.shape");
           if (!(line === null) && !(shape === null)) {
              clef = shape.concat(line);
           }
        }
        return this.clefMap[clef];
    },
    addNote(denominator) {
      const [pname, oct] = this.getNeutralPitch();
      const note = new NoteElement(denominator, this.addDot, oct, pname);

      if (this.beamToggle) {
        const popped = this.sliceElements.pop();
        if (popped instanceof BeamElement) {
          popped.notes.push(note);
          this.sliceElements.push(popped);
        } else if (popped instanceof NoteElement) {
          const beam = new BeamElement([popped, note]);
          this.sliceElements.push(beam);
        } else {
          if (!(popped === undefined)) {
            this.sliceElements.push(popped);
          }
          this.sliceElements.push(note);
        }
      } else {
        this.sliceElements.push(note);
      }
      this.undoStack.push(note);
      this.updateSVG();
      this.resetToggles();
    },
    addRest(denominator) {
      const rest = new RestElement(denominator, this.addDot);
      this.sliceElements.push(rest);
      this.undoStack.push(rest);
      this.updateSVG();
      this.resetToggles();
    },
    resetToggles() {
      this.dotToggle = false;
    },
    undo() {
      const popped = this.undoStack.pop();
      if (!(popped === undefined)) {
        for (const element of this.sliceElements) {
          if (element instanceof BeamElement && element.notes.includes(popped)) {
            element.notes.splice(this.sliceElements.indexOf(popped), 1);
            switch (element.notes.length) {
              // Remove the empty beam
              case 0:   this.sliceElements.splice(this.sliceElements.indexOf(element), 1); 
                        break;

              // Flatten the singular beam
              case 1:   var note = element.notes.pop();
                        this.sliceElements.splice(this.sliceElements.indexOf(element), 1); 
                        this.sliceElements.push(note);
                        break;
              default:  break;
            }
            break;
          } else if (element === popped) {
            this.sliceElements.splice(this.sliceElements.indexOf(element), 1);
            break;
          }
        } 
      }
      this.updateSVG();
    },
    updateSVG() {
      this.snippet = VerovioHelper.getXmlFromElements(this.selectedTask.xml, this.sliceElements);
    }
  },

  mounted() {
    axios.get(`${settings.apiUrl}/tasks/${this.taskId}`)
        .then(response => {
          this.sliceId = this.taskId
          this.selectedTask = response.data;
          this.updateSVG();
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
</style>

<style lang="scss" scoped>
.task {
  justify-content: flex-start;
  max-width: 1000px;
  width: 100%;
}

.task-viewports {
  // border: 3px solid rgb(0, 0, 0);
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr auto;
  grid-gap: 20px;
justify-items: start;

    grid-template-areas: 
      "img mei"
      "buttons buttons";
  .img-viewer {
  grid-column: 1;
  grid-row: 1;
    align-self: flex-start;
justify-self: stretch;
grid-area: img;
  }


  .mei-viewer {
      grid-column: 2;
      grid-row: 1;
       align-self: flex-end;
justify-self: stretch;
grid-area: mei;
  }
  .btns {
    height: 25%;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    grid-row: 2;
    column-gap: 24px;
    row-gap: 12px;
    grid-column: 1 / 3;
    justify-self: stretch;
    justify-items: start;
    grid-area: buttons;
    
    grid-template-areas: 
      "notes notes toggles navigation"
      "rests rests toggles navigation";
  }

  .notes  {
    grid-area: notes;
    grid-column: 1 / 3;
  }
  .rests  {
    grid-area: rests;
    grid-column: 1 / 3;
  }

  .notes > * {
    height: 100%;
  }
  .rests > * {
    height: 100%;
  }

  .toggles  {
    grid-area: toggles;
  }
  .toggles > * {
    width: 50%;
  }
  .navigation {
    grid-area: navigation;
    align-self: stretch;
    justify-self: stretch;
  }
  .navigation > * {

    width: 100%;
    height: 100%;
  }

  .btn {
    justify-content: center;
    margin: 0px 4px;
    width: 64px;
    height: 64px;
  }

  .btn-fill {
    @extend .btn;
    width: 100%;
    height: 100%;
  }

  .btn > * {
    padding: 3px;
    height: 56px;
  }



}

</style>