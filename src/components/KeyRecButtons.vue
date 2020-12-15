<template>
    <link href="https://unpkg.com/primevue/resources/themes/saga-blue/theme.css " rel="stylesheet">
    <link href="https://unpkg.com/primeicons/primeicons.css " rel="stylesheet">
    <div id="button-group">
        <button id="no-key" class="btn-toggle__inactive" @click="toggleButtons('no-key', $event)">
            No Signature
        </button>
        <button id="sharp" class="btn-toggle__inactive" @click="toggleButtons('sharp', $event)">
            <img src="@/assets/icons/Sharp.svg">
        </button>
        <button id="flat" class="btn-toggle__inactive" @click="toggleButtons('flat', $event)">
            <img src="@/assets/icons/Flat.png">
        </button>
        <button id="natural" class="btn-toggle__inactive" @click="toggleButtons('natural', $event)">
            <img src="@/assets/icons/Natural_sign.png">
        </button>
        <label for="nominator">Amount</label>
        <input v-model.number="state.amountElements" type="number" :disabled="state.disabledInput" style="width:3rem; height:3rem" :min="0" :max="79">
    </div>
    <button :class="state.readyButton" @click="labelSlice(true)">
        Ready
    </button>
</template>

<script>
import {reactive, watch} from "vue"

export default {
    name: "TimeRecButtons",
    props: {
        taskType: {
            type: String,
            required: true,
            default: ""
        }
    },
    components: {
    },
    setup (props, ctx) {

        const state = reactive({
            amountElements: 0,
            disabledInput: false,
            sliceLabels: "",
            readyButton: "ready-btn__disabled"
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
                    if (!["", 0].includes(state.amountElements) && state.sliceLabels == "") {
                        state.sliceLabels = `${state.amountElements}`
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
                ctx.emit('need-slice', label, state.sliceLabels)
                refreshButtons()
            }
        }

        function refreshButtons() {
            document.getElementById("no-key").className = "btn-toggle__inactive"
            document.getElementById("sharp").className = "btn-toggle__inactive"
            document.getElementById("flat").className = "btn-toggle__inactive"
            document.getElementById("natural").className = "btn-toggle__inactive"
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
</style>