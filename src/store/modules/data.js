// initial state
const state = {
    data: {}
}

// getters
const getters = {
    getData: (state) => (key) => {
        return state.data[key];
    }
}

// actions
const actions = {

}

// mutations
const mutations = {
    setData(state, { key, datum }) {
        state.data[key] = datum;
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}