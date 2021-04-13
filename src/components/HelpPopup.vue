<template>
<Button   type="button" class="btn" @click="toggle" icon="pi pi-question" />
<OverlayPanel ref="op" appendTo="body" >
  <slot></slot>
</OverlayPanel>
</template>



<script>
import OverlayPanel from 'primevue/overlaypanel';
import Button from 'primevue/button';

export default {
  name: "HelpPopup",
  components: {
    OverlayPanel,
    Button
  },
  methods: {
    toggle(event) {
      this.$refs.op.toggle(event);
    },
  }
}
</script>

<style lang="scss" scoped>
  .btn {
    justify-content: center;
    vertical-align: middle;
    float: right;
    margin: 8px;
    width: 32;
    height: 32;
  }
</style>