<template>
  <div id="app">
    <NavBar/>
    <PlotGrid/>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import API from './api.js';
import { globalPlotList } from './buses.js';

// child components
import PlotGrid from './components/PlotGrid.vue';
import NavBar from './components/NavBar.vue';

export default {
  name: 'app',
  components: {
    NavBar,
    PlotGrid
  },
  mounted: function() {
    let vm = this;
    // check for data in hash
    var paramStr = window.location.hash.substring(1) // remove the initial "#"
    if(paramStr.length > 0) {
      var params = JSON.parse(decodeURIComponent(paramStr));
      if(params.datasets && params.signatures && params.plots && params.chr) {
        vm.$store.commit('setSelectedChromosome', {
          'name': params.chr.name,
          'start': params.chr.start,
          'end': params.chr.end
        });
        vm.$store.commit('setSelectedSignatures', params.signatures);
        vm.$store.commit('setSelectedDatasets', params.datasets);
        vm.$store.commit('setSelectedPlots', params.plots);
      }
    }
    API.fetchChromosomes().then(function(chromosomeLengths) {
        vm.$store.commit('setChromosomeLengths', chromosomeLengths);
    });
    vm.$store.commit('setWindowWidth', window.innerWidth);
    vm.$store.commit('setWindowHeight', window.innerHeight);
    window.addEventListener('resize', () => {
        vm.$store.commit('setWindowWidth', window.innerWidth);
        vm.$store.commit('setWindowHeight', window.innerHeight);
    });
  },
  computed: {
    ...mapGetters([
      'selectedChromosome',
      'selectedSignatures',
      'selectedPlots',
      'selectedDatasets'
    ])
  },
  methods: {
    setHash: function() {
      let hashData = {
        'datasets': this.selectedDatasets,
        'signatures': this.selectedSignatures,
        'plots': this.selectedPlots,
        'chr': { 
          'name': this.selectedChromosome.name,
          'start': this.selectedChromosome.start,
          'end': this.selectedChromosome.end
        }
      };
      window.location.hash = JSON.stringify(hashData);
    }
  },
  watch: {
    selectedSignatures: {
      handler: function() {
        this.setHash();
      },
      deep: true
    },
    selectedDatasets: {
      handler: function() {
        this.setHash();
      },
      deep: true
    },
    selectedPlots: {
      handler: function() {
        this.setHash();
      },
      deep: true
    },
    selectedChromosome: {
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
