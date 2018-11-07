<template>
  <div id="app">
    <NavBar/>
    <Intro v-if="showIntro" />
    <Explorer v-if="!showIntro" :key="explorerKey" />
  </div>
</template>

<script>
import debounce from 'lodash/debounce';
import { mapMutations, mapGetters } from 'vuex';

import Config from './../vdp/Config.js';

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
  data() {
    return {
      explorerKey: 1
    };
  },
  mounted() {
    const vm = this;
    
    // Initialize the config
    const config = new Config();
    config.onUpdate(vm.name, vm.rerender);
    vm.setConfig(config);
   

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
    rerender() {
       // Force a re-render by updating the key prop
      this.explorerKey++;
      
    },
    ...mapMutations([
      'setConfig'
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
