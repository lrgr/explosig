// initial state
const state = {
    selected: []
}

// getters
const getters = {
    selectedSignaturesSbs: state => state.selected
}

// actions
const actions = {

}

// mutations
const mutations = {
    setSelectedSignaturesSbs (state, selectedSigs) {
        state.selected = selectedSigs.slice();
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}