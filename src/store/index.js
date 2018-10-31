import Vue from 'vue'
import Vuex from 'vuex'

import internal from './modules/internal'
import bib from './modules/bib'
import history from './modules/history'

import signaturesSbs from './modules/signatures-sbs'
import signaturesDbs from './modules/signatures-dbs'
import signaturesIndel from './modules/signatures-indel'
import samples from './modules/samples'
import clinicalVariables from './modules/clinical-variables'
import genes from './modules/genes'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    internal,
    bib,
    history,

    signaturesSbs,
    signaturesDbs,
    signaturesIndel,
    samples,
    clinicalVariables,
    genes
  }
})