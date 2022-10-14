<template>
  <div class="plain-line-chart">
    <canvas class="tw-w-full tw-h-full" ref="plainLineChart"></canvas>
    <ul class="tw-flex tw-flex-row tw-justify-between tw-mt-5">
      <li :key="'date_'+date" v-for="([date]) in myChartData">
        {{ date }}
      </li>
    </ul>
  </div>
</template>

<script>
import { defineComponent, onMounted, ref } from 'vue';
import { sum, filterSeqDate } from '/src/utils/data.js';
import { plainLineChartTheme } from '/src/utils/theme.js';
import { drawLine } from '/src/utils/canvas.js';
import data from '/src/data/data.json';

export default defineComponent({
  props: {
    chartDataName: {
      type: String,
      default: 'outgoings',
    },
    chartDataSpendingIdentifier: {
      type: String,
      default: 'amount',
    },
    startDate: {
      type: String,
      default: '2022-05-01',
    },
    slots: {
      type: Number,
      default: 7,
    },
    height: {
      type: Number,
      default: 200,
    }
  },

  setup(props) {
    let plainLineChart = ref(null);
    let myContext = null;
    let canvasWidth = 0;
    let canvasHeight = 0;

    const myRawData = data[props.chartDataName];
    const mySlicedData = filterSeqDate(myRawData, props.startDate, props.slots);
    const myChartData = Object.entries(mySlicedData);
    const maxSpending = 600;

    onMounted(() => {
      canvasWidth = plainLineChart.value.width = window.innerWidth;
      canvasHeight = plainLineChart.value.height = props.height;
      myContext =  plainLineChart.value.getContext('2d');
      myContext.strokeStyle = plainLineChartTheme.strokeColor;
      myContext.lineJoin =  plainLineChartTheme.strokeLineJointStyle;

      const lineIncrementX = canvasWidth / (props.slots - 1);
      const lineIncrementY = canvasHeight / maxSpending;
      let from = {x: 0, y: 0};
      let to = {x: 0, y: 0};
      myChartData.forEach(([key, val], k) => {
        console.log(key);
        let dailySpending = sum(val, props.chartDataSpendingIdentifier)[props.chartDataSpendingIdentifier];
        
        if(k === 0){
          from.y = (maxSpending - dailySpending) * lineIncrementY;
          return;
        }else{
          to.x += lineIncrementX;
          to.y = (maxSpending - dailySpending) * lineIncrementY;
          console.error('draw', from, to);
          drawLine(myContext, from, to);
          from.x += lineIncrementX;
          from.y = to.y;
        }      
      });
      
    })

    return {
      plainLineChart,
      myChartData,
      canvasWidth,
    }
  }
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
