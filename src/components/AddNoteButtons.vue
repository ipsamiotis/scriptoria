<template>
    <div class="button-group">
        <button id="btn-1" class="btn-toggle__inactive" @click="toggleButtons('', $event)">
            Note
        </button>
        <button id="btn-2" class="btn-toggle__inactive" @click="toggleButtons(state.gClef, $event)">
            Rest
        </button>
        <textarea v-model="message" placeholder="note,note,rest,note"></textarea>
    </div>
    <button :class="state.readyButton" @click="labelSlice(state.sliceLabels)">
        {{state.readyBtnTxt}}
    </button>
</template>

<script>
import {reactive, onMounted} from "vue"

import axios from 'axios'

export default {
    name: "ClefRecButtons",
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
    setup (props) {

        const state = reactive({
            sliceLabels: [],
            btnToggleClass: "clef-btn",
            readyButton: "ready-btn__disabled",
            readyBtnTxt: "Ready"
        })

        onMounted(() => {
            refreshButtons()
        })

        function toggleButtons(buttonLabel, event){
            let button = event.currentTarget

            if (button.id == "btn-1" && !state.sliceLabels.includes(button.className) && button.className != "btn-toggle__disabled" && button.className != "btn-toggle__active"){
                state.sliceLabels.push(buttonLabel)
                button.className = "btn-toggle__active"
                state.readyButton = "ready-btn__active"
                while(document.getElementsByClassName("btn-toggle__inactive").length > 0){
                    document.getElementsByClassName("btn-toggle__inactive")[0].className = 'btn-toggle__disabled'
                }
            } else if (button.id != "btn-1" && button.className != "btn-toggle__disabled" && button.className == "btn-toggle__inactive" && !state.sliceLabels.includes(buttonLabel)) {
                state.sliceLabels.push(buttonLabel)
                button.className = "btn-toggle__active"
                document.getElementById("btn-1").className = "btn-toggle__disabled"
                state.readyButton = "ready-btn__active"
            } else if (button.className == "btn-toggle__active" && state.sliceLabels.includes(buttonLabel)) {
                state.sliceLabels.splice(state.sliceLabels.indexOf(buttonLabel), 1)
                button.className = "btn-toggle__inactive"
                while(document.getElementsByClassName("btn-toggle__disabled").length > 0 //) {
                && document.getElementsByClassName("btn-toggle__active").length == 0){
                    document.getElementsByClassName("btn-toggle__disabled")[0].className = 'btn-toggle__inactive'
                }
                if (document.getElementsByClassName("btn-toggle__active").length == 0) {
                    state.readyButton = "ready-btn__disabled"
                }
            }
        }

        function labelSlice(labels){
            if (state.readyButton == "ready-btn__active") {
                let xmlSnippet = injectClef(labels, props.xml)
                axios.post(`http://localhost:443/${props.taskID}`, xmlSnippet)
                    .then(response => this.labelId = response.data.id);
                document.getElementById("btn-1").className = "btn-toggle__disabled"
                document.getElementById("btn-2").className = "btn-toggle__disabled"
                state.readyBtnTxt = "Submitted"
                state.readyButton = "ready-btn__submitted"
            }
        }

        function injectClef(clefs, xmlString){
            console.log(xmlString)
            var parser = new DOMParser();
            var xmlDoc = parser.parseFromString(xmlString, "text/xml");

            if (!clefs.includes('')) {
                for (let clef in clefs) {
                    var elements = xmlDoc.getElementsByTagName("layer");
                    var node = document.createElement("clef");
                    node.setAttribute("shape", clefs[clef].shape);
                    node.setAttribute("line", clefs[clef].line);
                    elements[0].appendChild(node)
                }
            }
            var s = new XMLSerializer();
            var newXmlStr = s.serializeToString(xmlDoc);

            return newXmlStr
        }

        function refreshButtons() {
            document.getElementById("btn-1").className = "btn-toggle__inactive"
            document.getElementById("btn-2").className = "btn-toggle__inactive"
            state.sliceLabels = []
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
    .button-group {
        // align-content: flex-start;
        // float: left;
    }
    .btn-toggle__inactive {
        margin-right: 6px;
        border: 1px solid #cb8132;
        border-radius: 20%;
        background-color: white;
        height: 60px;
        width: 55px;
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
        height: 60px;
        width: 55px;
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
        height: 60px;
        width: 55px;
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
        background-color: #79e66f;
        height: 40px;
        width: 180px;
        font-weight: bold;
        color: white;
        font-size: 11pt;
    }
</style>