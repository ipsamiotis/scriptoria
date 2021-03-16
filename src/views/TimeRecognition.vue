<template>
  <div class="task" style="margin-bottom: 80px;">
    <div class="task-header">
      <h3>Time Recognition</h3>
      The given segment might contain a time signature. <br>
      Select "No Signature" or input the correct numbers, in case you recognise any.<br>
    </div>
    <div class="task-items">
      <SliceViewer :slice-file="state.selectedTask.image_path"/>
    </div>
    <div class="task-input">
      <TimeRecButtons :taskID="state.sliceId" :xml="state.selectedTask.xml"/>
    </div>
  </div>
</template>

<script>
import {reactive, onMounted, computed} from "vue"
import {useRoute} from 'vue-router';

import axios from 'axios'

import SliceViewer from "@/components/SliceViewer"
import TimeRecButtons from "@/components/TimeRecButtons"

export default {
  name: "TimeRecognition",
  components: {
    SliceViewer,
    TimeRecButtons
  },

  setup() {
    const route = useRoute();
    const taskId = computed(() => route.params.taskId)

    const state = reactive({
      selectedTask: {},
      sliceId: ""
    })

    function getSlice(taskObj) {
      state.selectedTask = taskObj
    }

    onMounted(() => {
      axios.get(`http://localhost:443/tasks/${taskId.value}`)
          .then(response => {
            state.sliceId = taskId.value
            getSlice(response.data)
          });
    })

    return {
      state,
      getSlice,
      taskId
    }
  }
}
</script>

<style lang="scss" scoped>

</style>