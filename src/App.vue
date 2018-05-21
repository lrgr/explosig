<template>
  <div id="app">
    <NavBar/>
    <PlotGrid/>
  </div>
</template>

<script>
import { globalDataOptions, globalPlotList } from './buses/data-options-bus.js';
import { mapGetters } from 'vuex'
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
      if(params.data && params.data.signatures && params.data.sources && params.plots && params.chr) {
        params.data.signatures.map((x) => { this.dataOptions.signatures.push(x); });
        params.data.sources.map((x) => { this.dataOptions.sources.push(x); });
        params.plots.map((x) => { this.plotList.push(x); });
        this.$store.commit('setSelectedChromosome', {
          'name': params.chr.value,
          'start': params.chr.start,
          'end': params.chr.end
        })
      }
    }
  },
  data: function() {
    return {
      dataOptions: globalDataOptions,
      plotList: globalPlotList
    }
  },
  computed: {
    ...mapGetters({
      chromosomeSelected: 'selectedChromosome'
    })
  },
  methods: {
    setHash: function() {
      let hashData = {
        'data': this.dataOptions,
        'plots': this.plotList,
        'chr': { 
          'value': this.chromosomeSelected.name,
          'start': this.chromosomeSelected.start,
          'end': this.chromosomeSelected.end
        }
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
      handler: function() {
        this.setHash();
      },
      deep: true
    },
    chromosomeSelected: {
      handler: function() {
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
