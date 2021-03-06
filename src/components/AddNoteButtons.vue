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
      <InlineMessage v-if="noteMsg && sliceElements.length === 0" severity="warn">Please add an element
      </InlineMessage>
    </div>
  </BlockUI>
  <Button id="submitButton" type="button" label="Completed Sequence"
          :icon="blockedPanel ? 'pi pi-check-circle' : 'pi pi-circle-off'"
          @click="submit(sliceElements)"/>
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
      noteMsg: false,
      blockedPanel: false
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
    }
  },
  computed: {
    isSliderValid() {
      return this.sliderValue !== 0;
    },
  },
  emits: ['svg-updated'],

  methods: {
    numElements(type) {
      return this.sliceElements.filter(element => {
        return element.type === type;
      }).length.toString() ?? '0';
    },
    addNote() {
      let note = new NoteElement(this.adjustedSliderValue[this.sliderValue - 1], this.dotButton);
      this.sliceElements.push(note)
      this.resetForm();
      this.$emit('svg-updated', VerovioHelper.getXmlFromElements(this.xml, this.sliceElements))
    },
    addRest() {
      let rest = new RestElement(this.adjustedSliderValue[this.sliderValue - 1], this.dotButton);
      this.sliceElements.push(rest)
      this.resetForm();
      this.$emit('svg-updated', VerovioHelper.getXmlFromElements(this.xml, this.sliceElements))
    },
    resetForm() {
      this.sliderValue = 0
      this.dotButton = false
    },
    submit() {
      if (this.sliceElements.length !== 0) {
        if (this.blockedPanel === false) {
          this.blockedPanel = true
          let xmlSnippet = VerovioHelper.getXmlFromElements(this.xml, this.sliceElements)

          this.$emit('svg-updated', xmlSnippet)
          axios.post(`http://localhost:443/${this.taskID}`, xmlSnippet)
              .then(response => this.labelId = response.data.id);
        } else {
          this.blockedPanel = false
        }
      } else {
        this.noteMsg = true
      }
    }
  },
}
</script>

<style lang="scss" scoped>
.button-group {
  display: grid;
  height: 200px;
}
</style>