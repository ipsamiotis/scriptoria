<template>
  <div id="svg-viewer">
    <div v-html="this.svg()"/>
  </div>
</template>

<script>
import {VerovioHelper} from "@/scripts/VerovioHelper";

export default {
  name: "VerovioLoader",
  props: {
    measureSnippet: {
      type: String,
      required: true,
    },
    context: {
      type: String,
      required: true,
      default: `<mei xmlns="http://www.music-encoding.org/ns/mei">\n  <meiHead>\n    <fileDesc>\n      <titleStmt>\n        <title/>\n      </titleStmt>\n      <pubStmt/>\n    </fileDesc>\n    <encodingDesc>\n      <appInfo>\n        <application isodate="2021-02-08T13:35:24" version="1.0.0">\n          <name>MeasureDetector</name>\n          <p>Measures detected with MeasureDetector</p>\n        </application>\n      </appInfo>\n    </encodingDesc>\n  </meiHead>\n  <music>\n    \n    <body>\n            <mdiv label="" n="1" xml:id="mdiv_bf42562f-b50d-4928-9efd-ce26cbca39cd"><score><scoreDef><staffGrp><staffDef lines="5" n="1"/></staffGrp></scoreDef><PUT_TASK_XML_HERE/></score></mdiv></body>\n  </music>\n</mei><measure right="end" n="2" type="m-2">`
    },
  },
  computed: {
    mei() {
      return this.context.replaceAll("<PUT_TASK_XML_HERE/>", this.measureSnippet)
    },
  },
  methods: {
    /**
     * A method instead of computed as the toolkit is not reactive.
     */
    svg() {
      return VerovioHelper.getSvgFromMei(this.mei);
    }
  },

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