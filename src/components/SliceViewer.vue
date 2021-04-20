<template>
  <img v-if="sliceFile" :style="this.sliceStyle" :src="require(`@/assets${sliceFile}`)">
  <!-- sliceType: measures, lines, pages -> @/assets/omr_files/slices/sliceType/sliceFile -->
</template>

<script>
import {VerovioHelper} from "@/scripts/VerovioHelper";

export default {
  name: "SliceViewer",
  props: {
    sliceFile: {
      type: String,
      required: true,
      default: ""
    }
  },
  computed: {
    sliceStyle () {
      return `height:${VerovioHelper.options.pageHeight * (VerovioHelper.options.scale / 100)}px;`
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