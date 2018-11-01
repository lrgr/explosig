// initial state
const state = {
    scales: {}
}

// getters
const getters = {
    getScale: (state) => (key) => {
        return state.scales[key];
    }
}

// actions
const actions = {

}

// mutations
const mutations = {
    setScale(state, { key, scale }) {
        state.scales[key] = scale;
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}