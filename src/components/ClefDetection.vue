<template>
    <div class="task">
        <div class="task__header">
            <h3>Task Description</h3>
            <p>Is there at least one cleff in this measure?</p>
            <h4>Example clefs:</h4>
            <img id="g-clef" class="clef" src="@/assets/icons/G-clef.svg" alt="">
            <img class="clef" src="@/assets/icons/FClef.svg" alt="">
            <img class="clef" src="@/assets/icons/CClef.svg" alt="">
        </div>
        <div class="task__items">
            <!-- <SliceViewport :slice-File="`${state.task.filename}`"/> -->
            <!-- <img :src="require(`@/assets/clef_detection/${state.task.filename}`)" alt=""> -->
        </div>
        <div class="task__input">
            <button class="exists" @click="submitUserInput(true)">Yes, there is a clef</button>
            <button class="not-exists" @click="submitUserInput(false)">No, there is no clef</button>
        </div>
    </div>
</template>

<script>

</script>

<style lang="scss" scoped>
    .task {
        .task__header {
            .clef {
                margin: 10px;
                height: 40px;
            }
            #g-clef {
                height: 50px;
            }
        }
        .task__items {
            border-radius: 5px;
            border: 1px solid #DFE3E8;
            box-sizing: border-box;
        }
    }
</style>