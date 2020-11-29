<template>
    <div id="button-group">
        <button id="btn-1" class="btn-toggle__disabled" @click="toggleButtons('g-clef', $event)">
            <img id="g-clef" src="@/assets/icons/G-clef.svg">
        </button>
        <button id="btn-2" class="btn-toggle__disabled" @click="toggleButtons('f-clef', $event)">
            <img id="f-clef" src="@/assets/icons/FClef.svg" alt="">
        </button>
        <button id="btn-3" class="btn-toggle__disabled" @click="toggleButtons('c-clef', $event)">
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
            if (event.currentTarget.className == "btn-toggle__disabled" && !state.sliceLabels.includes()) {
                state.sliceLabels.push(buttonLabel)
                event.currentTarget.className = "btn-toggle__active"
                state.readyButton = "ready-btn__active"
            } else {
                state.sliceLabels.splice(state.sliceLabels.indexOf(buttonLabel), 1)
                event.currentTarget.className = "btn-toggle__disabled"
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
            document.getElementById("btn-1").className = "btn-toggle__disabled"
            document.getElementById("btn-2").className = "btn-toggle__disabled"
            document.getElementById("btn-3").className = "btn-toggle__disabled"
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
    .btn-toggle__disabled {
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
    .ready-btn__active {
        margin-top: 6px;
        border: 2px solid #cb8132;
        // border-radius: 8%;
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