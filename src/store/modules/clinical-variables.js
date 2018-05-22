// initial state
const state = {
    selected: ["alcohol_binary", "tobacco_binary"],
    all: [{
        "id": "alcohol_binary",
        "name": "Alcohol"
    }, {
        "id": "tobacco_binary",
        "name": "Tobacco"
    }]
}

// getters
const getters = {
    selectedClinicalVariables: state => state.selected,
    allClinicalVariables: state => state.all
}

// actions
const actions = {

}

// mutations
const mutations = {

}

export default {
    state,
    getters,
    actions,
    mutations
}