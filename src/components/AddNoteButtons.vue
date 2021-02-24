<template>
    <BlockUI :blocked="state.blockedPanel">
        <div class="button-group">
            <h4>Duration: {{state.noteDurations[state.sliderValue]}}</h4>
            <div class="slider-group">
                <Slider v-model="state.sliderValue" :step="1" :min="1" :max="6" />
                <InlineMessage v-if="state.sliderMsg && state.sliderValue==0" severity="warn">Please select duration</InlineMessage>
            </div>
            <div class="dotted">
                <strong>Dot:</strong> <InputSwitch v-model="state.dotButton" />
            </div>
            <div class="note-rest">
                <Button id="noteBtn" type="button" label="Note" :badge="state.numNotes" :class="{'p-button-outlined': state.noteIsInactive, 'p-button-secondary': state.noteIsInactive}" @click="addMusicElement($event)"/>
                <Button id="restBtn" type="button" label="Rest" :badge="state.numRests" :class="{'p-button-outlined': state.restIsInactive, 'p-button-secondary': state.restIsInactive}" @click="addMusicElement($event)"/>
            </div>
        </div>
    </BlockUI>
    <ToggleButton v-model="state.finishButton" onLabel="Completed Sequence" offLabel="Finalize Sequence" onIcon="pi pi-check-circle" offIcon="pi pi-circle-off" @click="blockAndSubmit()"/>
        <!-- <div class="add-finish">
            <Button id="addElement" label="Add" icon="pi pi-plus" @click="addMusicElement($event)"/>
        </div> -->
        <!-- <textarea v-model="message" placeholder="note,note,rest,note"></textarea> -->
        <!-- <button :class="state.readyButton" @click="labelSlice(state.sliceLabels)">
            {{state.readyBtnTxt}}
        </button> -->
</template>

<script>
import {reactive} from "vue"

import axios from 'axios'

import Slider from 'primevue/slider';
import InputSwitch from 'primevue/inputswitch';
import ToggleButton from 'primevue/togglebutton';
import Button from 'primevue/button';
import InlineMessage from 'primevue/inlinemessage';
import BlockUI from 'primevue/blockui';

export default {
    name: "AddNoteButtons",
    components: {
        Slider,
        InputSwitch,
        ToggleButton,
        Button,
        InlineMessage,
        BlockUI
    } ,
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
            sliderValue: 0,
            noteDurations: ['','1','1/2','1/4','1/8', '1/16', '1/32'],
            dotButton: false,
            checkButton: false,
            numNotes: 0,
            numRests: 0,
            noteIsInactive: true,
            restIsInactive: true,
            sliderMsg: false,
            blockedPanel: false
        })

        // onMounted(() => {
        //     refreshButtons()
        // })

        function addMusicElement(event){
            let addButton = event.currentTarget

            if (addButton.id == "noteBtn") {
                if (state.sliderValue != 0) {
                    state.numNotes += 1
                    state.sliderValue = 0
                    state.dotButton = false
                    state.sliderMsg = false
                } else {
                    state.sliderMsg = true
                }
            } else if (addButton.id == "restBtn") {
                if (state.sliderValue != 0) {
                    state.numRests += 1
                    state.sliderValue = 0
                    state.dotButton = false
                    state.sliderMsg = false
                } else {
                    state.sliderMsg = true
                }
            }
        }

        function blockAndSubmit() {
            if (state.blockedPanel == false){
                state.blockedPanel = true
            } else {
                state.blockedPanel = false
            }
        }

        function labelSlice(labels){
            if (state.readyButton == "ready-btn__active") {
                let xmlSnippet = injectClef(labels, props.xml)
                axios.post(`http://localhost:443/${props.taskID}`, xmlSnippet)
                    .then(response => this.labelId = response.data.id);
                // document.getElementById("btn-1").className = "btn-toggle__disabled"
                // document.getElementById("btn-2").className = "btn-toggle__disabled"
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

        // function refreshButtons() {
        //     // document.getElementById("btn-1").className = "btn-toggle__inactive"
        //     // document.getElementById("btn-2").className = "btn-toggle__inactive"
        //     state.sliceLabels = []
        //     state.readyButton = "ready-btn__disabled"
        // }

        return {
            state,
            addMusicElement,
            labelSlice,
            blockAndSubmit
            // refreshButtons
        }
    }
}
</script>

<style lang="scss" scoped>
    .button-group {
        display: grid;
        height: 200px;
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