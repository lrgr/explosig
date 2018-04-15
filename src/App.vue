<template>
  <div id="app">
    <NavBar/>
    <PlotGrid/>
  </div>
</template>

<script>
import { globalDataOptions, globalPlotList } from './buses/data-options-bus.js';

import PlotGrid from './components/PlotGrid.vue'
import NavBar from './components/NavBar.vue'

export default {
  name: 'app',
  components: {
    NavBar,
    PlotGrid
  },
  mounted: function() {
    // check for data in hash
    var paramStr = window.location.hash.substring(1) // remove the initial "#"
    if(paramStr.length > 0) {
      var params = JSON.parse(decodeURIComponent(paramStr));
      if(params.data && params.data.signatures && params.data.sources && params.plots) {
        params.data.signatures.map((x) => { this.dataOptions.signatures.push(x); });
        params.data.sources.map((x) => { this.dataOptions.sources.push(x); });
        params.plots.map((x) => { this.plotList.push(x); });
      }
    }
  },
  data: function() {
    return {
      dataOptions: globalDataOptions,
      plotList: globalPlotList
    }
  },
  methods: {
    setHash: function() {
      let hashData = {
        'data': this.dataOptions,
        'plots': this.plotList
      };
      window.location.hash = JSON.stringify(hashData);
    }
  },
  watch: {
    dataOptions: {
      handler: function() {
        this.setHash();
      },
      deep: true
    },
    plotList: {
      handler: function(val) {
        this.setHash();
      },
      deep: true
    }
  }
}
</script>

<style lang="scss">
@import './variables.scss';

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: $color-darkgray;
  margin: 0px;
  overflow-x: hidden;
}
</style>
