<template>
    <div class="slice-viewer">
        <img :src="require(`@/assets/${taskType}/${sliceFile}`)">
    </div>
</template>

<script>
export default {
    name: "SliceViewer",
    props: {
        taskType: {
            type: String,
            require: true,
            default: "clef_detection"

        },
        sliceFile: {
            type: String,
            required: true,
            default: "p1_m1.png"
        }
    }
}
</script>

<style lang="scss" scoped>
    img {
        border-radius: 5px;
        border: 5px solid #DFE3E8;
        box-sizing: border-box;
    }
</style>