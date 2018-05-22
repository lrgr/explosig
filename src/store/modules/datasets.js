// initial state
const state = {
    all: {},
    selected: []
}

// getters
const getters = {
    selectedDatasets: state => state.selected,
    allDatasets: state => state.all
}

// actions
const actions = {

}

// mutations
const mutations = {
    setSelectedDatasets (state, datasetList) {
        state.selected = datasetList;
    },
    setAllDatasets (state, datasetDict) {
        state.all = datasetDict;
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}