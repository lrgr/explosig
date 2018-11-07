import Vue from 'vue'
import Vuex from 'vuex'

import internal from './modules/internal'
import bib from './modules/bib'
import explorer from './modules/explorer'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    internal,
    bib,
    explorer
  }
})