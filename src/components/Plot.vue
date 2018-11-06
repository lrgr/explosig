<template>
    <div>
        <div class="options-bar">
            <span class="title">{{ plotTitle }}</span>
            <div class="right-button-group">
                <span class="button button-warning" @click="stickyPlot()" :title="isPinned ? 'Unpin' : 'Pin'">
                    <i :class="isPinned ? 'icon-pin' : 'icon-pin_o'"></i>
                </span>
                <span class="button" v-on:click="showInfo = !showInfo" title="Info">?</span>
                <span class="button button-warning" v-on:click="toggleVisibility()" :title="hidden ? 'Show' : 'Minimize'">{{ hidden ? '+' : '&ndash;' }}</span>
            </div>
        </div>
        <div class="plot" v-show="!hidden">
            <component 
                v-bind:is="this.plotType" 
                ref="innerPlot" 
                :plotID="this.plotID"
                :plotOptions="this.plotOptions"
                :showInfo="this.showInfo"
                :pinned="this.canRemove"
            ></component>
        </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { DataOptionsBus } from './../buses.js';

// child components
import SignatureGenomeBinsPlot from './plots/SignatureGenomeBinsPlot.vue'
import KataegisPlot from './plots/KataegisPlot.vue'
import ExposuresPlot from './plots/ExposuresPlot.vue'
import RainfallPlot from './plots/RainfallPlot.vue'
import SingleSampleExposuresPlot from './plots/SingleSampleExposuresPlot.vue'
import SignaturePlot from './plots/SignaturePlot.vue'
import SamplesWithSignaturesPlot from './plots/SamplesWithSignaturesPlot.vue'
import ClusterPlot from './plots/ClusterPlot.vue'


export default {
  name: 'Plot',
  props: ['plotType', 'plotTitle', 'plotID', 'plotOptions', 'canRemove'],
  data: function() { 
        return {
            showInfo: false,
            hidden: false
        };
  },
  computed: {
      isPinned: function() {
          return (this.canRemove || (this.selectedPlots.find((el) => (el.id == this.plotID)) !== undefined));
      },
      ...mapGetters([
          'selectedPlots',
          'currentModeOptions'
      ])
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
        },
        stickyPlot() {
            let vm = this;
            if(vm.isPinned) {
                // already sticky, remove
                vm.removePlot();
            } else {
                var clonedModeOptions = Object.assign({}, vm.plotOptions);
                vm.$store.commit('addPlot', {
                    title: vm.plotTitle,
                    type: vm.plotType,
                    id: vm.plotID,
                    options: clonedModeOptions
                });
            }
        },
        toggleVisibility() {
            this.hidden = !this.hidden;
        }
  },
  components: {
      SignatureGenomeBinsPlot,
      KataegisPlot,
      ExposuresPlot,
      RainfallPlot,
      SingleSampleExposuresPlot,
      SignaturePlot,
      SamplesWithSignaturesPlot,
      ClusterPlot
  }
}
</script>

<style scoped lang="scss">

@import './../style/variables.scss';
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
