import TobaccoCV from './clinical-variables/TobaccoCV';
import AlcoholCV from './clinical-variables/AlcoholCV';
import AgeCV from './clinical-variables/AgeCV';
import SexCV from './clinical-variables/SexCV';
import VitalStatusCV from './clinical-variables/VitalStatusCV';

// initial state
const state = {
    selected: [
        new AgeCV(),
        new SexCV(),
        new VitalStatusCV(),
        new TobaccoCV(), 
        new AlcoholCV()
    ]
}

// getters
const getters = {
    selectedClinicalVariables: state => state.selected,
    getClinicalVariable: (state) => (id) => state.selected.find((el) => (el.id == id))
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