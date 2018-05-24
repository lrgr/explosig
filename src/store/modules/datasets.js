import * as d3 from 'd3';
import { LegendListBus } from '../../buses.js';

// initial state
const state = {
    all: {},
    selected: [],
    colorScale: d3.interpolateRainbow
}

// getters
const getters = {
    selectedDatasets: state => state.selected,
    allDatasets: state => state.all,
    datasetColor: (state) => (name) => d3.hsl(d3.hsl(
        state.colorScale(
            state.selected.findIndex((el) => (el === name)) / parseFloat(state.selected.length)
        )
    ).h, 1.00, 0.87).toString()
}

// mutations
const mutations = {
    setSelectedDatasets (state, datasetList) {
        state.selected = datasetList;
    },
    setAllDatasets (state, datasetDict) {
        state.all = datasetDict;
    }
}

// actions
const actions = {
    emitDatasetsLegend ({ state }) {
        LegendListBus.$emit("datasets", {
            "meta": {
                "title": "Samples"
            },
            "data": state.selected.map((name) => {
                return {
                    "name": name,
                    "color": (getters.datasetColor(state))(name)
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