<template>
    <div class="indicator-dialog tw-absolute tw-w-full tw-z-10 tw-w-60 tw-h-20 tw-text-white tw-overflow-hidden" :class="[{'tw-hidden': (centerX < 0)}]" :style="`left: ${centerX}px; top:${centerY}px;transform: translateY(-50%);`">
      <div class="dialog-container tw-relative tw-w-full tw-h-full tw-text-xs text-white tw-p-2 tw-bg-midnight tw-rounded-md">
        <div class="tw-text-white tw-font-bold tw-mb-1">{{ title }}</div>
        <div class="tw-text-white tw-text-xss tw-flex tw-mb-1" :key="'indicator_'+k" v-for="(indicator, k) in indicators">
            <InlineIcon class="tw-mr-2" :name="indicator.icon" />
            <div style="line-height: 16px">{{ indicator.text }}</div>
        </div>
      </div>
    </div>
</template>

<script>
import { defineComponent } from 'vue';
import InlineIcon from './InlineIcon.vue';

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
  components: {
    InlineIcon,
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
