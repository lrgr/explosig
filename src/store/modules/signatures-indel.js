// initial state
const state = {
    selected: []
}

// getters
const getters = {
    selectedSignaturesIndel: state => state.selected
}

// actions
const actions = {

}

// mutations
const mutations = {
    setSelectedSignaturesIndel (state, selectedSigs) {
        state.selected = selectedSigs.slice();
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}