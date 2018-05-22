// initial state
const state = {
    windowWidth: 0,
    windowHeight: 0
}

// getters
const getters = {
    windowWidth: state => state.windowWidth,
    windowHeight: state => state.windowHeight
}

// actions
const actions = {

}

// mutations
const mutations = {
    setWindowWidth (state, windowWidth) {
        state.windowWidth = windowWidth;
    },
    setWindowHeight (state, windowHeight) {
        state.windowHeight = windowHeight;
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}