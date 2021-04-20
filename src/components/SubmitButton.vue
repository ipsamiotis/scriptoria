<template>
<div style="padding: 12px;">
  <Button v-if="this.buttonDisabled || this.disableOverride" disabled="true" class="submit-button-disabled">{{confirmText}}</Button>
  <Button v-else class="submit-button" @click=submit>{{confirmText}}</Button>
  </div>
</template>

<script>

import axios from 'axios'
import Button from 'primevue/button';
import {settings} from "@/scripts/Settings";

export default {
  name: "SubmitButton",
  emits: ["submitted"],
  components: {Button},
  props: {
    taskID: {
      type: String,
      required: true,
      default: ""
    },
    resultXml: {
      type: String,
      required: true,
      default: ""
    },
    buttonDisabled: {
        type: Boolean,
        required: false,
        default: false
    }
  },
  data () {
      return {
          disableOverride: false,
          confirmText: "Confirm"
      }
  },
  methods: {
    submit() {
        console.log("Submitting result: ", this.resultXml);
        axios.post(`${settings.apiUrl}/${this.taskID}`, this.resultXml);
        window.parent.postMessage('submit', '*');
        this.$emit("submitted");
        this.confirmText = "Submitted";
        this.disableOverride = true;
    }
  }
}
</script>

<style lang="scss" scoped>
.submit-button {
    background: rgb(114, 226, 123);
    width: 256px;
    height: 64px;
    justify-content: center;
    font-weight: bold;
    color: white;
    font-size: 20pt;
}

.submit-button-disabled {
    background: rgb(117, 64, 21);
    width: 256px;
    height: 64px;
    justify-content: center;
    font-weight: bold;
    color: gray;
    font-size: 20pt;
}
.p-button :hover {
    background: rgb(117, 64, 21);
    width: 256px;
    height: 64px;
    justify-content: center;
    font-weight: bold;
    color: gray;
    font-size: 20pt;
}
</style>