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
    },
    removePlot (state, plotID) {
        let index = state.selected.findIndex((plotItem) => (plotItem.id === plotID));
        state.selected.splice(index, 1);
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}