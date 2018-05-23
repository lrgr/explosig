// initial state
const state = {
    selected: [],
    all: [],
    perCancerType: []
}

// getters
const getters = {
    allSignatures: state => state.all,
    selectedSignatures: state => state.selected,
    signaturesPerCancerType: state => state.perCancerType
}

// actions
const actions = {

}

// mutations
const mutations = {
    setSelectedSignatures (state, sigNames) {
        sigNames.sort((a, b) => {
            let a_index = state.all.findIndex((el) => (el.name === a));
            let b_index = state.all.findIndex((el) => (el.name === b));
            return a_index - b_index;
        });
        state.selected = sigNames;
    },
    setAllSignatures (state, allSignatures) {
        state.all = allSignatures;
    },
    setSignaturesPerCancerType (state, perCancerType) {
        state.perCancerType = perCancerType;
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}