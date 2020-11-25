<template>
    <span>Upper staff</span>
    <div class="upper-staff">
        <button id="btn-1" class="btn-toggle" @click="toggleButtons('g-clef', $event)">
            <img id="g-clef" src="@/assets/icons/G-clef.svg">
        </button>
        <button id="btn-2" class="btn-toggle" @click="toggleButtons('f-clef', $event)">
            <img id="f-clef" src="@/assets/icons/FClef.svg" alt="">
        </button>
        <button id="btn-3" class="btn-toggle" @click="toggleButtons('c-clef', $event)">
            <img id="c-clef" src="@/assets/icons/CClef.svg" alt="">
        </button>
    </div>
    <button>
        Submit
    </button>
</template>

<script>
import {reactive} from "vue"
export default {
    name: "ClefBtnInput",
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
            btnToggleClass: "clef-btn"
        })

        function toggleButtons(buttonLabel, event){
            let targetId = event.currentTarget.id;
            if (event.currentTarget.className == "btn-toggle" && !state.sliceLabels.includes()) {
                state.sliceLabels.push(buttonLabel)
                event.currentTarget.className = "btn-toggle-active"
                console.log(targetId, event.currentTarget.className)
                console.log(state.sliceLabels)
            } else {
                state.sliceLabels.splice(state.sliceLabels.indexOf(buttonLabel), 1)
                event.currentTarget.className = "btn-toggle"
                console.log(targetId, event.currentTarget.className)
                console.log(state.sliceLabels)
            }
        }

        function labelSlice(label){
            console.log(label)
            ctx.emit('need-slice', true)
        }

        return {
            state,
            toggleButtons,
            labelSlice
        }
    }
}
</script>

<style lang="scss" scoped>
    .btn-toggle {
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
    .btn-toggle-active {
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
</style>