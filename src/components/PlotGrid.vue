<template>
    <div class="plot-grid">
        <Plot v-for="(plot, index) in plotList" 
            :key="index" 
            :plotType="plot.type"
            :plotOptions="plot.options"
            v-on:removePlot="removePlot(index)"
            class="item"
        ></Plot>
    </div>
</template>

<script>
import { globalPlotList, DataOptionsBus } from './../buses/data-options-bus.js';
import Plot from './Plot.vue'

export default {
  name: 'PlotGrid',
  components: {
    Plot
  },
  data: function() {
      return {
          plotList: globalPlotList,
          loading: false,
      };
  },
  methods: {
      removePlot: function(index) {
        let vm = this;
        if (index !== -1) {
            vm.plotList.splice(index, 1);
            vm.$nextTick(() => {
                // workaround, can't seem to get child plots to re-render after updating plotList
                window.location.reload();
            })
        }
      }
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
