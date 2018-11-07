// initial state
const state = {
    config: null,
    stack: null,
    data: {},
    scales: {}
}

// getters
const getters = {
    getConfig: (state) => () => {
        return state.config;
    },
    getStack: (state) => () => {
        return state.stack;
    },
    getData: (state) => (key) => {
        return state.data[key];
    },
    getScale: (state) => (key) => {
        return state.scales[key];
    }
}

// actions
const actions = {

}

// mutations
const mutations = {
    setConfig(state, config) {
        state.config = config;
    },
    setStack(state, stack) {
        state.stack = stack;
    },
    setData(state, { key, datum }) {
        state.data[key] = datum;
    },
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