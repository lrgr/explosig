<template>
    <div>
        <div class="options-bar">
            <span class="title">{{ plotTitle }}</span>
            <div class="right-button-group">
                <span class="button button-warning"><i class="icon-pin_icon"></i></span>
                <span class="button" v-on:click="showInfo = !showInfo" title="Info">?</span>
                <span class="button button-warning" v-on:click="removePlot()" v-if="canRemove" title="Hide">&ndash;</span>
            </div>
        </div>
        <div class="plot">
            <component 
                v-bind:is="this.plotType" 
                ref="innerPlot" 
                :plotID="this.plotID" 
                :plotOptions="this.plotOptions" 
                :showInfo="this.showInfo"
            ></component>
        </div>
  </div>
</template>

<script>
import { DataOptionsBus } from './../buses.js';

// child components
import SignatureGenomeBinsPlot from './plots/SignatureGenomeBinsPlot.vue'
import KataegisPlot from './plots/KataegisPlot.vue'
import ExposuresPlot from './plots/ExposuresPlot.vue'
import RainfallPlot from './plots/RainfallPlot.vue'

export default {
  name: 'Plot',
  props: ['plotType', 'plotOptions', 'plotTitle', 'plotID', 'canRemove'],
  data: function() { 
        return {
            showInfo: false
        };
  },
  mounted: function() {
        let vm = this;
        this.$nextTick(function() {
            vm.updatePlot();
        });
        DataOptionsBus.$on('updateDataOptions', function() {
            this.$nextTick(function() {
                vm.updatePlot();
            });
        });
  }, 
  methods: {
        updatePlot() {
            if(this.$refs.innerPlot) {
                this.$refs.innerPlot.updatePlot();
            }
        },
        drawPlot() {
            if(this.$refs.innerPlot) {
                this.$refs.innerPlot.drawPlot();
            }
        },
        removePlot() {
            let vm = this;
            this.$store.commit('removePlot', vm.plotID);
        }
  },
  components: {
      SignatureGenomeBinsPlot,
      KataegisPlot,
      ExposuresPlot,
      RainfallPlot
  }
}
</script>

<style scoped lang="scss">

@import './../variables.scss';
@import './../style/icomoon.css';

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
        margin-top: 0.0rem;
        margin-right: 0.5rem;
        span.button {
            display: inline-block;
            margin: 0 0.4rem;
            padding: 0.2rem 0.3rem 0.1rem 0.3rem;
            font-size: 1rem;
            width: 15px;
            text-align: center;
            i {
                font-size: 0.9rem;
            }
        }
    }
}


.plot {
    border: 1px solid $color-lgray;;
    position: relative;
}
</style>
