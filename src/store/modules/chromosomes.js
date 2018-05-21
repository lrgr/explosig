import { chromosomes } from '../../constants'
// initial state
const state = {
    selected: {
        name: "1",
        start: 0,
        end: 249250621
    },
    lengths: {}
}

// getters
const getters = {
    allChromosomes: state => chromosomes,
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