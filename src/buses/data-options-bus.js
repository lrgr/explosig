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

export const globalLegendKeys = [
    "signatures",
    "projects",
    "contexts",
    "clinical"
];

export const globalMeta = {
    'signatures': []
};

export const LegendListBus = new Vue();