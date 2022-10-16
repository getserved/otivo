<template>
  <div ref="plainLineChartCom"  class="plain-line-chart tw-relative tw-w-full tw-h-full tw-min-h-60 tw-overflow-hidden tw-max-w-screen-xl">
    <ChartHeading>
       <template v-slot:html>
        <div>Hello {{getUser()}}... you're already <span class="tw-font-bold">{{ indicatorHeading.amount }}</span> {{indicatorHeading.text}}</div>
       </template>
    </ChartHeading>
    <div class="tw-relative">
      <canvas class="tw-absolute tw-w-full" ref="plainLineChart"></canvas>
      <canvas class="tw-absolute tw-w-full tw-pointer-none tw-z-5" ref="plainLineChartOverlay" @mousemove="handleMouseMove"></canvas>
      <IndicatorDialog :title="indicatorDialog.title" :indicators="indicatorDialog.indicators" :centerX="indicatorDialog.centerX" :centerY="indicatorDialog.centerY"/>
    </div>
    <ul class="tw-absolute tw-bottom-0 tw-w-full tw-flex tw-flex-row tw-justify-between tw-mt-5">
      <li class="tw-flex" :key="'date_'+date" v-for="([date]) in myChartData">
        <span class="tw-text-xss">{{ getLocaleDate(date) }}</span>
        <button class="tw-w-10 tw-h-1 tw-bg-grey1 tw-rounded-lg tw-ml-4" :class="[{'tw-bg-otivo_blue': currentSegment?.date === date}]"></button>
      </li>
    </ul>

  </div>
</template>

<script>
import { defineComponent, onMounted, ref, computed, reactive } from 'vue';
import { filterSeqDate, getCenterY, localeDate, cumulate, getBudgets, getSpendingIndicators, getUser } from '/src/utils/data.js';
import { plainLineChartTheme } from '/src/utils/theme.js';
import { drawLine, drawText, drawCircle, drawPolygon} from '/src/utils/canvas.js';
import data from '/src/data/data.json';
import IndicatorDialog from './IndicatorDialog.vue';
import ChartHeading from './ChartHeading.vue';

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
  components: {
    IndicatorDialog,
    ChartHeading,
  },

  setup(props) {
    let plainLineChart = ref(null);
    let mainContext = null;
    let canvasWidth = 0;
    let canvasHeight = 0;
    let segments = [];
    let currentSegment = ref(null);
    let lineIncrementX = 0;
    let lineIncrementY = 0;
    let plainLineChartOverlay = ref(null);
    let overlayContext = null;
    let canvasPaddingBtm = 20;
    const plainLineChartCom = ref(null);
    const indicatorDialog = reactive({
      centerX: computed(() => currentSegment.value ? currentSegment.value.centerX + 10 : -1),
      centerY: computed(() => currentSegment.value ? currentSegment.value.centerY : -1),
      title: computed(() => currentSegment.value && currentSegment.value.data ? `$${currentSegment.value.data.amount} ${currentSegment.value.data.name}` : null) ,
      indicators: computed(() => {
        return currentSegment.value && currentSegment.value.data ? getSpendingIndicators(myRawData, currentSegment.value.date, getBudgets(income)) : null}),
    });
    const indicatorHeading = reactive({
      amount: computed(() => indicatorDialog?.indicators ? `$${indicatorDialog?.indicators[0].amount}`: null) ,
      text: computed(() => indicatorDialog?.indicators ? `$${indicatorDialog?.indicators[0].short} your daily budget...`: null) 
    })


    const myRawData = data[props.chartDataName];
    const mySlicedData = filterSeqDate(myRawData, props.startDate, props.slots);
    const myChartData = Object.entries(mySlicedData);
    const maxSpending = 600;
    const income = data[props.chartDataIncomeIdentifier];

    const handleMouseMove = (event) => {
      const centerX = event.pageX - plainLineChartCom.value.offsetLeft; 
 
      let segment = segments.filter((seg) =>  seg.from.x <= centerX && seg.to.x >= centerX)[0];
      let centerY = getCenterY(segment.from, segment.to, centerX);
      currentSegment.value = {...segment, centerX: centerX, centerY: centerY};
      if(centerY !== undefined) {
        overlayContext.clearRect(0, 0, plainLineChartOverlay.value.width, plainLineChartOverlay.value.height);
        overlayContext.lineWidth = plainLineChartTheme.lineWidthOverlay;
        drawCircle(overlayContext, centerX, centerY, 10);
      }
    }

    function getLocaleDate(date) {
      let dateStr = localeDate(date, 'en-US', {day: 'numeric', month: 'short', year: '2-digit'});
      return dateStr.substr(0, dateStr.length - 4);
    }

    function draw() {
      
      // Draw Income Indicator
      mainContext.globalCompositeOperation='destination-over';
      mainContext.strokeStyle = plainLineChartTheme.strokeIncomeColor;
      mainContext.setLineDash(plainLineChartTheme.strokeIncomeLineDash);
      let incomeY = (maxSpending - income) * lineIncrementY;
      drawLine(mainContext, {x: 0, y: incomeY}, {x: canvasWidth, y: incomeY});
      mainContext.font = 'bold 10px Raleway';
      mainContext.fillStyle = plainLineChartTheme.fillIncomeColor;
      drawText(mainContext, props.chartDataIncomeText, 0, incomeY - 10);

      // Draw Spending Line Chart
      mainContext.strokeStyle = plainLineChartTheme.strokeColor;
      mainContext.lineJoin =  plainLineChartTheme.strokeLineJointStyle;
      mainContext.setLineDash(plainLineChartTheme.strokeLineDash);
      
      let from = {x: 0, y: 0};
      let to = {x: 0, y: 0};

      myChartData.forEach(([key, val], k) => {
        let dailySpending = cumulate(val, props.chartDataSpendingIdentifier);
        let trans = dailySpending.length;
        if(k === 0){
          from.y = (maxSpending - dailySpending[0].cumulate) * lineIncrementY;
          return;
        }else{
          dailySpending.forEach((daily) => {
            let spending = daily.cumulate;
            if(spending >= income){
              mainContext.strokeStyle = plainLineChartTheme.strokeExceedingColor;
            }else{
              mainContext.strokeStyle = plainLineChartTheme.strokeColor;
            }
            lineIncrementX = canvasWidth / (props.slots - 1) / trans;
            to.x += lineIncrementX;
            to.y = (maxSpending - spending) * lineIncrementY;
   
            const segFrom = {...from};
            const segTo = {...to};
            segments.push({'from': segFrom, 'to': segTo, 'data': daily, 'date': key});
            drawLine(mainContext, from, to);
            from.x += lineIncrementX;
            from.y = to.y;
          });
        }
      });

      let grd = mainContext.createLinearGradient(0, 0, 0, canvasHeight);
      plainLineChartTheme.fillPolygonColorStops.forEach(stop => {
        Object.entries(stop).forEach(([key,val]) => {
          grd.addColorStop(key, val);
        });
      });
      mainContext.fillStyle = grd;
      drawPolygon(mainContext, segments, canvasHeight);
    }

    onMounted(() => {
      canvasWidth = plainLineChart.value.width = plainLineChartCom.value.offsetWidth;
      canvasHeight = plainLineChart.value.height = props.height;
      lineIncrementX = canvasWidth / (props.slots - 1);
      lineIncrementY = canvasHeight / maxSpending;
      mainContext = plainLineChart.value.getContext('2d');  
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
      indicatorDialog,
      getSpendingIndicators,
      currentSegment,
      getUser,
      indicatorHeading,
      plainLineChartCom,
    }
  }
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
</style>
