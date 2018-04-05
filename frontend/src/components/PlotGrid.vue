<template>
    <div class="plot-grid">
        <Plot v-for="plot in plots" 
            :key="plot.id" 
            :plotType="'SignatureGenomeBinsPlot'" 
            :plotTitle="'Manhattan Plot with Signatures'"
            class="item"
        ></Plot>
    </div>
</template>

<script>
import Plot from './Plot.vue'

export default {
  name: 'PlotGrid',
  components: {
    Plot
  },
  data: function() {
      return {
          plots: [{}],
          loading: false
      };
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

@import './../variables.scss';

.plot-grid {
    border: 0px solid red;
    .item {
        margin: 20px;
    }
}

</style>
