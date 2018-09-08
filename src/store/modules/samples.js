
// initial state
const state = {
    all: []
}

// getters
const getters = {
    allSamples: state => state.all
}

// mutations
const mutations = {
    setSamples (state, samples) {
        state.all = samples;
    }
}

// actions
const actions = {
    
}

export default {
    state,
    getters,
    mutations,
    actions
}