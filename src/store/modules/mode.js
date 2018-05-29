// initial state
const state = {
    mode: "all-donors",
    title: "All Donors",
    options: {},
    history: []
}

// getters
const getters = {
    currentMode: state => state.mode,
    currentModeTitle: state => state.title,
    currentModeOptions: state => state.options,
    hasPreviousMode: state => (state.history.length > 0),
    isAllDonorsMode: state => (state.mode == "all-donors"),
    isSingleDonorMode: state => (state.mode == "single-donor")
}

// mutations
const mutations = {
    setMode (state, payload) {
        // save current mode
        state.history.push({
            mode: state.mode,
            title: state.title,
            options: state.options
        });
        // update mode
        state.mode = payload.mode;
        state.options = payload.options;
        switch(payload.mode) {
            case "all-donors":
                state.title = "All Donors";
                break;
            case "single-donor":
                state.title = "Single Donor";
                break;
        }
    },
    toPreviousMode (state) {
        if(state.history.length > 0) {
            // get previous mode
            let previousModePayload = state.history.pop();
            // update mode
            state.mode = previousModePayload.mode;
            state.title = previousModePayload.title;
            state.options = previousModePayload.options;
        }
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