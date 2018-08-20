// initial state
const state = {
    selected: {
        name: "*",
        start: 0,
        end: 0
    }
}

// getters
const getters = {
    showAllChromosomes: state => (state.selected.name == "*"),
    selectedChromosome: state => state.selected
}

// actions
const actions = {

}

// mutations
const mutations = {
    setSelectedChromosome (state, chrOptions) {
        state.selected.name = chrOptions.name;
        state.selected.start = chrOptions.start;
        state.selected.end = chrOptions.end;
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}