<template>
  <link href="https://unpkg.com/primevue/resources/themes/saga-blue/theme.css " rel="stylesheet">
  <link href="https://unpkg.com/primeicons/primeicons.css " rel="stylesheet">
  <div id="button-group">
    <button id="no-key" class="btn-toggle__inactive" @click="toggleButtons('', $event)">
      No Signature
    </button>
    <button id="sharp" class="btn-toggle__inactive" @click="toggleButtons(state.sharp, $event)">
      <img src="@/assets/icons/Sharp.svg">
    </button>
    <button id="flat" class="btn-toggle__inactive" @click="toggleButtons(state.flat, $event)">
      <img src="@/assets/icons/Flat.png">
    </button>
    <!-- <button id="natural" class="btn-toggle__inactive" @click="toggleButtons(state.natural, $event)">
        <img src="@/assets/icons/Natural_sign.png">
    </button> -->
    <label for="amountElements">Amount</label>
    <input v-model.number="state.amountElements" type="number" :disabled="state.disabledInput"
           style="width:3rem; height:3rem" :min="0" :max="79">
  </div>
  <button :class="state.confirmButton" @click="labelSlice(state.sliceLabels)">
    {{ state.confirmBtnTxt }}
  </button>
</template>

<script>
import {reactive, watch, onMounted} from "vue"

import axios from 'axios'

export default {
  name: "KeyRecButtons",
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
  components: {},
  setup(props) {

    const state = reactive({
      amountElements: 0,
      disabledInput: false,
      sliceLabels: "",
      confirmButton: "confirm-btn__disabled",
      confirmBtnTxt: "Confirm",
      sharp: "s",
      flat: "f",
      natural: "0"
    })

    onMounted(() => {
      refreshButtons()
    })

    watch(
        () => state.amountElements,
        (amountElements, prevamountElements) => {
          if (amountElements != prevamountElements) {
            toggleButtons(amountElements)
          }
        }
    )

    function toggleButtons(buttonLabel, event) {
      console.log(buttonLabel)
      if (typeof event !== 'undefined') {
        let button = event.currentTarget

        if (button.id == "no-key" && button.className == "btn-toggle__inactive") {
          state.sliceLabels = buttonLabel
          button.className = "btn-toggle__active"
          state.confirmButton = "confirm-btn__active"
          state.disabledInput = true
          while (document.getElementsByClassName("btn-toggle__inactive").length > 0) {
            document.getElementsByClassName("btn-toggle__inactive")[0].className = 'btn-toggle__disabled'
          }
        } else if (button.id != "no-key" && button.className == "btn-toggle__inactive") {
          state.sliceLabels = buttonLabel
          button.className = "btn-toggle__active"
          while (document.getElementsByClassName("btn-toggle__inactive").length > 0) {
            document.getElementsByClassName("btn-toggle__inactive")[0].className = 'btn-toggle__disabled'
          }
        } else if (button.className == "btn-toggle__active") {
          state.sliceLabels = ""
          button.className = "btn-toggle__inactive"
          while (document.getElementsByClassName("btn-toggle__disabled").length > 0
          && document.getElementsByClassName("btn-toggle__active").length == 0) {
            document.getElementsByClassName("btn-toggle__disabled")[0].className = 'btn-toggle__inactive'
          }
          if (document.getElementsByClassName("btn-toggle__active").length == 0) {
            state.confirmButton = "confirm-btn__disabled"
            state.disabledInput = false
          }
        }
      } else {
        if (buttonLabel != 0) {
          if (!["", 0].includes(state.amountElements) && state.sliceLabels != "") {
            // state.sliceLabels = `${state.amountElements}`
            state.confirmButton = "confirm-btn__active"
          }
        } else if (["", 0].includes(buttonLabel)) {
          state.sliceLabels = ""
          state.confirmButton = "confirm-btn__disabled"
          if (["", 0].includes(state.amountElements)) {
            while (document.getElementsByClassName("btn-toggle__disabled").length > 0
            && document.getElementsByClassName("btn-toggle__active").length == 0) {
              document.getElementsByClassName("btn-toggle__disabled")[0].className = 'btn-toggle__inactive'
            }
          }
        }
      }
    }

    function labelSlice(label) {
      if (state.confirmButton == "confirm-btn__active") {
        let xmlSnippet = injectKey(label, props.xml)
        axios.post(`http://localhost:443/${props.taskID}`, xmlSnippet)
            .then(response => this.labelId = response.data.id);
        document.getElementById("no-key").className = "btn-toggle__disabled"
        document.getElementById("sharp").className = "btn-toggle__disabled"
        document.getElementById("flat").className = "btn-toggle__disabled"
        // document.getElementById("natural").className = "btn-toggle__disabled"
        state.disabledInput = true
        state.confirmBtnTxt = "Submitted"
        state.confirmButton = "confirm-btn__submitted"
      }
    }

    function injectKey(key, xmlString) {
      console.log(xmlString)
      var parser = new DOMParser();
      var xmlDoc = parser.parseFromString(xmlString, "text/xml");

      if (key != '') {
        var elements = xmlDoc.getElementsByTagName("measure");
        var n = xmlDoc.getElementsByTagName("staff")[0].getAttribute("n");



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

        staffDef.setAttribute("key.sig.show", "true")
        staffDef.setAttribute("key.sig", `${state.amountElements.toString()}${key}`);
      }

      var s = new XMLSerializer();
      var newXmlStr = s.serializeToString(xmlDoc);

      console.log(newXmlStr)

      return newXmlStr
    }

    function refreshButtons() {
      document.getElementById("no-key").className = "btn-toggle__inactive"
      document.getElementById("sharp").className = "btn-toggle__inactive"
      document.getElementById("flat").className = "btn-toggle__inactive"
      // document.getElementById("natural").className = "btn-toggle__inactive"
      state.disabledInput = false
      state.amountElements = 0
      state.sliceLabels = ""
      state.confirmButton = "confirm-btn__disabled"
    }

    return {
      state,
      toggleButtons,
      labelSlice,
      refreshButtons
    }
  }
}
</script>

