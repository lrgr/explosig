import Vue from 'vue'
import Vuex from 'vuex'
import chromosomes from './modules/chromosomes'
import signatures from './modules/signatures'
import internal from './modules/internal'
import datasets from './modules/datasets'
import plots from './modules/plots'
import clinicalVariables from './modules/clinical-variables'


Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    chromosomes,
    signatures,
    internal,
    datasets,
    plots,
    clinicalVariables
  }
})