import * as d3 from 'd3';
import { LegendListBus } from '../../buses.js';
import { MUT_TYPES } from '../../constants.js';

// initial state
const state = {
    selected: {
        'SBS': [],
        'DBS': [],
        'INDEL': []
    },
    all: {
        'SBS': [],
        'DBS': [],
        'INDEL': []
    },
    signatureGroups: [],
    colorScale: d3.interpolateRainbow
}

// getters
const getters = {
    allSignatures: state => state.all,
    allSignaturesFlat: state => {
        let result = [];
        for(let mutType of MUT_TYPES) {
            for(let sig of state.all[mutType]) {
                result.push(sig);
            }
        }
        return result;
    },
    selectedSignatures: state => state.selected,
    selectedSignaturesFlat: state => {
        let result = [];
        for(let mutType of MUT_TYPES) {
            for(let sig of state.selected[mutType]) {
                result.push(sig);
            }
        }
        return result;
    },
    selectedSignatureNames: state => {
        let result = {};
        for(let mutType of MUT_TYPES) {
            result[mutType] = state.selected[mutType].map((el) => el.name);
        }
        return result;
    },
    signatureGroups: state => state.signatureGroups,
    signatureColor: (state) => (name, mutType) => state.colorScale(
        state.selected[mutType].findIndex((el) => (el.name === name)) / parseFloat(state.selected[mutType].length)
    )
}

// mutations
const mutations = {
    setSelectedSignatures (state, signatures) {
        state.selected = signatures;
        for(let mutType of Object.keys(state.selected)) {
            state.selected[mutType].sort((a, b) => {
                return a.index - b.index;
            });
        }
    },
    setSelectedSignaturesFlat (state, signatures) {
        for(let mutType of Object.keys(state.selected)) {
            state.selected[mutType] = [];
        }
        for(let sig of signatures) {
            state.selected[sig.mutType].push(sig);
        }
        for(let mutType of Object.keys(state.selected)) {
            state.selected[mutType].sort((a, b) => {
                return a.index - b.index;
            });
        }
    },
    setAllSignatures (state, signatures) {
        for(let mutType of Object.keys(state.all)) {
            state.all[mutType] = signatures[mutType];
        }
    },
    setSignatureGroups (state, signatureGroups) {
        state.signatureGroups = signatureGroups;
    }
}

// actions
const actions = {
    emitSignaturesLegend ({ state }) {
        for(let mutType of Object.keys(state.selected)) {
            LegendListBus.$emit("signatures", {
                "meta": {
                    "title": (mutType + " Signatures")
                },
                "data": state.selected[mutType].map((signature) => {
                    return {
                        "name": signature.name,
                        "color": (getters.signatureColor(state))(signature.name)
                    };
                })
            });
        }
    }
}

export default {
    state,
    getters,
    mutations,
    actions
}