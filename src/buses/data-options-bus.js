import Vue from 'vue';
export const DataOptionsBus = new Vue();

export const globalDataOptions = {
    'sources': [],
    'signatures': []
};

export const globalChromosomeSelected = {
    value: "1"
};

export const globalChromosomeLocation = {
    start: 0,
    end: 249250621
};

export const globalPlotList = [];

export const globalLegendList = {
    "signatures": {
        "meta": {
            "title": "Signatures"
        },
        "data": {}
    },
    "projects": {
        "meta": {
            "title": "Samples"
        },
        "data": {}
    },
    "contexts": {
        "meta": {
            "title": "Mutation Types"
        },
        "data": {}
    },
    "clinical": {
        "meta": {
            "title": "Clinical Variables"
        },
        "data": {}
    } 
};