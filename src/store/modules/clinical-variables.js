import * as d3 from 'd3';
import { LegendListBus } from '../../buses.js';

// initial state
const state = {
    selected: ["Alcohol Binary", "Tobacco Binary"],
    all: [{
        "id": "Alcohol Binary",
        "name": "Alcohol"
    }, {
        "id": "Tobacco Binary",
        "name": "Tobacco"
    }, {
        "id": "Tobacco Intensity",
        "name": "Tobacco Intensity"
    }]
}

// getters
const getters = {
    selectedClinicalVariables: state => state.selected,
    allClinicalVariables: state => state.all,
    clinicalVariable: (state) => (varID) => state.all.find((el) => (el.id == varID))
}

// mutations
const mutations = {

}

// actions
const actions = {
    emitClinicalVariablesLegend ({ state }) {
        LegendListBus.$emit("clinicalVariables", {
            "meta": {
                "title": "Alcohol/Tobacco Use"
            },
            "data": [
                { "name": "Yes", "color": "#000" },
                { "name": "No", "color": "#FFF" },
                { "name": "Unknown", "color": null }
            ]
        });
    }
}

export default {
    state,
    getters,
    mutations,
    actions
}