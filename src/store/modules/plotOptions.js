// initial state
const state = {
    loading: true,

    selectedSignatures: [],
    selectedSources: [],

    allSignatures: [1, 2],
    allSources: [],
    sigPresets: []
}

 // getters
const getters = {
    selectedSignatures: state => state.selectedSignatures,
    selectedSources: state => state.selectedSources,
    allSignatures: state => state.allSignatures,
    allSources: state => state.allSources
}

// actions
const actions = {
  getAllProducts ({ commit }) {
    
  }
}

// mutations
const mutations = {
  setSelectedSignatures (state, selected) {
    state.selectedSignatures = selected
  },
  setSelectedSources (state, selected) {
    state.selectedSources = selected
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
