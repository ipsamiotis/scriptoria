<template>
    <div>
        <textarea v-model="message" placeholder=""></textarea>
    </div>
    <button :class="state.readyButton" @click="labelSlice(state.sliceLabels)">
        {{state.readyBtnTxt}}
    </button>
</template>

<script>
import {reactive, onMounted} from "vue"

import axios from 'axios'

export default {
    name: "TextNotes",
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

        function refreshButtons() {
            state.sliceLabels = []
            state.readyButton = "ready-btn__disabled"
        }

        return {
            state,
            // toggleButtons,
            labelSlice,
            refreshButtons
        }
    }
}
</script>

<style lang="scss" scoped>
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