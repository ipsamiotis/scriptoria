<template>
    <button v-if="taskType" id="input__true" @click="labelSlice(true)">{{state.trueText}}</button>
    <button v-if="taskType" id="input__false" @click="labelSlice(false)">{{state.falseText}}</button>
</template>

<script>
import {reactive, onUpdated} from "vue"
export default {
    name: "BooleanInput",
    // emits: ["need-slice"],
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
            falseText: ""
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
            console.log(label)
            ctx.emit('need-slice', true)
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