import TobaccoCV from './clinical-variables/TobaccoCV';
import AlcoholCV from './clinical-variables/AlcoholCV';
import AgeCV from './clinical-variables/AgeCV';

// initial state
const state = {
    selected: [
        new TobaccoCV(), 
        new AlcoholCV(), 
        new AgeCV()
    ]
}

// getters
const getters = {
    selectedClinicalVariables: state => state.selected
}

// mutations
const mutations = {

}

// actions
const actions = {
    emitClinicalVariablesLegend ({ state }) {
        for(var cv of state.selected) {
            cv.emitLegend();
        }
    }
}

export default {
    state,
    getters,
    mutations,
    actions
}