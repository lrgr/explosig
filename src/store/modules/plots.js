// initial state
const state = {
    singleDonorMode: [{
        'type': 'RainfallPlot',
        'title': 'Rainfall',
        'id': 'single-donor-rainfall-plot',
        'options': {}
    }],
    allDonorsMode: [{
        'type': 'ExposuresPlot',
        'title': 'Signature Exposures with Clinical Data',
        'id': 'all-donors-exposures-plot',
        'options': {}
    }, {
        'type': 'KataegisPlot',
        'title': 'Kataegis',
        'id': 'all-donors-kataegis-plot',
        'options': {}
    }],
    overviewMode: [{
        'type': 'SignatureGenomeBinsPlot',
        'title': 'Manhattan Plot with Signatures',
        'id': 'overview-manhattan-signatures-plot',
        'options': {}
    }],
    selected: []
}

// getters
const getters = {
    selectedPlots: state => state.selected,
    allDonorsModePlots: state => state.allDonorsMode,
    singleDonorModePlots: state => state.singleDonorMode,
    overviewModePlots: state => state.overviewMode
}

// actions
const actions = {

}

// mutations
const mutations = {
    setSelectedPlots (state, plotList) {
        state.selected = plotList;
    },
    addPlot (state, plotItem) {
        state.selected.push(plotItem);
    },
    removePlot (state, plotID) {
        let index = state.selected.findIndex((plotItem) => (plotItem.id === plotID));
        state.selected.splice(index, 1);
    }
}

export default {
    state,
    getters,
    actions,
    mutations
}