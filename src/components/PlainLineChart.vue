<template>
  <div class="plain-line-chart tw-relative tw-w-full tw-h-full tw-min-h-60">
    <canvas class="tw-absolute tw-w-full" ref="plainLineChart"></canvas>
    <canvas class="tw-absolute tw-w-full tw-z-5" ref="plainLineChartOverlay" @mousemove="handleMouseMove"></canvas>
    <ul class="tw-absolute tw-bottom-0 tw-w-full tw-flex tw-flex-row tw-justify-between tw-mt-5">
      <li :key="'date_'+date" v-for="([date]) in myChartData">
        {{ getLocaleDate(date) }}
      </li>
    </ul>
  </div>
</template>

<script>
import { defineComponent, onMounted, ref } from 'vue';
import { sum, filterSeqDate, getCenterY, localeDate } from '/src/utils/data.js';
import { plainLineChartTheme } from '/src/utils/theme.js';
import { drawLine, drawText, drawCircle } from '/src/utils/canvas.js';
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
    chartDataIncomeIdentifier: {
      type: String,
      default: 'daily_income',
    },
    chartDataIncomeText: {
      type: String,
      default: 'Daily income',
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
    let segments = new Array;
    let lineIncrementX = 0;
    let lineIncrementY = 0;
    let plainLineChartOverlay = ref(null);
    let overlayContext = null;
    let canvasPaddingBtm = 20;

    const myRawData = data[props.chartDataName];
    const mySlicedData = filterSeqDate(myRawData, props.startDate, props.slots);
    const myChartData = Object.entries(mySlicedData);
    const maxSpending = 600;
    const income = data[props.chartDataIncomeIdentifier];

    const handleMouseMove = (event) => {
      const centerX = event.pageX;
      let segment = segments.filter((seg) =>  seg.from.x <= centerX && seg.to.x >= centerX)[0];
      let centerY = getCenterY(segment.from, segment.to, centerX);
      if(centerY !== undefined) {
        overlayContext.clearRect(0, 0, plainLineChartOverlay.value.width, plainLineChartOverlay.value.height);
        drawCircle(overlayContext, centerX, centerY, 10);
      }
    }

    function getLocaleDate(date) {
      let dateStr = localeDate(date, 'en-US', {day: 'numeric', month: 'short', year: '2-digit'});
      return dateStr.substr(0, dateStr.length - 4);
    }

    function draw() {
      // Draw Income Indicator
      myContext.strokeStyle = plainLineChartTheme.strokeIncomeColor;
      myContext.setLineDash(plainLineChartTheme.strokeIncomeLineDash);
      let incomeY = (maxSpending - income) * lineIncrementY;
      drawLine(myContext, {x: 0, y: incomeY}, {x: canvasWidth, y: incomeY});
      myContext.font = 'bold 10px Raleway';
      myContext.fillStyle = plainLineChartTheme.fillIncomeColor;
      drawText(myContext, props.chartDataIncomeText, 0, incomeY - 10);

      // Draw Spending Line Chart
      myContext.strokeStyle = plainLineChartTheme.strokeColor;
      myContext.lineJoin =  plainLineChartTheme.strokeLineJointStyle;
      myContext.setLineDash(plainLineChartTheme.strokeLineDash);
      
      let from = {x: 0, y: 0};
      let to = {x: 0, y: 0};
      myChartData.forEach(([key, val], k) => {
        console.log(key);
        let dailySpending = sum(val, props.chartDataSpendingIdentifier)[props.chartDataSpendingIdentifier];
        
        if(k === 0){
          from.y = (maxSpending - dailySpending) * lineIncrementY;
          return;
        }else{
          if(dailySpending >= income){
            myContext.strokeStyle = plainLineChartTheme.strokeExceedingColor;
          }else{
             myContext.strokeStyle = plainLineChartTheme.strokeColor;
          }
          to.x += lineIncrementX;
          to.y = (maxSpending - dailySpending) * lineIncrementY;
          const segFrom = {...from};
          const segTo = {...to};
          segments[k-1] = {'from': segFrom, 'to': segTo};
          drawLine(myContext, from, to);
          from.x += lineIncrementX;
          from.y = to.y;
        }      
      });
    }

    onMounted(() => {
      canvasWidth = plainLineChart.value.width = window.innerWidth;
      canvasHeight = plainLineChart.value.height = props.height;
      lineIncrementX = canvasWidth / (props.slots - 1);
      lineIncrementY = canvasHeight / maxSpending;
      myContext = plainLineChart.value.getContext('2d');  
      plainLineChartOverlay.value.width = canvasWidth;
      plainLineChartOverlay.value.height = canvasHeight + canvasPaddingBtm;
      overlayContext = plainLineChartOverlay.value.getContext('2d');
      overlayContext.strokeStyle = plainLineChartTheme.strokeHoverColor;
      overlayContext.fillStyle = plainLineChartTheme.fillHoverColor;
      draw();
    })

    return {
      plainLineChart,
      myChartData,
      canvasWidth,
      handleMouseMove,
      segments,
      lineIncrementX,
      lineIncrementY,
      plainLineChartOverlay,
      overlayContext,
      localeDate,
      getLocaleDate,
    }
  }
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
