<template>
    <div class="indicator-dialog tw-absolute tw-w-full tw-z-10 tw-w-60 tw-h-20 tw-text-white tw-overflow-hidden" :class="[{'tw-hidden': (centerX < 0)}]" :style="`left: ${centerX}px; top:${centerY}px;transform: translateY(-50%);`">
      <div class="dialog-container tw-relative tw-w-full tw-h-full tw-text-xs text-white tw-p-4 tw-bg-midnight tw-rounded-md">
        <div class="tw-text-white tw-font-bold">{{ title }}</div>
        <div class="tw-text-white tw-text-xss" :key="'indicator_'+k" v-for="(indicator, k) in indicators">
            <i>{{ indicator.icon }}</i>
            <div>{{ indicator.text }}</div>
        </div>
      </div>
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
    indicators: {
        type: Array,
        default: () => [],
    },
    centerX: {
        type: Number,
        default: -1,
    },
    centerY: {
        type: Number,
        default: -1,
    }
  },

  setup() {
  }
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.indicator-dialog{
    .dialog-container {
        margin-left: 10px;
        width: 230px;
    }
    :after {
        content: '';
        position: absolute;
        left: -10px;
        top: 50%;
        transform: translateY(-50%);
        width: 0;
        height: 0;
        border-style: solid;
        border-width: 5px 10px 5px 0;
        border-color: transparent #000032 transparent transparent;
    }
    

}
</style>
