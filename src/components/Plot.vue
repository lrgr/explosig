<template>
    <div>
        <div class="options-bar">
            <span class="title">{{ plotTitle }}</span>
            <div class="right-button-group">
                <span class="button" v-on:click="toggleTab('signatures')" v-if="this.plotType != 'KataegisPlot'">Signatures</span>
                <span class="button" v-on:click="toggleTab('samples')">Samples</span>
                <span class="button button-inverse" v-if="plotOptions.unsaved" v-on:click="updatePlot()">Update</span>
            </div>
        </div>

        <div class="plot">
            <div class="plot-options" v-show="plotOptions.show">
                <PlotOptions :currentTab="plotOptions.currentTab" v-on:unsaved="dataOptions = $event"/>
            </div>
            <component v-bind:is="this.plotType" v-bind:dataOptions="this.dataOptions" ref="innerPlot" :plotIndex="this.plotIndex"></component>
        </div>
  </div>
</template>

<script>

import PlotOptions from './PlotOptions.vue'

import SignatureGenomeBinsPlot from './plots/SignatureGenomeBinsPlot.vue'
import KataegisPlot from './plots/KataegisPlot.vue'
import ExposuresPlot from './plots/ExposuresPlot.vue'


export default {
  name: 'Plot',
  props: ['plotType', 'plotTitle', 'plotIndex'],
  data: function() { 
        return {
            plotOptions: {
                show: false,
                unsaved: false,
                currentTab: null
            },
            dataOptions: {}
        };
  },
  methods: {
        toggleTab: function(tabname) {
            if(this.plotOptions.currentTab == tabname && this.plotOptions.show) {
                this.plotOptions.show = false;
            } else {
                this.plotOptions.currentTab = tabname;
                this.plotOptions.show = true;
            }
        },
        updatePlot() {
            this.plotOptions.unsaved = false;
            this.plotOptions.show = false;
            this.$refs.innerPlot.updatePlot()
        }
  },
  watch: {
      dataOptions: {
        handler: function() {
          this.plotOptions.unsaved = true;
        },
        deep: true
      }
  },
  components: {
      PlotOptions,
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
    color: $color-white;
    background-color: $color-darkgray;
    margin: 0rem 0.4rem;
    padding: 0.1rem 0.3rem;
    font-size: 1rem;
    border-radius: 0.2rem;
    cursor: pointer;

    &.button-inverse {
        background-color: $color-lgreen;
        color: $color-darkgray;
    }
}
.plot {
    border: 1px solid $color-lgray;;
    position:relative;

    .plot-options {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(255, 255, 255, 0.6);
    }
}
</style>
