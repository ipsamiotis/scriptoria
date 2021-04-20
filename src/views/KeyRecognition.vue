<template>
  <div class="task" style="margin-bottom: 80px;">
    <div class="task-header">

    <h2 style="margin-left: 48px; margin-bottom: 0px;">Key Recognition</h2>
    <HelpPopup>
      <img style="width: 50%;" src="@/assets/tutorial_gifs/keyrec.gif">
      <p>Key signatures are only located at the very beginning of the measure and usually come in multiples.</p>
      <p>Click the matching key signature toggles to select the type of signature you see.</p>
      <p>Then click the button at the very right to increment the sharps/flats to match the image.</p>
      <p>If you don't see any key signature, just click the "None" toggle</p>
      <p>In case you don't understand what to do, or the task is malfunctioning, you may skip it with the "skip" button at the bottom right.</p>
      <p>When done, you can click "Confirm"!</p>
    </HelpPopup>
    </div>
    <div class="task-items">
      <SliceViewer :slice-file="selectedTask.image_path"/>

    </div>

    <div class="task-input">
      <span>
          <ToggleButton :disabled="submitted" @click="setNoKey();updateResultXml()" class="btn" v-model="noKeyToggle" onLabel="None" offLabel="None"/>
          <ToggleButton :disabled="submitted" @click="setFlat();updateResultXml()" class="btn" v-model="useFlat" onIcon="key-flat-icon" offIcon="key-flat-icon"/>
          <ToggleButton :disabled="submitted" @click="setSharp();updateResultXml()" class="btn" v-model="useSharp" onIcon="key-sharp-icon" offIcon="key-sharp-icon"/>
          <Divider style="display: inline; opacity: 0;" layout="vertical"/>

          <Button v-model="count" class="btn p-button-outlined" :disabled="submitted || disabled || (!useSharp && !useFlat)"  @click="moreKeys();updateResultXml()">
              <img v-bind:src="require('@/assets/icons/key_signatures/' + count + flatOrSharp + '.png')" />
          </Button>
          <Button class="btn p-button-outlined" @click="undo">
              <img style="height: 75%;" src="@/assets/icons/undo.png"/>
          </Button>    
      </span>
    </div>
    <SubmitButton @submitted=disableUI :buttonDisabled="!canSubmit" :taskID="sliceId" :resultXml="resultXml"/>

  </div>
</template>

<script>
import {useRoute} from 'vue-router';

import axios from 'axios'
import ToggleButton from 'primevue/togglebutton';
import SubmitButton from "@/components/SubmitButton";
import SliceViewer from "@/components/SliceViewer"
import HelpPopup from "@/components/HelpPopup"
import Button from 'primevue/button';
import {settings} from "@/scripts/Settings";
import Divider from 'primevue/divider';

export default {
  name: "KeyRecognition",
  components: {
    SliceViewer,
    ToggleButton,
    SubmitButton,
    HelpPopup,
    Button,
    Divider
  },
computed: {
    canSubmit() {
      return this.noKeyToggle || ((this.useFlat || this.useSharp) && this.count > 0);
    },
    taskId() {
      const route = useRoute();
      return route.params.taskId
    },
    disabled() {
      return this.noKeyToggle;
    },
    flatOrSharp() {
      return (this.useFlat ? 'f' : 's');
    }
  },
  methods: {
    disableUI() {
      this.submitted = true;
      this.$forceUpdate();
    },
    moreKeys() {
      this.count = this.count % 7 + 1;
    },
    setFlat() {
      this.useSharp = false;
      this.noKeyToggle = false;
      if (this.useFlat) {
        this.count = 1;
      } else {
        this.count = 0;
      }
    },
    setSharp() {
      this.useFlat = false;
      this.noKeyToggle = false;
      if (this.useSharp) {
        this.count = 1;
      } else {
        this.count = 0;
      }
    },
    setNoKey() {
      this.useSharp = false;
      this.useFlat = false;
      this.count = 0;
    },
    undo() {
        if (!this.useSharp && !this.useFlat) {return;}
        this.count -= 1;
        if (this.count <= 0) {
            this.count = 7;
        }
    },
    // TODO: move to verovio helper somehow
    updateScoreDef() {
      var parser = new DOMParser();      
      var s = new XMLSerializer();
      var xmlDoc = parser.parseFromString(this.selectedTask.xml, "text/xml");

      var elements = xmlDoc.getElementsByTagName("measure");
      var n = xmlDoc.getElementsByTagName("staff")[0].getAttribute("n");


      if (this.noKeyToggle) {
          for (let sd of xmlDoc.getElementsByTagName("staffDef")) {
            if (sd.getAttribute("n")==n) {
              sd.removeAttribute("key.sig");
            }
          }
        return s.serializeToString(xmlDoc);
      } 

      var scoreDefs = xmlDoc.getElementsByTagName("scoreDef");
      var scoreDef = null
      if (scoreDefs.length > 0) {
        scoreDef = scoreDefs[0];
      } else {
        scoreDef = xmlDoc.createElement("scoreDef");
        xmlDoc.documentElement.insertBefore(scoreDef, elements[0]);
      }

      var staffGrps = scoreDef.getElementsByTagName("staffGrp");
      var staffGrp = null;
      if (staffGrps.length > 0) {
        staffGrp = staffGrps[0];
      } else {
        staffGrp = xmlDoc.createElement("staffGrp");
        scoreDef.appendChild(staffGrp);
      }

      var staffDefs = staffGrp.getElementsByTagName("staffDef");
      var staffDef = null;
      for (let sd of staffDefs) {
        if (sd.getAttribute("n")==n) {
          staffDef = sd;
          break;
        }
      }

      if (staffDef === null) {
        staffDef = xmlDoc.createElement("staffDef");
        staffDef.setAttribute("n", n);
        staffGrp.appendChild(staffDef);
      }

      if (this.count > 0) {
        staffDef.setAttribute("key.sig", this.count.toString() + this.flatOrSharp);
      }
      
      var newXmlStr = s.serializeToString(xmlDoc);

      return newXmlStr
    },
    updateResultXml() {
        this.resultXml = this.updateScoreDef();
        console.log(this.resultXml)
    }
  },
  data() {
    return {
        selectedTask: {},
        noClefToggle: false,
        count: 0,
        useFlat: false,
        useSharp: false,
        noKeyToggle: false,
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