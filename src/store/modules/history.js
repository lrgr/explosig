// initial state
const state = {
    stack: null
}

// getters
const getters = {
    getStack: (state) => () => {
        return state.stack;
    }
}

// actions
const actions = {

}

// mutations
const mutations = {
    setStack(state, stack) {
        state.stack = stack;
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}