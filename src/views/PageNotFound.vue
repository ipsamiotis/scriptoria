<template>
    <div>
        <strong>
            Something went horribly wrong
        </strong>
    </div>
</template>

<script>
import {reactive} from "vue"
export default {
    setup () {
        const state = reactive({
            errorMsg: "HOW DID THEY REACH THIS??"
        })
        // send something through the API?
        console.log(state.errorMsg, Date.now())

        return {
            state
        }
    }
}
</script>

<style lang="scss" scoped>

</style>