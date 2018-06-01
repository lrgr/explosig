<template>
    <div>
        <Intro v-if="!doneIntro"/>
        <div class="plot-grid" v-if="doneIntro">
            <div>
                <Plot v-for="plot in selectedPlots" 
                    v-if="checkPin(plot.id)"
                    :key="plot.id" 
                    :plotType="plot.type"
                    :plotID="plot.id"
                    :plotTitle="plot.title + prettifyOptions(plot.options)"
                    :plotOptions="plot.options"
                    :canRemove="true"
                    class="item"
                ></Plot>
            </div>
            <div v-if="isOverviewMode">
                <Plot v-for="plot in overviewModePlots" 
                    :key="plot.id" 
                    :plotType="plot.type"
                    :plotID="plot.id + serializeOptions(currentModeOptions)"
                    :plotTitle="plot.title"
                    :plotOptions="currentModeOptions"
                    :canRemove="false"
                    class="item"
                ></Plot>
            </div>
            <div v-show="isAllDonorsMode">
                <Plot v-for="plot in allDonorsModePlots" 
                    :key="plot.id" 
                    :plotType="plot.type"
                    :plotID="plot.id + serializeOptions(currentModeOptions)"
                    :plotTitle="plot.title"
                    :plotOptions="currentModeOptions"
                    :canRemove="false"
                    class="item"
                ></Plot>
            </div>
            <div v-if="isSingleDonorMode">
                <div class="title-wrapper">
                    <span class="title-big">{{ currentModeOptions.donor_id }}</span>
                    <span class="title-small">{{ currentModeOptions.proj_id }}</span>
                </div>
                <Plot v-for="plot in singleDonorModePlots" 
                    :key="plot.id" 
                    :plotType="plot.type"
                    :plotID="plot.id + serializeOptions(currentModeOptions)"
                    :plotTitle="plot.title"
                    :plotOptions="currentModeOptions"
                    :canRemove="false"
                    class="item"
                ></Plot>
            </div>
        </div>
        <div class="legend-wrapper" v-if="doneIntro">
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
            <ModeStatus v-if="doneIntro"/>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

// child components
import Plot from './Plot.vue';
import Legend from './Legend.vue';
import ModeStatus from './ModeStatus.vue';
import Intro from './Intro.vue';


export default {
  name: 'PlotGrid',
  components: {
    Plot,
    Legend,
    ModeStatus,
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
      doneIntro: function() {
          return (this.selectedDatasets.length > 0 && this.selectedSignatures.length > 0);
      },
      legendHeight: function() {
          return (this.windowHeight - 40 - 69 - 24 - 58) + "px";
      },
      ...mapGetters([
          'windowHeight',
          'selectedPlots',
          'selectedDatasets',
          'selectedSignatures',
          'isAllDonorsMode',
          'allDonorsModePlots',
          'isSingleDonorMode',
          'singleDonorModePlots',
          'isOverviewMode',
          'overviewModePlots',
          'currentModeOptions'
      ])
  },
  methods: {
      scrollLegend: function(event) {
          this.pageY = event.pageY;
      },
      checkPin(plotID) {
          if(this.isAllDonorsMode) {
              return (this.allDonorsModePlots.find((el) => ((el.id + this.serializeOptions(this.currentModeOptions)) == plotID)) === undefined);
          } else if(this.isSingleDonorMode) {
              return (this.singleDonorModePlots.find((el) => ((el.id + this.serializeOptions(this.currentModeOptions)) == plotID)) === undefined);
          } else if(this.isOverviewMode) {
              return (this.overviewModePlots.find((el) => ((el.id + this.serializeOptions(this.currentModeOptions)) == plotID)) === undefined);
          }
          return true;
      },
      serializeOptions(options) {
          return Object.values(options).reduce(((a, h) => a + "-" + h), "");
      },
      prettifyOptions(options) {
          if(Object.values(options).length > 0) {
            return " (" + Object.values(options).reduce(((a, h) => a + ", " + h), "").substring(2) + ")";
          }
          return "";
      }
  }
}
</script>

<style scoped lang="scss">

@import './../style/variables.scss';
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
.title-wrapper {
    margin-bottom: 0;
    margin-left: 20px;
    margin-top: 20px;
    display: inline-block;
    .title-big {
        font-size: 26px;
        margin-right: 1rem;
    }
    .title-small {

    }
}

</style>
