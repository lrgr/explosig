<template>
    <div class="plot-grid">
        <Plot v-for="plot in plots" :item="plot" :key="plot.id" class="item"></Plot>
        <div class="spinner-wrapper">
            <Spinner v-if="loading" class="spinner"></Spinner>
        </div>
    </div>
</template>

<script>
import Spinner from './Spinner.vue'
import Plot from './Plot.vue'

export default {
  name: 'PlotGrid',
  components: {
    Spinner,
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
        margin: 1rem;
    }
    .spinner-wrapper {
        width: 100%;
        margin: 40px 0px;
        .spinner {
            margin: 0 auto;
        }
    }
}

</style>
