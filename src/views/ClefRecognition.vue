<template>
  <div class="task" style="margin-bottom: 80px;">
    <div class="task-header">
      <h2 style="margin-left: 48px; margin-bottom: 0px;">Clef Recognition</h2>
    <HelpPopup>
      <img style="width: 50%;" src="@/assets/tutorial_gifs/clefrec.gif">
      <p>Clefs can appear at the beginning, but also throughout the measure.</p>
      <p>Click all the clef symbols that apply, based on what you see in the image.</p>
      <p>If you don't see any clef, just click the "None" toggle</p>
      <p>In case you don't understand what to do, or the task is malfunctioning, you may skip it with the "skip" button at the bottom right.</p>
      <p>When done, you can click "Confirm"!</p>
    </HelpPopup>
    </div>
    <div class="task-items">
      <SliceViewer :slice-file="selectedTask.image_path"/>
    </div>
    <div class="task-input">
        <ToggleButton :disabled=submitted @click="noClef();updateClefs()" class="btn" v-model="noClefToggle" onLabel="None" offLabel="None"/>
        <ToggleButton :disabled=submitted @click="yesClef();updateClefs()" class="btn" v-model="gToggle" onIcon="g-clef-icon" offIcon="g-clef-icon"/>
        <ToggleButton :disabled=submitted @click="yesClef();updateClefs()" class="btn" v-model="cToggle" onIcon="c-clef-icon" offIcon="c-clef-icon"/>
        <ToggleButton :disabled=submitted @click="yesClef();updateClefs()" class="btn" v-model="fToggle" onIcon="f-clef-icon" offIcon="f-clef-icon"/>
    </div>
    <SubmitButton @submitted=disableUI :buttonDisabled="!canSubmit" :taskID="sliceId" :resultXml="resultXml"/>
  </div>
</template>

<script>
import {useRoute} from 'vue-router';

import axios from 'axios'

import SliceViewer from "@/components/SliceViewer"
import ToggleButton from 'primevue/togglebutton';
import SubmitButton from "@/components/SubmitButton";
import HelpPopup from "@/components/HelpPopup"
import {settings} from "@/scripts/Settings";
import {ClefElement} from "@/scripts/data/ClefElement";
import {VerovioHelper} from "@/scripts/VerovioHelper";


export default {
  name: "ClefRecognition",
  components: {
    SliceViewer,
    ToggleButton,
    SubmitButton,
    HelpPopup
  },
  computed: {
    canSubmit() {
      return this.gToggle || this.cToggle || this.fToggle || this.noClefToggle
    },
    taskId() {
      const route = useRoute();
      return route.params.taskId
    }
  },
  methods: {
    disableUI() {
      this.submitted = true;
      this.$forceUpdate();
    },
    noClef() {
      this.gToggle = false;
      this.cToggle = false;
      this.fToggle = false;
      this.noClefToggle = true;
    },
    yesClef() {
      this.noClefToggle = false;
    },
    updateResultXml() {
      this.resultXml = VerovioHelper.getXmlFromElements(this.selectedTask.xml, this.sliceElements);
      console.log(this.resultXml)
    },
    updateClefs() {
      this.sliceElements = [];
      if (this.gToggle) {
        this.sliceElements.push(new ClefElement(2, 'G'))
      }
      if (this.cToggle) {
        this.sliceElements.push(new ClefElement(3, 'C'));
      }
      if (this.fToggle) {
        this.sliceElements.push(new ClefElement(4, 'F'));
      }
      this.updateResultXml();
    }
  },
  data() {
    return {
        selectedTask: {},
        noClefToggle: false,
        gToggle: false,
        cToggle: false,
        fToggle: false,
        resultXml: "",
        sliceId: "",
        sliceElements: [],
        submitted: false
      }
    },

    mounted() {
      axios.get(`${settings.apiUrl}/tasks/${this.taskId}`)
          .then(response => {
            this.sliceId = this.taskId;
            this.selectedTask = response.data;
            this.updateResultXml();
          });
    }
}
</script>

<style lang="scss"> 
.c-clef-icon {
    background: url("../assets/icons/CClef.png");
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;
    height: 85%;
    width: 85%;
    position: relative;
}
.g-clef-icon {
    background: url("../assets/icons/GClef.png");
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;
    height: 85%;
    width: 85%;
    position: relative;
}
.f-clef-icon {
    background: url("../assets/icons/FClef.png");
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;
    height: 85%;
    width: 85%;
    position: relative;
}
</style>
<style lang="scss" scoped>
  .btn {
    justify-content: center;
    margin: 0px 4px;
    width: 64px;
    height: 64px;
  }

  .btn > * {
    padding: 3px;
    height: 56px;
  }

</style>