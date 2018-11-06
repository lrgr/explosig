// initial state
const state = {
    singleDonorMode: [{
        'type': 'SingleSampleExposuresPlot',
        'title': 'Signature Exposures with Clinical Data',
        'id': 'single-sample-exposures-plot'
    }, {
        'type': 'RainfallPlot',
        'title': 'Rainfall',
        'id': 'single-donor-rainfall-plot'
    }/*,
    {
        'type': 'SignatureGenomeBinsPlot',
        'title': 'Manhattan Plot with Signatures',
        'id': 'single-donor-manhattan-signatures-plot'
    }*/],
    allDonorsMode: [{
        'type': 'ExposuresPlot',
        'title': 'Signature Exposures with Clinical Data',
        'id': 'all-donors-exposures-plot'
    }, {
        'type': 'ClusterPlot',
        'title': 'Hierarchical Clustering',
        'id': 'all-donors-cluster-plot'
    }, {
        'type': 'KataegisPlot',
        'title': 'Kataegis',
        'id': 'all-donors-kataegis-plot'
    }],
    overviewMode: [
        {
            'type': 'SamplesWithSignaturesPlot',
            'title': 'Samples With Signatures',
            'id': 'overview-samples-with-sigs-plot'
        }
    ],
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