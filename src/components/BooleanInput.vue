<template>
    <div class="user-input">
        <button id="input__true" @click="labelSlice(true)" >Yes, there is a clef</button>
        <button id="input__false" @click="labelSlice(false)">No, there is no clef</button>
    </div>
</template>

<script>
export default {
    setup (props, ctx) {

        function labelSlice(label){
            console.log(label)
            ctx.emit('need-slice', true)
        }

        return {
            labelSlice
        }
    }
}
</script>

<style lang="scss" scoped>
    .user-input {
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
    }
</style>