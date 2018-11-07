<template>
  <div id="app">
    <NavBar/>
    <Intro v-if="showIntro" />
    <Explorer v-if="!showIntro" />
  </div>
</template>

<script>
import debounce from 'lodash/debounce';
import { mapMutations, mapGetters } from 'vuex';

import { HistoryStack, EVENT_TYPES, EVENT_SUBTYPES, EVENT_SUBTYPE_RESETS } from 'vue-declarative-plots';
import { IMUSE_EVENT_TYPE_CONFIG, IMUSE_EVENT_SUBTYPE_CONFIG, IMUSE_EVENT_SUBTYPE_RESET_CONFIG } from './../vdp/imuse-events.js';
import Config from './../vdp/Config.js';
import { CategoricalScale, ContinuousScale, GenomeScale, DataContainer } from 'vue-declarative-plots';

import API from './../api.js';


// child components
import NavBar from './NavBar.vue';
import Intro from './Intro.vue';
import Explorer from './Explorer.vue';

export default {
  name: 'app',
  components: {
    NavBar,
    Intro,
    Explorer
  },
  mounted() {
    const vm = this;
    // Initialize the history stack
    const stack = new HistoryStack(
      {
        [EVENT_TYPES.SCALE]: vm.getScale,
        [EVENT_TYPES.DATA]: vm.getData,
        [IMUSE_EVENT_TYPE_CONFIG]: vm.getConfig
      }, 
      {
        [IMUSE_EVENT_SUBTYPE_CONFIG]: IMUSE_EVENT_SUBTYPE_RESET_CONFIG,
        ...EVENT_SUBTYPE_RESETS
      }
    );
    vm.setStack(stack);
    // Initialize the config
    const config = new Config();
    config.onUpdate(vm.name, vm.updateScalesAndData);
    vm.setConfig(config);
    // Initialize all scales and data
    vm.initScalesAndData();

    vm.checkHash();

    // Bindings for resize events
    vm.$store.commit('setWindowWidth', window.innerWidth);
    vm.$store.commit('setWindowHeight', window.innerHeight);
    window.addEventListener('resize', debounce(() => {
        vm.$store.commit('setWindowWidth', window.innerWidth);
        vm.$store.commit('setWindowHeight', window.innerHeight);
    }, 250));

  },
  computed: {
    showIntro() {
      return (this.getConfig() === null || this.getConfig().isEmpty());
    },
    ...mapGetters([
      'getData',
      'getScale',
      'getStack',
      'getConfig'
    ])
  },
  methods: {
    checkHash() {
      let vm = this;
      // check for data in hash
      var paramStr = window.location.hash.substring(1) // remove the initial "#"
      if(paramStr.length > 0 && paramStr.substring(0, 3) != "bib") {
        // TODO: Load history stack from param
      }
    },
    initScalesAndData() {
      const vm = this;

      const sigsSbsScale = new CategoricalScale("sig_sbs", "SBS Signature", []);
      vm.setScale({key: "sig_sbs", scale: sigsSbsScale});
      
    },
    updateScalesAndData() {
      const vm = this;

      
    },
    ...mapMutations([
      'setConfig',
      'setStack',
      'setData',
      'setScale'
    ])
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
