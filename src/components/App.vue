<template>
  <div id="app">
    <NavBar/>
    <Intro v-if="showIntro" :restartImport="restartImport" :resumeImport="resumeImport" :importSlug="importSlug" />
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
      explorerKey: 1,
      importedState: null,
      importSlug: ""
    };
  },
  mounted() {
    const vm = this;
    
    // Initialize the config
    const config = new Config();
    config.onUpdate(vm.name, vm.rerender);
    vm.setConfig(config);


    vm.checkHash();
    window.addEventListener('hashchange', vm.checkHash);

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
      return (this.getConfig() === null || this.getConfig().isEmpty()) && !(this.isSession && this.isEmptySession);
    },
    ...mapGetters([
      'getConfig',
      'getStack',
      'isSession',
      'isEmptySession'
    ])
  },
  methods: {
    checkHash() {
      // check for data in hash
      let paramStr = window.location.hash.substring(1) // remove the initial "#"
      if(paramStr.length > 0 && paramStr.substring(0, 6) === "export") {
        // Load history stack from param
        let slug = paramStr.substring(7, 15);
        this.importSlug = slug;
        this.setIsImporting(true);
        this.setFromImport(true);

        this.getConfig().resetConfig();

        API.getSharingState(slug).then((data) => {
          this.setIsImporting(false);
          this.importedState = JSON.parse(data.state);
        });
      } else if(paramStr.length > 0 && paramStr.substring(0,7) === "session") {
          // Start "empty" session
          const sessionId = paramStr.substring(8, 16);
          this.getConfig().resetConfig();
          API.connectSession(sessionId);
          this.setSession({ isSession: true, isEmptySession: true, sessionId: sessionId});
      }
    },
    rerender() {
      // Force a re-render by updating the key prop
      this.explorerKey++;
    },
    clearImport() {
      this.setIsImporting(false);
      this.setFromImport(false);
      this.importedState = null;
      this.importSlug = "";
    },
    resumeImportAux() {
      let stack = this.getStack();
      API.promiseAll().then(() => {
        if(stack.canGoForward()) {
          stack.goForward();
          setTimeout(this.resumeImportAux, 10); // give the browser a tiny chance to breathe
        } else {
          this.setIsLoading(false);
        }
      }).catch(() => {
        this.setIsLoading(false);
      });
    },
    resumeImport() {
      if(this.importedState !== null) {
        this.getConfig().import(this.importedState.config);
        this.setIsLoading(true);
        this.$nextTick(() => {
          let stack = this.getStack();
          stack.import(this.importedState.history);
          this.clearImport();
          this.resumeImportAux();
        });
      }
    },
    restartImport() {
      if(this.importedState !== null) {
        this.getConfig().import(this.importedState.config);
        this.$nextTick(() => {
          let stack = this.getStack();
          stack.import(this.importedState.history);
          this.clearImport();
        });
      }
    },
    ...mapMutations([
      'setConfig',
      'setIsImporting',
      'setFromImport',
      'setIsLoading',
      'setSession',
    ])
  }
}
</script>

<style lang="scss">
@import './../style/variables.scss';
@import '~vueplotlib/dist/vueplotlib.css';

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: $color-darkgray;
  margin: 0px;
  overflow-x: hidden;
}

.vdp-plot-highlight-rect {
    display: none !important;
}
</style>
