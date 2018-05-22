// initial state
const state = {
    selected: {
        name: "*",
        start: 0,
        end: 0
    },
    lengths: {}
}

// getters
const getters = {
    showAllChromosomes: state => (state.selected.name == "*"),
    selectedChromosome: state => state.selected,
    chromosomeLength: (state) => (name) => {
        return state.lengths[name];
    }
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
    },
    setChromosomeLengths (state, chromosomeLengths) {
        state.lengths = chromosomeLengths;
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}