<template>
    <div class="plot-grid">
        <Plot v-for="(plot, index) in plots" 
            :key="plot.id" 
            :plotType="plot.type" 
            :plotTitle="plot.title"
            :plotIndex="index"
            class="item"
        ></Plot>
    </div>
</template>

<script>
import { globalPlotList } from './../buses/data-options-bus.js';
import Plot from './Plot.vue'

export default {
  name: 'PlotGrid',
  components: {
    Plot
  },
  data: function() {
      return {
          plots: globalPlotList,
          loading: false
      };
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

@import './../variables.scss';

.plot-grid {
    .item {
        margin: 20px;
    }
}

</style>
