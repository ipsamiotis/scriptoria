<template>
  <BlockUI :blocked="blockedPanel">
    <div class="button-group">
      <h4>
        <span v-if="isSliderValid">Duration: {{ noteDurations[sliderValue] }}</span>
        <span v-else><InlineMessage severity="warn">Please select duration</InlineMessage></span>
      </h4>

      <div class="slider-group">
        <Slider v-model="sliderValue" :step="1" :min="1" :max="6"/>

      </div>
      <div class="dotted">
        <strong>Dot:</strong>
        <InputSwitch v-model="dotButton"/>
      </div>
      <div class="note-rest">
        <Button id="noteBtn" type="button" label="Note" :badge="numElements('note')"
                class="p-button-outlined p-button-secondary" @click="addNote()"
                :disabled="!isSliderValid"/>
        <Button id="restBtn" type="button" label="Rest" :badge="numElements('rest')"
                class="p-button-outlined p-button-secondary" @click="addRest()"
                :disabled="!isSliderValid"/>
      </div>
      <Button type="button" label="Delete"
              class="p-button-outlined p-button-secondary" @click="deleteElement"/>

      <Button type="button" label="Previous" class="p-button-outlined p-button-secondary" @click="decrease"
              :disabled="!canDecrease"/>
      <Button type="button" label="Next"
              class="p-button-outlined p-button-secondary" @click="increase"
              :disabled="!canIncrease"/>
    </div>
  </BlockUI>
  <Button id="submitButton" type="button" :label="submitLabel"
          :icon="blockedPanel ? 'pi pi-check-circle' : 'pi pi-circle-off'"
          @click="submit(sliceElements)" :disabled="!canSubmit"/>
</template>

<script>
import axios from 'axios'

import Slider from 'primevue/slider';
import InputSwitch from 'primevue/inputswitch';
import Button from 'primevue/button';
import InlineMessage from 'primevue/inlinemessage';
import BlockUI from 'primevue/blockui';
import {NoteElement} from "@/scripts/data/NoteElement";
import {RestElement} from "@/scripts/data/RestElement";
import {VerovioHelper} from "@/scripts/VerovioHelper";

export default {
  name: "AddNoteButtons",
  emits: ['svgUpdated'],

  components: {
    Slider,
    InputSwitch,
    Button,
    InlineMessage,
    BlockUI
  },
  data() {
    return {
      sliceElements: [],
      sliderValue: 0,
      noteDurations: ['', '1/32', '1/16', '1/8', '1/4', '1/2', '1'],
      adjustedSliderValue: [32, 16, 8, 4, 2, 1],
      dotButton: false,
      blockedPanel: false,
      currentIndex: 0,

    }
  },
  props: {
    taskID: {
      type: String,
      required: true,
    },
    xml: {
      type: String,
      required: true,
    },
    context: {
      type: String,
      required: true,
    }
  },
  computed: {
    canIncrease() {
      return this.currentIndex < this.sliceElements.length - 1;
    },
    canDecrease() {
      return this.currentIndex > 0;
    },
    isSliderValid() {
      return this.sliderValue !== 0;
    },
    canSubmit() {
      return this.sliceElements.length > 0;
    },
    submitLabel() {
      return this.canSubmit ? 'Completed Sequence' : 'Please add an element'
    },
    getLastClef() {
        var clef = "G2"
        const parser = new DOMParser();
        var staffDefs = parser.parseFromString(this.xml, "text/xml").getElementsByTagName("staffDef");
        if (staffDefs.length == 0) {
          staffDefs = parser.parseFromString(this.context, "text/xml").getElementsByTagName("staffDef")
        }
        if (staffDefs.length > 0) {
           const staffDef = staffDefs[staffDefs.length - 1]
           const line = staffDef.getAttribute("clef.line");
           const shape = staffDef.getAttribute("clef.shape");
           if (!(line === undefined) && !(shape === undefined)) {
              clef = shape.concat(line);
           }
        }
        return clef
    }
  },

  methods: {
    increase() {
      this.currentIndex++;
      let xmlSnippet = VerovioHelper.getXmlFromElements(this.xml, this.sliceElements)
      this.$emit('svg-updated', xmlSnippet)
    },
    decrease() {
      this.currentIndex--;
      let xmlSnippet = VerovioHelper.getXmlFromElements(this.xml, this.sliceElements)
      this.$emit('svg-updated', xmlSnippet)
    },
    deleteElement() {
      this.sliceElements.splice(this.currentIndex, 1);
      if (this.currentIndex >= this.sliceElements.length && this.currentIndex !== 0) {
        this.currentIndex--;
      }
      let xmlSnippet = VerovioHelper.getXmlFromElements(this.xml, this.sliceElements)
      this.$emit('svg-updated', xmlSnippet)
    },

    numElements(type) {
      return this.sliceElements.filter(element => {
        return element.type === type;
      }).length.toString() ?? '0';
    },
    addNote() {
      var pname;
      var oct;
      switch(this.getLastClef) {
        case "C3":
          pname = "c";
          oct = "4";
          break;
        case "F4":
          pname = "d";
          oct = "3";
          break;
        default: // G clef
          pname = "b";
          oct = "4";
      } 

      let note = new NoteElement(this.adjustedSliderValue[this.sliderValue - 1], this.dotButton, oct, pname);


      this.sliceElements.push(note)
      this.resetForm();
    },
    addRest() {
      let rest = new RestElement(this.adjustedSliderValue[this.sliderValue - 1], this.dotButton);
      this.sliceElements.push(rest)
      this.resetForm();
    },
    resetForm() {
      this.dotButton = false
    },
    submit() {
      if (this.blockedPanel === false) {
        this.blockedPanel = true
        let xmlSnippet = VerovioHelper.getXmlFromElements(this.xml, this.sliceElements)

        axios.post(`http://localhost:443/${this.taskID}`, xmlSnippet)
            .then(response => this.labelId = response.data.id);
      } else {
        this.blockedPanel = false
      }
      window.parent.postMessage('submit', '*');
    }
  },
  updated() {
    let xmlSnippet = VerovioHelper.getXmlFromElements(this.xml, this.sliceElements)
    this.$emit('svg-updated', xmlSnippet)
  }
}
</script>

<style lang="scss" scoped>
.btn-group {
  align-self: end;
  justify-self: center;
}

.btn-group > * > * > * > *   {
  margin: 7px 0 7px 0;
  vertical-align: middle;
}

.btn-group > * > * > * {
  margin: 5px;
  vertical-align: middle;
}

.btn-group > * {
  margin: 5px;
  vertical-align: middle;
}


</style>