// initial state
const state = {
    selected: []
}

// getters
const getters = {
    selectedSignaturesDbs: state => state.selected
}

// actions
const actions = {

}

// mutations
const mutations = {
    setSelectedSignaturesDbs (state, selectedSigs) {
        state.selected = selectedSigs.slice();
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}