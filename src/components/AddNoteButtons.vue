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
        <Button id="noteBtn" type="button" label="Note" :badge="numNotes"
                class="p-button-outlined p-button-secondary" @click="addNote()"
                :disabled="!isSliderValid"/>
        <Button id="restBtn" type="button" label="Rest" :badge="numRests"
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

// import axios from 'axios'

import Slider from 'primevue/slider';
import InputSwitch from 'primevue/inputswitch';
import Button from 'primevue/button';
import InlineMessage from 'primevue/inlinemessage';
import BlockUI from 'primevue/blockui';
import {MeiBuilder} from "@/scripts/MeiBuilder";

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
    numNotes() {
      return this.state.sliceElements.filter(element => {
        return element.includes('<note');
      }).length.toString() ?? '0';
    },
    numRests() {
      return this.state.sliceElements.filter(element => {
        return element.includes('<rest');
      }).length.toString() ?? '0';
    }
  },
  emits: ['svg-updated'],

  methods: {
    addNote() {
      let note = MeiBuilder.createNote(this.state.adjustedSliderValue[this.state.sliderValue - 1], this.state.dotButton);
      this.state.sliceElements.push(note)
      this.resetForm();
      this.$emit('svg-updated', this.injectElementsToXML())
    },
    addRest() {
      let rest = MeiBuilder.createRest(this.state.adjustedSliderValue[this.state.sliderValue - 1], this.state.dotButton);
      this.state.sliceElements.push(rest)
      this.resetForm();
      this.$emit('svg-updated', this.injectElementsToXML())
    },
    resetForm() {
      this.state.sliderValue = 0
      this.state.dotButton = false
    },
    injectElementsToXML() {
      var parser = new DOMParser();
      var xmlDoc = parser.parseFromString(this.xml, "text/xml");
      var layer = xmlDoc.getElementsByTagName("layer");

      for (let element in this.state.sliceElements) {
        let element_xml = document.createRange().createContextualFragment(this.state.sliceElements[element]);
        console.log(element_xml)

        layer[0].appendChild(element_xml)
      }
      var s = new XMLSerializer();
      var newXmlStr = s.serializeToString(xmlDoc);
      console.log(newXmlStr)

      return newXmlStr
    }
  },
  setup() {

    const state = reactive({
      sliceElements: [],
      sliderValue: 0,
      noteDurations: ['', '1/32', '1/16', '1/8', '1/4', '1/2', '1'],
      adjustedSliderValue: [32, 16, 8, 4, 2, 1],
      dotButton: false,
      numNotes: 0,
      numRests: 0,
      noteMsg: false,
      blockedPanel: false
    })


    function blockAndSubmit() {
      if (state.sliceElements.length !== 0) {
        if (state.blockedPanel === false) {
          state.blockedPanel = true
          // let xmlSnippet = injectElementsToXML()
          // ctx.emit('svg-updated', xmlSnippet)
          // axios.post(`http://localhost:443/${props.taskID}`, xmlSnippet)
          //     .then(response => this.labelId = response.data.id);
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