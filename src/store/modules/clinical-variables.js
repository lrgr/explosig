import * as d3 from 'd3';
import { LegendListBus } from '../../buses.js';

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