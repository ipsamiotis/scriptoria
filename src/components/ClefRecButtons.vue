<template>
    <div id="button-group">
        <button id="btn-1" class="btn-toggle__inactive" @click="toggleButtons('no-clef', $event)">
            <div id="no-clef">
                No Clef
            </div>
        </button>
        <button id="btn-2" class="btn-toggle__inactive" @click="toggleButtons('g-clef', $event)">
            <img id="g-clef" src="@/assets/icons/G-clef.svg">
        </button>
        <button id="btn-3" class="btn-toggle__inactive" @click="toggleButtons('f-clef', $event)">
            <img id="f-clef" src="@/assets/icons/FClef.svg" alt="">
        </button>
        <button id="btn-4" class="btn-toggle__inactive" @click="toggleButtons('c-clef', $event)">
            <img id="c-clef" src="@/assets/icons/CClef.svg" alt="">
        </button>
    </div>
    <button :class="state.readyButton" @click="labelSlice(true)">
        Ready
    </button>
</template>

<script>
import {reactive} from "vue"
export default {
    name: "ClefRecButtons",
    props: {
        taskType: {
            type: String,
            required: true,
            default: ""
        }
    },
    setup (props, ctx) {

        const state = reactive({
            trueText: "",
            falseText: "",
            sliceLabels: [],
            btnToggleClass: "clef-btn",
            readyButton: "ready-btn__disabled"
        })

        function toggleButtons(buttonLabel, event){
            let button = event.currentTarget

            if (button.id == "btn-1" && !state.sliceLabels.includes(button.className) && button.className != "btn-toggle__disabled" && button.className != "btn-toggle__active"){
                console.log(state.sliceLabels)
                state.sliceLabels.push(buttonLabel)
                button.className = "btn-toggle__active"
                state.readyButton = "ready-btn__active"
                while(document.getElementsByClassName("btn-toggle__inactive").length > 0){
                    document.getElementsByClassName("btn-toggle__inactive")[0].className = 'btn-toggle__disabled'
                }
                console.log(button.className)
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

        function labelSlice(label){
            if (state.readyButton == "ready-btn__active") {
                ctx.emit('need-slice', label, state.sliceLabels)
                refreshButtons()
            }
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
</style>