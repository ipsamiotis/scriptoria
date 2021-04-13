<template>
  <div id="svg-viewer">
    <div v-html="this.getSvg()"/>
    <ProgressSpinner v-if="loading" :style="this.spinnerStyle" strokeWidth="3" fill="#EEEEEE" />
  </div>
</template>

<script>
import {VerovioHelper} from "@/scripts/VerovioHelper";
import ProgressSpinner from "primevue/progressspinner"

export default {
  name: "VerovioLoader",
  components: {ProgressSpinner},
  emits: ['svg-updated'],
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
  watch: { 
    measureSnippet: function() {
      this.updateSvg();
    }
  },
  data() {
    return {
      currentSvg: `<svg style="width:0px; height:0px;"/>`,
      loading: true
    }
  },
  computed: {
    mei() {
      return this.context.replaceAll("<PUT_TASK_XML_HERE/>", this.measureSnippet)
    },
    spinnerStyle () {
      return `width:${VerovioHelper.options.pageWidth}px; height:${VerovioHelper.options.pageHeight}px;`
    }
  },
  methods: {
    /**
     * A method instead of computed as the toolkit is not reactive.
     */
    updateSvg() {
      if (VerovioHelper.loaded) {
          this.loading = false;
          this.currentSvg = VerovioHelper.getSvgFromMei(this.mei);
          this.$nextTick(() => {
            this.$emit("svg-updated");
          });
      }
    },
    // For some reason it has to be a method in order to work in the v-html attribute
    getSvg() {
      return this.currentSvg;
    }
  },
  mounted() {
    VerovioHelper.init().then(() => {
      // NOTE: Verovio actually freezes the entire page until it finally loads, it's definitely not caused by this here 
      return VerovioHelper.initPromise
    }).then(() => {this.updateSvg();})
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