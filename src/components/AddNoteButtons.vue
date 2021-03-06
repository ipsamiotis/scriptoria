<template>
  <BlockUI :blocked="state.blockedPanel">
    <div class="button-group">
      <h4>
        <span v-if="isSliderValid">Duration: {{ state.noteDurations[state.sliderValue] }}</span>
        <span v-else><InlineMessage severity="warn">Please select duration</InlineMessage></span>
      </h4>


      <div class="slider-group">
        <Slider v-model="state.sliderValue" :step="1" :min="1" :max="6"/>

      </div>
      <div class="dotted">
        <strong>Dot:</strong>
        <InputSwitch v-model="state.dotButton"/>
      </div>
      <div class="note-rest">
        <Button id="noteBtn" type="button" label="Note" :badge="numElements('note')"
                class="p-button-outlined p-button-secondary" @click="addNote()"
                :disabled="!isSliderValid"/>
        <Button id="restBtn" type="button" label="Rest" :badge="numElements('rest')"
                class="p-button-outlined p-button-secondary" @click="addRest()"
                :disabled="!isSliderValid"/>
      </div>
      <InlineMessage v-if="state.noteMsg && state.sliceElements.length === 0" severity="warn">Please add an element
      </InlineMessage>
    </div>
  </BlockUI>
  <Button id="submitButton" type="button" label="Completed Sequence"
          :icon="state.blockedPanel ? 'pi pi-check-circle' : 'pi pi-circle-off'"
          @click="blockAndSubmit(state.sliceElements)"/>
</template>

<script>
import {reactive} from "vue"

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
  components: {
    Slider,
    InputSwitch,
    Button,
    InlineMessage,
    BlockUI
  },
  props: {
    taskID: {
      type: String,
      required: true,
      default: ""
    },
    xml: {
      type: String,
      required: true,
      default: ""
    }
  },
  computed: {
    isSliderValid() {
      return this.state.sliderValue !== 0;
    },
  },
  emits: ['svg-updated'],

  methods: {
    numElements(type) {
      return this.state.sliceElements.filter(element => {
        return element.type === type;
      }).length.toString() ?? '0';
    },
    addNote() {
      let note = new NoteElement(this.state.adjustedSliderValue[this.state.sliderValue - 1], this.state.dotButton);
      this.state.sliceElements.push(note)
      this.resetForm();
      this.$emit('svg-updated', VerovioHelper.getXmlFromElements(this.xml, this.state.sliceElements))
    },
    addRest() {
      let rest = new RestElement(this.state.adjustedSliderValue[this.state.sliderValue - 1], this.state.dotButton);
      this.state.sliceElements.push(rest)
      this.resetForm();
      this.$emit('svg-updated', VerovioHelper.getXmlFromElements(this.xml, this.state.sliceElements))
    },
    resetForm() {
      this.state.sliderValue = 0
      this.state.dotButton = false
    },
  },
  setup(props, ctx) {

    const state = reactive({
      sliceElements: [],
      sliderValue: 0,
      noteDurations: ['', '1/32', '1/16', '1/8', '1/4', '1/2', '1'],
      adjustedSliderValue: [32, 16, 8, 4, 2, 1],
      dotButton: false,
      noteMsg: false,
      blockedPanel: false
    })


    function blockAndSubmit() {
      if (state.sliceElements.length !== 0) {
        if (state.blockedPanel === false) {
          state.blockedPanel = true
          let xmlSnippet = VerovioHelper.getXmlFromElements(this.xml, this.state.sliceElements)

          ctx.emit('svg-updated', xmlSnippet)
          axios.post(`http://localhost:443/${props.taskID}`, xmlSnippet)
              .then(response => this.labelId = response.data.id);
        } else {
          state.blockedPanel = false
        }
      } else {
        state.noteMsg = true
      }
    }


    return {
      state,
      blockAndSubmit
    }
  }
}
</script>

<style lang="scss" scoped>
.button-group {
  display: grid;
  height: 200px;
}
</style>