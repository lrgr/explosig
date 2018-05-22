// initial state
const state = {
    selected: []
}

// getters
const getters = {
    selectedPlots: state => state.selected
}

// actions
const actions = {

}

// mutations
const mutations = {
    setSelectedPlots (state, plotList) {
        state.selected = plotList;
    },
    addPlot (state, plotItem) {
        state.selected.push(plotItem);
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}