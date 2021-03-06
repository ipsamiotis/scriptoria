<template>
  <BlockUI :blocked="state.blockedPanel">
    <div class="button-group">
      <h4>Duration: {{ state.noteDurations[state.sliderValue] }}</h4>
      <div class="slider-group">
        <Slider v-model="state.sliderValue" :step="1" :min="1" :max="6"/>
        <InlineMessage v-if="state.sliderMsg && state.sliderValue === 0" severity="warn">Please select duration
        </InlineMessage>
      </div>
      <div class="dotted">
        <strong>Dot:</strong>
        <InputSwitch v-model="state.dotButton"/>
      </div>
      <div class="note-rest">
        <Button id="noteBtn" type="button" label="Note" :badge="state.numNotes"
                class="p-button-outlined p-button-secondary" @click="addMusicElement($event)"/>
        <Button id="restBtn" type="button" label="Rest" :badge="state.numRests"
                class="p-button-outlined p-button-secondary" @click="addMusicElement($event)"/>
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
  emits: ['svg-updated'],
  setup(props, ctx) {

    const state = reactive({
      sliceElements: [],
      sliderValue: 0,
      noteDurations: ['', '1/32', '1/16', '1/8', '1/4', '1/2', '1'],
      adjustedSliderValue: [32, 16, 8, 4, 2, 1],
      dotButton: false,
      numNotes: 0,
      numRests: 0,
      sliderMsg: false,
      noteMsg: false,
      blockedPanel: false
    })

    function addMusicElement(event) {
      let addButton = event.currentTarget

      if (addButton.id === "noteBtn") {
        if (state.sliderValue !== 0) {
          state.numNotes += 1
          let note = `<note dur='${state.adjustedSliderValue[state.sliderValue - 1]}' dots='${state.dotButton ? 1 : 0}'>`
          state.sliceElements.push(note)
          state.sliderValue = 0
          state.dotButton = false
          state.sliderMsg = false
        } else {
          state.sliderMsg = true
        }
      } else if (addButton.id === "restBtn") {
        if (state.sliderValue !== 0) {
          state.numRests += 1
          let rest = `<rest dur='${state.adjustedSliderValue[state.sliderValue - 1]}' dots='${state.dotButton ? 1 : 0}'>`
          state.sliceElements.push(rest)
          state.sliderValue = 0
          state.dotButton = false
          state.sliderMsg = false
        } else {
          state.sliderMsg = true
        }
      }
      let xmlSnippet = injectElementsToXML()
      ctx.emit('svg-updated', xmlSnippet)
    }

    function blockAndSubmit() {
      if (state.sliceElements.length !== 0) {
        if (state.blockedPanel === false) {
          state.blockedPanel = true
          let xmlSnippet = injectElementsToXML()
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

    function injectElementsToXML() {
      var parser = new DOMParser();
      var xmlDoc = parser.parseFromString(props.xml, "text/xml");
      var layer = xmlDoc.getElementsByTagName("layer");
      console.log(state.sliceElements)

      for (let element in state.sliceElements) {
        let element_xml = document.createRange().createContextualFragment(state.sliceElements[element]);
        console.log(element_xml)

        layer[0].appendChild(element_xml)
      }
      var s = new XMLSerializer();
      var newXmlStr = s.serializeToString(xmlDoc);
      console.log(newXmlStr)

      return newXmlStr
    }

    return {
      state,
      addMusicElement,
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