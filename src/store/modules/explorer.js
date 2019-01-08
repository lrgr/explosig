// initial state
const state = {
    config: null,
    stack: null,
    stratification: null,
    visibility: null,
    samples: null,
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
    getStratification: (state) => () => {
        return state.stratification;
    },
    getVisibility: (state) => () => {
        return state.visibility;
    },
    getSamples: (state) => () => {
        return state.samples;
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
    setStratification(state, stratification) {
        state.stratification = stratification;
    },
    setVisibility(state, visibility) {
        state.visibility = visibility;
    },
    setSamples(state, samples) {
        state.samples = samples;
    },
    setData(state, { key, data }) {
        state.data[key] = data;
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