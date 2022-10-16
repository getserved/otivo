<template>
    <div class="chart-heading tw-font-lg tw-w-full">
        <slot v-if="$slots.html" name="html"></slot>
        <div v-else> {{ title }}</div>
    </div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    title: {
        type: String,
        default: '',
    },
  },

  setup() {
  }
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
