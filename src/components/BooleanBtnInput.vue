<template>
    <button v-if="taskType" id="input__true" @click="labelSlice(true)">{{state.trueText}}</button>
    <button v-if="taskType" id="input__false" @click="labelSlice(false)">{{state.falseText}}</button>
</template>

<script>
import {reactive, onUpdated} from "vue"
export default {
    name: "BooleanBtnInput",
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
            thereIsArtefact: false
        })

        onUpdated(() => {
            changeBtnTxt()
        })

        function changeBtnTxt(){
            if (props.taskType == "clef_detection") {
                state.trueText = "Yes, there is a clef"
                state.falseText = "No, there is no clef"
            }
        }

        function labelSlice(label){
            state.thereIsArtefact = label
            ctx.emit('need-slice', true, state.thereIsArtefact)
        }

        return {
            state,
            changeBtnTxt,
            labelSlice
        }
    }
}
</script>

<style lang="scss" scoped>
    #input__true {
        padding: 5px 20px;
        margin: auto 0;
        border-radius: 5px;
        border: 2px solid #7DE895;
        background-color: white;
        color: black;
        font-weight: bold;
    }
    #input__false {
        padding: 5px 20px;
        margin: auto 0;
        border-radius: 5px;
        border: 2px solid salmon;
        background-color: white;
        color: black;
        font-weight: bold;
    }
</style>