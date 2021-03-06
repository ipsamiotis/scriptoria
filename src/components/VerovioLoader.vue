<template>
  <div id="svg-viewer">
    <div v-html="state.svg" :key="state.currentMei"/>
  </div>
</template>

<script>
import verovio from 'verovio'
import {reactive, onBeforeMount, watch} from 'vue';

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
    },
    context: {
      type: String,
      required: true,
      default: `<mei xmlns="http://www.music-encoding.org/ns/mei">\n  <meiHead>\n    <fileDesc>\n      <titleStmt>\n        <title/>\n      </titleStmt>\n      <pubStmt/>\n    </fileDesc>\n    <encodingDesc>\n      <appInfo>\n        <application isodate="2021-02-08T13:35:24" version="1.0.0">\n          <name>MeasureDetector</name>\n          <p>Measures detected with MeasureDetector</p>\n        </application>\n      </appInfo>\n    </encodingDesc>\n  </meiHead>\n  <music>\n    \n    <body>\n            <mdiv label="" n="1" xml:id="mdiv_bf42562f-b50d-4928-9efd-ce26cbca39cd"><score><scoreDef><staffGrp><staffDef lines="5" n="1"/></staffGrp></scoreDef><PUT_TASK_XML_HERE/></score></mdiv></body>\n  </music>\n</mei><measure right="end" n="2" type="m-2">`
    }
  },
  setup(props) {
    const state = reactive({
      svg: '',
      currentMei: '',
      options: {
        pageHeight: 1100,
        pageWidth: 400,
        adjustPageHeight: true
      }
    })
    watch(
        () => props.measureSnippet,
        () => {
          let vrvToolkit = new verovio.toolkit();
          vrvToolkit.setOptions(state.options)
          let mei = props.context.replaceAll("<PUT_TASK_XML_HERE/>", props.measureSnippet)
          console.log(mei)
          vrvToolkit.loadData(mei);
          state.svg = vrvToolkit.renderToSVG(1, {});
        }
    )
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
#svg-viewer {
  border-radius: 5px;
  border: 5px solid #DFE3E8;
  box-sizing: border-box;
}

[v-cloak] + .loader::before {
  content: "Loading…"
}
</style>