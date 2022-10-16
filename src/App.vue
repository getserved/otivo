<template>
  <div class="chart-container tw-flex">
    <PlainLineChart class="main-chart tw-m-auto tw-overflow-x-hidden"/>
  </div>
</template>

<script>
import PlainLineChart from './components/PlainLineChart.vue'

export default {
  name: 'App',
  components: {
    PlainLineChart
  }
}
</script>

<style>
body {
  margin: 0;
}
#app {
  min-height: 100vh;
  width: 100%;
  height: 100%;
  display: flex;
}

.chart-container {
  display: flex;
  width: 100%;
  height: 100%;
  padding: 1rem;
  margin: auto;
}

</style>
