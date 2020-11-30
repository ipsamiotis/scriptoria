<template>
    <div class="verovio-viewer">
        VEROVIO
    </div>
</template>

<script>
import { reactive } from 'vue'
export default {
    name: "VerovioViewer",
    props: {
        taskType: {
            type: String,
            require: true,
            default: ""

        },
        sliceFile: {
            type: String,
            required: true,
            default: ""
        }
    },

    setup() {
        const state = reactive({
            verovio: require( 'verovio' ),
            fs: require( 'fs' )
        })

        function initializeVerovio() {
            /* create the toolkit instance */
            var vrvToolkit = new state.verovio.toolkit();
            /* read the MEI file */
            let mei = state.fs.readFileSync("@/assets/verification/var4_m33-34-35.mei");
            /* load the MEI data as string into the toolkit */
            vrvToolkit.loadData(mei.toString());
            /* render the fist page as SVG */
            let svg = vrvToolkit.renderToSVG(1, {});
            /* save the SVG into a file */
            state.fs.writeFileSync("hello.svg", svg);
        }



        return {
            state,
            initializeVerovio
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