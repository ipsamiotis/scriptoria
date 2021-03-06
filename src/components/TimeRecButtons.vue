<template>
  <link href="https://unpkg.com/primevue/resources/themes/saga-blue/theme.css " rel="stylesheet">
  <link href="https://unpkg.com/primeicons/primeicons.css " rel="stylesheet">
  <div id="button-group">
    <label for=""></label>
    <button id="btn-1" class="btn-toggle__inactive" @click="toggleButtons('', $event)">
      <div id="no-time">
        No Signature
      </div>
    </button>
    <button id="btn-2" class="btn-toggle__inactive" @click="toggleButtons(state.commontime, $event)">
      <img id="common" src="@/assets/icons/common_time.svg">
    </button>
    <button id="btn-3" class="btn-toggle__inactive" @click="toggleButtons(state.cutcommontime, $event)">
      <img id="cut" src="@/assets/icons/cut_time.svg" alt="">
    </button>
    <label for="nominator">Upper</label>
    <input v-model.number="state.nominator" type="number" :disabled="state.disabledInput"
           style="width:3rem; height:2rem" :min="0" :max="79">
    <label for="denominator">Lower</label>
    <input v-model.number="state.denominator" type="number" :disabled="state.disabledInput"
           style="width:3rem; height:2rem" :min="0" :max="16">
  </div>
  <button :class="state.confirmButton" @click="labelSlice(state.sliceLabels)">
    {{ state.confirmBtnTxt }}
  </button>
</template>

<script>
import {reactive, watch, onMounted} from "vue"

import axios from 'axios'

export default {
  name: "TimeRecButtons",
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
      nominator: 0,
      denominator: 0,
      disabledInput: false,
      sliceLabels: "",
      confirmButton: "confirm-btn__disabled",
      confirmBtnTxt: "Confirm",
      commontime: "common",
      cutcommontime: "cut"
    })

    onMounted(() => {
      refreshButtons()
    })

    watch(
        () => [state.nominator, state.denominator],
        ([nominator, denominator], [prevnominator, prevdenominator]) => {
          if (nominator !== prevnominator) {
            toggleButtons(nominator)
          } else if (denominator !== prevdenominator) {
            toggleButtons(denominator)
          }
        }
    )

    function toggleButtons(buttonLabel, event) {
      if (typeof event !== 'undefined') {
        let button = event.currentTarget

        if (button.className === "btn-toggle__inactive") {
          state.sliceLabels = buttonLabel
          button.className = "btn-toggle__active"
          state.confirmButton = "confirm-btn__active"
          state.disabledInput = true
          while (document.getElementsByClassName("btn-toggle__inactive").length > 0) {
            document.getElementsByClassName("btn-toggle__inactive")[0].className = 'btn-toggle__disabled'
          }
        } else if (button.className === "btn-toggle__active" && state.sliceLabels === buttonLabel) {
          state.sliceLabels = ""
          button.className = "btn-toggle__inactive"
          while (document.getElementsByClassName("btn-toggle__disabled").length > 0 && document.getElementsByClassName("btn-toggle__active").length == 0) {
            document.getElementsByClassName("btn-toggle__disabled")[0].className = 'btn-toggle__inactive'
          }
          if (document.getElementsByClassName("btn-toggle__active").length === 0) {
            state.confirmButton = "confirm-btn__disabled"
            state.disabledInput = false
          }
        }
      } else {
        if (buttonLabel !== 0) {
          document.getElementById("btn-1").className = "btn-toggle__disabled"
          document.getElementById("btn-2").className = "btn-toggle__disabled"
          document.getElementById("btn-3").className = "btn-toggle__disabled"
          if (!["", 0].includes(state.nominator) && !["", 0].includes(state.denominator) && state.sliceLabels === "") {
            state.sliceLabels = `${state.nominator}/${state.denominator}`
            state.confirmButton = "confirm-btn__active"
          }
        } else if (["", 0].includes(buttonLabel)) {
          state.sliceLabels = ""
          state.confirmButton = "confirm-btn__disabled"
          if (["", 0].includes(state.nominator) && ["", 0].includes(state.denominator)) {
            document.getElementById("btn-1").className = "btn-toggle__inactive"
            document.getElementById("btn-2").className = "btn-toggle__inactive"
            document.getElementById("btn-3").className = "btn-toggle__inactive"
          }
        }
      }
    }

    function labelSlice(label) {
      console.log(props.taskID)
      if (state.confirmButton === "confirm-btn__active") {
        let xmlSnippet = injectTime(label, props.xml)
        axios.post(`http://localhost:443/${props.taskID}`, xmlSnippet)
            .then(response => this.labelId = response.data.id);
        document.getElementById("btn-1").className = "btn-toggle__disabled"
        document.getElementById("btn-2").className = "btn-toggle__disabled"
        document.getElementById("btn-3").className = "btn-toggle__disabled"
        state.disabledInput = true
        state.confirmBtnTxt = "Submitted"
        state.confirmButton = "confirm-btn__submitted"
      }
    }

    function injectTime(time, xmlString) {
      console.log(xmlString)
      var parser = new DOMParser();
      var xmlDoc = parser.parseFromString(xmlString, "text/xml");

      if (time !== '') {
        // find measure and append before
        var elements = xmlDoc.getElementsByTagName("measure");
        var node = xmlDoc.createElement("scoreDef");
        if (state.nominator !== 0 || state.denominator.toString() !== 0) {
          node.setAttribute("meter.count", state.nominator.toString());
          node.setAttribute("meter.unit", state.denominator.toString());
        } else {
          node.setAttribute("meter.sym", state.sliceLabels);
        }
        xmlDoc.documentElement.insertBefore(node, elements[0]);
      }
      var s = new XMLSerializer();
      var newXmlStr = s.serializeToString(xmlDoc);

      return newXmlStr
    }

    function refreshButtons() {
      document.getElementById("btn-1").className = "btn-toggle__inactive"
      state.disabledInput = false
      state.nominator = 0
      state.denominator = 0
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
  line-height: 60px;
  box-sizing: border-box;
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
  line-height: 60px;
  box-sizing: border-box;
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
  line-height: 60px;
  box-sizing: border-box;
}

#common {
  height: 30px;
  display: block;
}

#cut {
  height: 30px;
  display: block;
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