<template>
    <div v-html="state.svg"/>
</template>

<script>
import verovio from 'verovio'
import { reactive, onMounted } from 'vue';

export default {
    setup () {

        const state = reactive({
            svg: ''
        })

        onMounted(() => {
            // loadMEI()
            verovio.module.onRuntimeInitialized = function () {
                var vrvToolkit = new verovio.toolkit();
                /* read the MEI file */
                var mei = `<mei xmlns="http://www.music-encoding.org/ns/mei">\n  <meiHead>\n    <fileDesc>\n      <titleStmt>\n        <title/>\n      </titleStmt>\n      <pubStmt/>\n    </fileDesc>\n    <encodingDesc>\n      <appInfo>\n        <application isodate="2021-02-08T13:35:24" version="1.0.0">\n          <name>MeasureDetector</name>\n          <p>Measures detected with MeasureDetector</p>\n        </application>\n      </appInfo>\n    </encodingDesc>\n  </meiHead>\n  <music>\n    \n    <body>\n            <mdiv label="" n="1" xml:id="mdiv_bf42562f-b50d-4928-9efd-ce26cbca39cd"><score><scoreDef><staffGrp><staffDef lines="5" n="1"/></staffGrp></scoreDef><section><staff n="1">
                            <layer>
                            <!-- <clef xmlns="http://www.w3.org/1999/xhtml" shape="G" line="2"></clef> -->
                            <note dur="8" oct="4" pname="c"/>
                            <note dur="8" oct="4" pname="c"/>
                            <clef xmlns="http://www.w3.org/1999/xhtml" shape="F" line="4"></clef>
                            </layer>
                        </staff>
                        </measure></section></score></mdiv></body>\n  </music>\n</mei><measure right="end" n="2" type="m-2">`
                /* load the MEI data as string into the toolkit */
                vrvToolkit.loadData(mei.toString());
                /* render the fist page as SVG */
                state.svg = vrvToolkit.renderToSVG(1, {});
                /* save the SVG into a file */
                // fs.writeFileSync("hello.svg", svg);
                console.log(state.svg)
            }
        })

        // function loadMEI() {

        // }

        return {
            state
            // loadMEI
        }
    }
}
</script>

<style lang="scss" scoped>

</style>