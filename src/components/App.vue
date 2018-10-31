<template>
  <div id="app">
    <NavBar/>
    <Explorer/>
  </div>
</template>

<script>
import debounce from 'lodash/debounce';
import { mapGetters } from 'vuex';
import API from './../api.js';

// child components
import NavBar from './NavBar.vue';
import Explorer from './Explorer.vue';

export default {
  name: 'app',
  components: {
    NavBar,
    Explorer
  },
  mounted: function() {
    let vm = this;
    vm.checkHash();

    // resize bindings
    vm.$store.commit('setWindowWidth', window.innerWidth);
    vm.$store.commit('setWindowHeight', window.innerHeight);
    window.addEventListener('resize', debounce(() => {
        vm.$store.commit('setWindowWidth', window.innerWidth);
        vm.$store.commit('setWindowHeight', window.innerHeight);
    }, 250));

  },
  methods: {
    checkHash: function() {
      let vm = this;
      // check for data in hash
      var paramStr = window.location.hash.substring(1) // remove the initial "#"
      if(paramStr.length > 0 && paramStr.substring(0, 3) != "bib") {
        // TODO: Load history stack from param
      }
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