<style lang="scss" scoped>
.btn-toggle__inactive {
  margin-right: 6px;
  border: 1px solid #cb8132;
  border-radius: 20%;
  background-color: white;
  cursor: pointer;

  &:hover {
    transform: scale(1.1, 1.1);
  }
}

.btn-toggle__active {
  margin-right: 6px;
  border: 2px solid #cb8132;
  border-radius: 20%;
  background-color: #eba147;
  cursor: pointer;

  &:hover {
    transform: scale(1.1, 1.1);
  }
}

.btn-toggle__disabled {
  margin-right: 6px;
  border: 2px solid #c69a6b;
  background-color: #ededed;
  border-radius: 20%;
}

#no-key {
  line-height: 60px;
  box-sizing: border-box;
}

.confirm-btn__active {
  margin-top: 6px;
  border: 2px solid #cb8132;
  background-color: #eba147;
  height: 40px;
  width: 180px;
  font-weight: bold;
  color: white;
  font-size: 11pt;
  cursor: pointer;

  &:hover {
    transform: scale(1.1, 1.1);
  }
}

.confirm-btn__disabled {
  margin-top: 6px;
  border: 2px solid #c69a6b;
  // border-radius: 8%;
  background-color: #e8c498;
  height: 40px;
  width: 180px;
  font-weight: bold;
  color: white;
  font-size: 11pt;
}

.confirm-btn__submitted {
  margin-top: 6px;
  border: 2px solid #aefcd7;
  // border-radius: 8%;
  background-color: #79e66f;
  height: 40px;
  width: 180px;
  font-weight: bold;
  color: white;
  font-size: 11pt;
}
</style>