<template>
  <div class="task" style="margin-bottom: 80px;">
    <div class="task-header">
      <h2 style="margin-left: 48px;">Time Recognition</h2>
    <HelpPopup>
      <img style="width: 50%;" src="@/assets/tutorial_gifs/timerec.gif">
      <p>Time signatures usually appear at the beginning of a measure, so only focus on this area.</p>
      <p>If you see a C, or a striked C, use the respective toggles.</p>
      <p>Otherwise, if you see a time signature with numbers, you may use one of the quick buttons for common signatures, or fill it in yourself.</p>
      <p>If you don't see any time signature, just click the "None" toggle</p>
      <p>In case you don't understand what to do, or the task is malfunctioning, you may skip it with the "skip" button at the bottom right.</p>
      <p>When done, you can click "Confirm"!</p>
    </HelpPopup>
    </div>
    <div class="task-items">
      <SliceViewer :slice-file="selectedTask.image_path"/>
    </div>
    <div class="task-input" >
      <span class="btn-group">
      <ToggleButton :disabled=submitted @click="setNoTime();updateResultXml()" class="btn" v-model="noTimeToggle" onLabel="None" offLabel="None"/>
      <ToggleButton :disabled="submitted || noTimeToggle" @click="setCommonTime();updateResultXml()" class="btn" v-model="commonTime" onIcon="common-time-icon" offIcon="common-time-icon"/>
      <ToggleButton :disabled="submitted || noTimeToggle" @click="setCutCommonTime();updateResultXml()" class="btn" v-model="cutCommonTime" onIcon="cut-common-time-icon" offIcon="cut-common-time-icon"/>
      </span>

      <span class="btn-group">
      <Button class="btn p-button-outlined" :disabled="submitted || disabled" v-for="ratio of commonSignatures" v-bind:key="ratio" @click="setRatio(ratio.upper, ratio.lower)">
        <div class="frac">
          <span>{{this.fontMap[`${ratio.upper}`]}}</span>
          <span class="symbol">/</span>
          <span class="bottom">{{this.fontMap[`${ratio.lower}`]}}</span>
        </div>
      </Button>
      </span>
      
      <div class="ratio" style="display: inline-block;">
        <InputNumber class="nmb" :disabled="submitted || disabled" v-model="upper" showButtons  :min=1 />
        <Divider class="divider"/>
        <InputNumber class="nmb" :disabled="submitted || disabled" v-model="lower" showButtons   :min=1 />
      </div>

    </div>
    <SubmitButton @submitted=disableUI :buttonDisabled="!canSubmit" :taskID="sliceId" :resultXml="resultXml"/>

  </div>
</template>

<script>
import {useRoute} from 'vue-router';

import axios from 'axios'

import SliceViewer from "@/components/SliceViewer"
import InputNumber from "primevue/inputnumber"
import Divider from 'primevue/divider';
import SubmitButton from "@/components/SubmitButton";
import ToggleButton from 'primevue/togglebutton';
import {settings} from "@/scripts/Settings";
import Button from 'primevue/button';
import HelpPopup from "@/components/HelpPopup"

export default {
  name: "TimeRecognition",
  components: {
    SliceViewer,
    InputNumber,
    Divider,
    SubmitButton,
    Button,
    ToggleButton,
    HelpPopup
  },
  watch: { 
    upper: function() {
      this.updateResultXml();
    },
    lower: function() {
      this.updateResultXml();
    }
  },
computed: {
    canSubmit() {
      return true;
    },
    taskId() {
      const route = useRoute();
      return route.params.taskId
    },
    disabled() {
      return this.commonTime || this.cutCommonTime || this.noTimeToggle;
    }
  },
  methods: {
    setNoTime() {
      this.cutCommonTime = false;
      this.commonTime = false;
    },
    setCommonTime() {
      this.cutCommonTime = false;
      this.noTimeToggle = false;
    },
    setCutCommonTime() {
      this.commonTime = false;
      this.noTimeToggle = false;
    },
    disableUI() {
      this.submitted = true;
      this.$forceUpdate();
    },
    // TODO: move to verovio helper somehow
    updateScoreDef() {
      var parser = new DOMParser();
      var s = new XMLSerializer();
      var xmlDoc = parser.parseFromString(this.selectedTask.xml, "text/xml");

      var elements = xmlDoc.getElementsByTagName("measure");
      var n = xmlDoc.getElementsByTagName("staff")[0].getAttribute("n");

      if (this.noTimeToggle) {
          for (let sd of xmlDoc.getElementsByTagName("staffDef")) {
            if (sd.getAttribute("n")==n) {
              sd.removeAttribute("meter.sym");
              sd.removeAttribute("meter.count");
              sd.removeAttribute("meter.unit");
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

      if (this.commonTime) {
        staffDef.setAttribute("meter.sym", "common");
      } else if (this.cutCommonTime) {
        staffDef.setAttribute("meter.sym", "cut");
      } else {
        staffDef.setAttribute("meter.count", this.upper.toString());
        staffDef.setAttribute("meter.unit", this.lower.toString());
      }
      
      
      var newXmlStr = s.serializeToString(xmlDoc);

      return newXmlStr
    },
    updateResultXml() {
      this.resultXml = this.updateScoreDef();
      console.log(this.resultXml)
    },
    setRatio(upper, lower) {
      this.upper = upper;
      this.lower = lower;
    }
  },
  data() {
    return {
        selectedTask: {},
        fontMap: {  // These are from the Bravura font, you'll need some sort of unicode viewer to see the symbols
            "0": "",
            "1": "",
            "2": "",
            "3": "",
            "4": "",
            "5": "",
            "6": "",
            "7": "",
            "8": "",
            "9": "",
        },
        resultXml: "",
        upper: 1,
        lower: 1,
        commonTime: false,
        noTimeToggle: false,
        cutCommonTime: false,
        commonSignatures: [
          {upper: 2, lower: 4}, 
          {upper: 3, lower: 4},
          {upper: 6, lower: 8}
        ],
        sliceId: "",
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


  @font-face {
  font-family: "Bravura";
  src: url("../assets/fonts/Bravura.otf") format("opentype");
  }

.common-time-icon {
    background: url("../assets/icons/common_time.png");
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;
    height: 70%;
    width: 70%;
    position: relative;
}
.cut-common-time-icon {
    background: url("../assets/icons/cut_time.png");
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;
    height: 90%;
    width: 90%;
    position: relative;
}

.p-inputnumber-input {
  width: 32px;
  height: 28px;
}

.p-button.p-inputnumber-button {
  width: 24px;
  height: 14px;
}
</style>

<style lang="scss" scoped>
  .btn {
    justify-content: center;
    margin: 0px 4px;
    width: 64px;
    height: 64px;
  }
  .nmb {
    margin-left: auto;
    margin-right: auto;
    width: 32px;
    margin-top: 0px;
    margin-bottom: 0px;
  }

  .divider {
    @extend .nmb;
    margin-top: 3px;
    margin-bottom: 4px;
  }
  .divider  > * {
        border-color: black;
border-width: 2px;
  }


  .btn > * {
    padding: 3px;
    height: 56px;
  }

  .btn-group {
    margin-left: 4px;
    margin-right: 4px;
  }

  .ratio {
      width: 64px;
  }

  .frac {
    // display: inline-block;
    position: relative;
    // vertical-align: middle; 
    // letter-spacing: 0.001em;
    font-size: 32px;
    color: black;
    text-align: center;
    font-family: "Bravura";
    line-height:0.8 ;
    }
.frac > span { display: block; }
.frac span.bottom {border-top: thin solid black;}
.frac span.symbol {display: none;}
</style>