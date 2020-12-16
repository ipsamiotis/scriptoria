<template>
    <div id="button-group">
        <button id="btn-1" class="btn-toggle__inactive" @click="toggleButtons('', $event)">
            <div id="no-clef">
                No Clef
            </div>
        </button>
        <button id="btn-2" class="btn-toggle__inactive" @click="toggleButtons(state.gClef, $event)">
            <img id="g-clef" src="@/assets/icons/G-clef.svg">
        </button>
        <button id="btn-3" class="btn-toggle__inactive" @click="toggleButtons(state.fClef, $event)">
            <img id="f-clef" src="@/assets/icons/FClef.svg" alt="">
        </button>
        <button id="btn-4" class="btn-toggle__inactive" @click="toggleButtons(state.cClef, $event)">
            <img id="c-clef" src="@/assets/icons/CClef.svg" alt="">
        </button>
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
            readyBtnTxt: "Ready",
            gClef: {
                "shape": "G",
                "line": "2"
            },
            fClef: {
                "shape": "F",
                "line": "4"
            },
            cClef:  {
                "shape": "C",
                "line": "3"
            },
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
                document.getElementById("btn-3").className = "btn-toggle__disabled"
                document.getElementById("btn-4").className = "btn-toggle__disabled"
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
            document.getElementById("btn-3").className = "btn-toggle__inactive"
            document.getElementById("btn-4").className = "btn-toggle__inactive"
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
        #g-clef {
            height: 30px;
        }
        #f-clef {
            height: 30px;
        }
        #c-clef {
            height: 30px;
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
        #g-clef {
            height: 30px;
        }
        #f-clef {
            height: 30px;
        }
        #c-clef {
            height: 30px;
        }
    }

    .btn-toggle__disabled {
        margin-right: 6px;
        border: 2px solid #c69a6b;
        background-color: #ededed;
        border-radius: 20%;
        height: 60px;
        width: 55px;
        #g-clef {
            height: 30px;
        }
        #f-clef {
            height: 30px;
        }
        #c-clef {
            height: 30px;
        }
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