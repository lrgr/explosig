import TobaccoCV from './scales/clinical-variables/TobaccoCV';
import AlcoholCV from './scales/clinical-variables/AlcoholCV';
import AgeCV from './scales/clinical-variables/AgeCV';
import SexCV from './scales/clinical-variables/SexCV';
import VitalStatusCV from './scales/clinical-variables/VitalStatusCV';

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