<template>
    <div v-html="state.svg"/>
</template>

<script>
import verovio from 'verovio'
import { reactive, onBeforeMount } from 'vue';

export default {
    name: "VerovioLoader",
    props: {
        taskID: {
            type: String,
            required: true,
            default: ""
        },
        measureSnippet: {
            type: String,
            required: true,
            default: `<section><measure label="41" n="41" xml:id="measure_80f64356-6e27-4a3b-a4d2-286d551012ad"><staff facs="#zone_8bfc7fe1-c5d5-44f0-a850-8e6193e75e77" label="6" n="6" xml:id="staff_8d881556-70dd-40c9-a476-ec5d03553a9e"><layer><clef xmlns="http://www.w3.org/1999/xhtml" shape="G" line="2"></clef></layer></staff></measure></section>`
        },
        context: {
            type: String,
            required: true,
            default: `<mei xmlns="http://www.music-encoding.org/ns/mei">\n  <meiHead>\n    <fileDesc>\n      <titleStmt>\n        <title/>\n      </titleStmt>\n      <pubStmt/>\n    </fileDesc>\n    <encodingDesc>\n      <appInfo>\n        <application isodate="2021-02-08T13:35:24" version="1.0.0">\n          <name>MeasureDetector</name>\n          <p>Measures detected with MeasureDetector</p>\n        </application>\n      </appInfo>\n    </encodingDesc>\n  </meiHead>\n  <music>\n    \n    <body>\n            <mdiv label="" n="1" xml:id="mdiv_bf42562f-b50d-4928-9efd-ce26cbca39cd"><score><scoreDef><staffGrp><staffDef lines="5" n="1"/></staffGrp></scoreDef><PUT_TASK_XML_HERE/></score></mdiv></body>\n  </music>\n</mei><measure right="end" n="2" type="m-2">`
        }
    },
    setup (props) {

        const state = reactive({
            svg: '',
            options: {
                pageHeight: 900,
                pageWidth: 300,
                adjustPageHeight: true
            }
        })

        onBeforeMount(() => {
            verovio.module.onRuntimeInitialized = function () {
                let vrvToolkit = new verovio.toolkit();
                vrvToolkit.setOptions(state.options)

                let mei = props.context.replaceAll("<PUT_TASK_XML_HERE/>", props.measureSnippet)
                console.log(mei)

                vrvToolkit.loadData(mei);

                state.svg = vrvToolkit.renderToSVG(1, {});
            }
        })

        return {
            state
        }
    }
}
</script>

<style lang="scss" scoped>

</style>