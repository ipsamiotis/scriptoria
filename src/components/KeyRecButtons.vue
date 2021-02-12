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
        <input v-model.number="state.amountElements" type="number" :disabled="state.disabledInput" style="width:3rem; height:3rem" :min="0" :max="79">
    </div>
    <button :class="state.readyButton" @click="labelSlice(state.sliceLabels)">
        {{state.readyBtnTxt}}
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
    components: {
    },
    setup (props) {

        const state = reactive({
            amountElements: 0,
            disabledInput: false,
            sliceLabels: "",
            readyButton: "ready-btn__disabled",
            readyBtnTxt: "Ready",
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
                if (amountElements != prevamountElements ) {
                    toggleButtons(amountElements)
                }
            }
        )

        function toggleButtons(buttonLabel, event){
            console.log(buttonLabel)
            if (typeof event !== 'undefined') {
                let button = event.currentTarget

                if (button.id == "no-key" && button.className == "btn-toggle__inactive"){
                    state.sliceLabels = buttonLabel
                    button.className = "btn-toggle__active"
                    state.readyButton = "ready-btn__active"
                    state.disabledInput = true
                    while(document.getElementsByClassName("btn-toggle__inactive").length > 0){
                        document.getElementsByClassName("btn-toggle__inactive")[0].className = 'btn-toggle__disabled'
                    }
                } else if (button.id != "no-key" && button.className == "btn-toggle__inactive") {
                    state.sliceLabels = buttonLabel
                    button.className = "btn-toggle__active"
                    while(document.getElementsByClassName("btn-toggle__inactive").length > 0){
                        document.getElementsByClassName("btn-toggle__inactive")[0].className = 'btn-toggle__disabled'
                    }
                } else if (button.className == "btn-toggle__active") {
                    state.sliceLabels = ""
                    button.className = "btn-toggle__inactive"
                    while(document.getElementsByClassName("btn-toggle__disabled").length > 0
                    && document.getElementsByClassName("btn-toggle__active").length == 0){
                        document.getElementsByClassName("btn-toggle__disabled")[0].className = 'btn-toggle__inactive'
                    }
                    if (document.getElementsByClassName("btn-toggle__active").length == 0) {
                        state.readyButton = "ready-btn__disabled"
                        state.disabledInput = false
                    }
                }
            } else {
                if (buttonLabel != 0) {
                    if (!["", 0].includes(state.amountElements) && state.sliceLabels != "") {
                        // state.sliceLabels = `${state.amountElements}`
                        state.readyButton = "ready-btn__active"
                    }
                } else if (["", 0].includes(buttonLabel)) {
                    state.sliceLabels = ""
                    state.readyButton = "ready-btn__disabled"
                    if (["", 0].includes(state.amountElements)) {
                        while(document.getElementsByClassName("btn-toggle__disabled").length > 0
                        && document.getElementsByClassName("btn-toggle__active").length == 0){
                            document.getElementsByClassName("btn-toggle__disabled")[0].className = 'btn-toggle__inactive'
                        }
                    }
                }
            }
        }

        function labelSlice(label){
            if (state.readyButton == "ready-btn__active") {
                let xmlSnippet = injectKey(label, props.xml)
                axios.post(`http://localhost:443/${props.taskID}`, xmlSnippet)
                    .then(response => this.labelId = response.data.id);
                document.getElementById("no-key").className = "btn-toggle__disabled"
                document.getElementById("sharp").className = "btn-toggle__disabled"
                document.getElementById("flat").className = "btn-toggle__disabled"
                // document.getElementById("natural").className = "btn-toggle__disabled"
                state.disabledInput = true
                state.readyBtnTxt = "Submitted"
                state.readyButton = "ready-btn__submitted"
            }
        }

        function injectKey(key, xmlString){
            console.log(xmlString)
            var parser = new DOMParser();
            var xmlDoc = parser.parseFromString(xmlString, "text/xml");

            if (key != '') {
                // find measure and append before
                var elements = xmlDoc.getElementsByTagName("measure");
                var node = xmlDoc.getElementsByTagName("scoreDef");
                if (node.length == 0) {
                    node = xmlDoc.createElement("scoreDef"); // create new scoreDef ONLY IF there is no pre-existing one
                    node.setAttribute("key.sig.show", "true")
                    node.setAttribute("key.sig", `${state.amountElements.toString()}${key}`);
                    // Support for natural key signatures below
                    // if (key == "0") {
                    //     node.setAttribute("key.sig.show", "true")
                    //     node.setAttribute("key.sig", "0");
                    // } else {
                    //     node.setAttribute("key.sig.show", "true")
                    //     node.setAttribute("key.sig", `${state.amountElements.toString()}${key}`);
                    // }
                    xmlDoc.documentElement.insertBefore(node, elements[0]);
                } else {
                    console.log(node)
                    node.setAttribute("key.sig.show", "true")
                    node.setAttribute("key.sig", `${state.amountElements.toString()}${key}`);
                    // if (key == "0") {
                    //     node.setAttribute("key.sig.show", "true")
                    //     node.setAttribute("key.sig", "0");
                    // } else {
                    //     node.setAttribute("key.sig.show", "true")
                    //     node.setAttribute("key.sig", `${state.amountElements.toString()}${key}`);
                    // }
                }
            }
            var s = new XMLSerializer();
            var newXmlStr = s.serializeToString(xmlDoc);

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
            state.readyButton = "ready-btn__disabled"
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

    .ready-btn__active {
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

    .ready-btn__disabled {
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

    .ready-btn__submitted {
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