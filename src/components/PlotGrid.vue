<template>
    <div>
        <div class="plot-grid">
            <Plot v-for="(plot, index) in plotList" 
                :key="index" 
                :plotType="plot.type"
                :plotOptions="plot.options"
                v-on:removePlot="removePlot(index)"
                class="item"
            ></Plot>
        </div>
        <div class="legend-wrapper" v-if="plotList.length > 0">
            <div class="legend">
                <div class="options-bar">
                    <span class="title">Legend</span>
                </div>
                <div class="legend-list">
                    <Legend v-for="(legend, index) in legendList"
                        :key="index"
                        :legend="legend"
                        class="legend-item"
                    ></Legend>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { globalPlotList, globalLegendList, DataOptionsBus } from './../buses/data-options-bus.js';
import Plot from './Plot.vue'
import Legend from './Legend.vue'

export default {
  name: 'PlotGrid',
  components: {
    Plot,
    Legend
  },
  data: function() {
      return {
          plotList: globalPlotList,
          legendList: globalLegendList,
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
    display: inline-block;
    width: 80%;

    .item {
        margin: 20px;
    }
}
.legend-wrapper {
    width: 20%;
    display: inline-block;
    vertical-align: top;
    box-sizing: border-box;
    
    .legend {
        margin-top: 20px;
        margin-right: 20px;
        
        .options-bar {
            display: inline-block;
            width: 100%;
            background-color: $color-lgray;
            padding: 0.5rem 0rem;

            span.title {
                text-decoration: none;
                color: $color-white;
                font-size: 1.2rem;
                margin: 0 1rem;
            }
        }
        .legend-list {
            height: 85vh;
            width: 100%;
            border: 1px solid $color-lgray;
            box-sizing: border-box;
            overflow-y: auto;
        }
    }
}




</style>
