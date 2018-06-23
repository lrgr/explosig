// initial state
const state = {
    mode: "all-donors",
    title: "All Donors",
    allModes: [
        {
            mode: "signatures",
            title: "Signatures"
        },
        {
            mode: "overview",
            title: "Overview"
        }, {
            mode: "all-donors",
            title: "All Donors"
        }, {
            mode: "single-donor",
            title: "Single Donor"
        }
    ],
    options: {}
}

// getters
const getters = {
    allModes: state => state.allModes,
    currentMode: state => state.mode,
    currentModeTitle: state => state.title,
    currentModeOptions: state => state.options,
    isAllDonorsMode: state => (state.mode == "all-donors"),
    isSingleDonorMode: state => (state.mode == "single-donor"),
    isOverviewMode: state => (state.mode == "overview"),
    isSignaturesMode: state => (state.mode == "signatures")
}

// mutations
const mutations = {
    setMode (state, payload) {
        state.mode = payload.mode;
        state.options = payload.options;
        state.title = state.allModes.find((el) => (el.mode == payload.mode)).title;
    }
}

// actions
const actions = {

}

export default {
    state,
    getters,
    mutations,
    actions
}