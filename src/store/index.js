import Vue from 'vue'
import Vuex from 'vuex'
import chromosomes from './modules/chromosomes'
import signatures from './modules/signatures'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    chromosomes,
    signatures
  }
})