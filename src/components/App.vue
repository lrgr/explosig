<template>
  <div id="app">
    <NavBar/>
    <PlotGrid/>
  </div>
</template>

<script>
import { debounce } from 'lodash';
import { mapGetters } from 'vuex';
import API from './../api.js';

// child components
import PlotGrid from './PlotGrid.vue';
import NavBar from './NavBar.vue';

export default {
  name: 'app',
  components: {
    NavBar,
    PlotGrid
  },
  mounted: function() {
    let vm = this;
    vm.checkHash();
    
    API.fetchChromosomes().then(function(chromosomeLengths) {
        vm.$store.commit('setChromosomeLengths', chromosomeLengths);
    });

    // resize bindings
    vm.$store.commit('setWindowWidth', window.innerWidth);
    vm.$store.commit('setWindowHeight', window.innerHeight);
    window.addEventListener('resize', debounce(() => {
        vm.$store.commit('setWindowWidth', window.innerWidth);
        vm.$store.commit('setWindowHeight', window.innerHeight);
    }, 250));

  },
  computed: {
    ...mapGetters([
      'selectedChromosome',
      'selectedSignatures',
      'selectedPlots',
      'selectedDatasets',
      'currentMode',
      'currentModeTitle',
      'currentModeOptions'
    ])
  },
  methods: {
    checkHash: function() {
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
        if(params.mode && params.mode.mode && params.mode.title && params.mode.options) {
          vm.$store.commit('setMode', {
              mode: params.mode.mode,
              title: params.mode.title,
              options: params.mode.options
          });
        }
      }
    },
    setHash: function() {
      let hashData = {
        'datasets': this.selectedDatasets,
        'signatures': this.selectedSignatures,
        'plots': this.selectedPlots.map((plotInfo) => {
          return {
            "type": plotInfo.type,
            "options": plotInfo.options,
            "title": plotInfo.title,
            "id": plotInfo.id
          }; 
        }),
        'chr': { 
          'name': this.selectedChromosome.name,
          'start': this.selectedChromosome.start,
          'end': this.selectedChromosome.end
        },
        'mode': {
          'mode': this.currentMode,
          'title': this.currentModeTitle,
          'options': this.currentModeOptions
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
    },
    currentMode: function() {
      this.setHash();
    },
    currentModeTitle: function() {
      this.setHash();
    },
    currentModeOptions: function() {
      this.setHash();
    }
  }
}
</script>

<style lang="scss">
@import './../style/variables.scss';

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: $color-darkgray;
  margin: 0px;
  overflow-x: hidden;
}
</style>
