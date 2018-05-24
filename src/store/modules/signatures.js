import * as d3 from 'd3';
import { LegendListBus } from '../../buses.js';

// initial state
const state = {
    selected: [],
    all: [],
    perCancerType: [],
    colorScale: d3.interpolateRainbow
}

// getters
const getters = {
    allSignatures: state => state.all,
    selectedSignatures: state => state.selected,
    signaturesPerCancerType: state => state.perCancerType,
    signatureColor: (state) => (name) => state.colorScale(
        state.selected.findIndex((el) => (el === name)) / parseFloat(state.selected.length)
    )
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

// actions
const actions = {
    emitSignaturesLegend ({ state }) {
        LegendListBus.$emit("signatures", {
            "meta": {
                "title": "Signatures"
            },
            "data": state.selected.map((name) => {
                return {
                    "name": name,
                    "color": (getters.signatureColor(state))(name)
                };
            })
        });
    }
}

export default {
    state,
    getters,
    mutations,
    actions
}