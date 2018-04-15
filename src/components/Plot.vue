<template>
    <div>
        <div class="options-bar">
            <span class="title">{{ plotTitle }}</span>
            <div class="right-button-group">
                <span class="button" v-on:click="showInfo = !showInfo">?</span>
                <span class="button button-warning" v-on:click="removePlot()">&ndash;</span>
            </div>
        </div>
        <div class="plot">
            <component 
                v-bind:is="this.plotType" 
                ref="innerPlot" 
                :plotIndex="this.plotIndex" 
                :showInfo="this.showInfo"
                :windowWidth="this.windowWidth"
                v-on:titleInit="plotTitle = $event"
            ></component>
        </div>
  </div>
</template>

<script>
import { DataOptionsBus, globalDataOptions } from './../buses/data-options-bus.js';

import SignatureGenomeBinsPlot from './plots/SignatureGenomeBinsPlot.vue'
import KataegisPlot from './plots/KataegisPlot.vue'
import ExposuresPlot from './plots/ExposuresPlot.vue'

export default {
  name: 'Plot',
  props: ['plotType', 'plotIndex'],
  data: function() { 
        return {
            showInfo: false,
            windowWidth: 0,
            dataOptions: globalDataOptions,
            plotTitle: ""
        };
  },
  mounted: function() {
        let vm = this;
        vm.updatePlot();
        DataOptionsBus.$on('updateDataOptions', function() {
            vm.updatePlot();
        });
      
        vm.windowWidth = window.innerWidth;
        window.addEventListener('resize', () => {
            vm.windowWidth = window.innerWidth;
            vm.drawPlot();
        });
      
  }, 
  methods: {
        updatePlot() {
            if(this.dataOptions.signatures.length > 0 && this.dataOptions.sources.length > 0) {
                this.$refs.innerPlot.updatePlot();
            }
        },
        drawPlot() {
            this.$refs.innerPlot.drawPlot();
        },
        removePlot() {
            // TODO: emit plot removal
        }
  },
  components: {
      SignatureGenomeBinsPlot,
      KataegisPlot,
      ExposuresPlot
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

@import './../variables.scss';

.options-bar {
    width: 100%;
    background-color: $color-lgray;
    padding: 0.5rem 0rem;

    span.title {
        text-decoration: none;
        color: $color-white;
        font-size: 1.2rem;
        margin: 0 1rem;
    }
    .right-button-group {
        float: right;
        margin: 0.2rem 0.5rem;
    }
}

span.button {
    margin: 0rem 0.4rem;
    padding: 0.1rem 0.3rem;
    font-size: 1rem;
}
.plot {
    border: 1px solid $color-lgray;;
    position:relative;
}
</style>
