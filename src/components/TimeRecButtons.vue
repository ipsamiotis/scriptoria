<template>
    <link href="https://unpkg.com/primevue/resources/themes/saga-blue/theme.css " rel="stylesheet">
    <link href="https://unpkg.com/primeicons/primeicons.css " rel="stylesheet">
    <div id="button-group">
        <label for=""></label>
        <button id="btn-1" class="btn-toggle__inactive" @click="toggleButtons('no-time', $event)">
            <div id="no-time">
                No Signature
            </div>
        </button>
        <label for="nominator">Upper</label>
        <input v-model.number="state.nominator" type="number" :disabled="state.disabledInput" style="width:3rem; height:3rem" :min="0" :max="79">
        <label for="denominator">Lower</label>
        <input v-model.number="state.denominator" type="number" :disabled="state.disabledInput" style="width:3rem; height:3rem" :min="0" :max="16">
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
            nominator: 0,
            denominator: 0,
            disabledInput: false,
            sliceLabels: "",
            readyButton: "ready-btn__disabled"
        })

        watch(
            () => [state.nominator, state.denominator],
            ([nominator, denominator], [prevnominator, prevdenominator]) => {
                if (nominator != prevnominator ) {
                    toggleButtons(nominator)
                } else if (denominator != prevdenominator) {
                    toggleButtons(denominator)
                }
            }
        )

        function toggleButtons(buttonLabel, event){
            if (typeof event !== 'undefined') {
                let button = event.currentTarget

                if (button.id == "btn-1" && button.className == "btn-toggle__inactive"){
                    state.sliceLabels = buttonLabel
                    button.className = "btn-toggle__active"
                    state.readyButton = "ready-btn__active"
                    state.disabledInput = true
                } else if (button.className == "btn-toggle__active" && state.sliceLabels.includes(buttonLabel)) {
                    state.sliceLabels = ""
                    button.className = "btn-toggle__inactive"
                    if (document.getElementsByClassName("btn-toggle__active").length == 0) {
                        state.readyButton = "ready-btn__disabled"
                        state.disabledInput = false
                    }
                }
            } else {
                if (buttonLabel != 0) {
                    document.getElementById("btn-1").className = "btn-toggle__disabled"
                    if (!["", 0].includes(state.nominator) && !["", 0].includes(state.denominator) && state.sliceLabels == "") {
                        state.sliceLabels = `${state.nominator}/${state.denominator}`
                        state.readyButton = "ready-btn__active"
                    }
                } else if (["", 0].includes(buttonLabel)) {
                    state.sliceLabels = ""
                    state.readyButton = "ready-btn__disabled"
                    if (["", 0].includes(state.nominator) && ["", 0].includes(state.denominator)) {
                        document.getElementById("btn-1").className = "btn-toggle__inactive"
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
            document.getElementById("btn-1").className = "btn-toggle__inactive"
            state.disabledInput = false
            state.nominator = 0
            state.denominator = 0
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