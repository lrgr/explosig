<template>
    <div>
        <Intro v-if="selectedPlots.length == 0"/>
        <div class="plot-grid">
            <div class="all-donors-plots" v-show="isAllDonorsMode">
                <Plot v-for="plot in selectedPlots" 
                    :key="plot.id" 
                    :plotType="plot.type"
                    :plotOptions="plot.options"
                    :plotID="plot.id"
                    :plotTitle="plot.title"
                    :canRemove="true"
                    class="item"
                ></Plot>
            </div>
            <div class="single-donor-plots" v-if="isSingleDonorMode">
                <SingleDonorPlots class="item" />
            </div>
        </div>
        <div class="legend-wrapper" v-if="selectedPlots.length > 0">
            <div class="legend">
                <div class="options-bar">
                    <span class="title">Legend</span>
                </div>
                <div class="legend-list" :style="{ height: legendHeight }">
                    <Legend v-for="(legendKey, index) in legendKeys"
                        :key="index"
                        :legendKey="legendKey"
                        class="legend-item"
                    ></Legend>
                </div>
            </div>
            <ModeBar v-if="selectedPlots.length > 0"/>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

// child components
import Plot from './Plot.vue';
import SingleDonorPlots from './SingleDonorPlots.vue';
import Legend from './Legend.vue';
import ModeBar from './ModeBar.vue';
import Intro from './Intro.vue';


export default {
  name: 'PlotGrid',
  components: {
    Plot,
    SingleDonorPlots,
    Legend,
    ModeBar,
    Intro
  },
  data: function() {
      return {
          legendKeys: [
                "datasets",
                "signatures",
                "clinicalVariables",
                "contexts"
          ],
          loading: false,
          pageY: 0
      };
  },
  computed: {
      legendHeight: function() {
          return (this.windowHeight - 40 - 69 - 24 - 58) + "px";
      },
      ...mapGetters([
          'selectedPlots',
          'windowHeight',
          'isAllDonorsMode',
          'isSingleDonorMode'
      ])
  },
  methods: {
      scrollLegend: function(event) {
          this.pageY = event.pageY;
      }
  }
}
</script>

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
    position: fixed;
    .legend {
        margin-right: 20px;
        margin-top: 20px;
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
            width: 100%;
            border: 1px solid $color-lgray;
            box-sizing: border-box;
            overflow-y: auto;
        }
    }
}

</style>
