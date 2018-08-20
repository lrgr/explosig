import Sbs6Cat from './scales/mutation-categories/Sbs6Cat';
import Sbs96Cat from './scales/mutation-categories/Sbs96Cat';
import Dbs10Cat from './scales/mutation-categories/Dbs10Cat';
import Dbs78Cat from './scales/mutation-categories/Dbs78Cat';

const CATEGORY_SCALES = {
    'SBS': [
        new Sbs6Cat(),
        new Sbs96Cat()
    ],
    'DBS': [
        new Dbs10Cat(),
        new Dbs78Cat()
    ]/*,
    'INDEL': [
        'INDEL_Alexandrov2018_16',
        'INDEL_Alexandrov2018_83'
    ]*/
};

// initial state
const state = {
    selectedScales: {
        'SBS': CATEGORY_SCALES['SBS'][1],
        'DBS': CATEGORY_SCALES['DBS'][1]
    }
}

// getters
const getters = {
    getCategoryTypes: () => Object.keys(CATEGORY_SCALES),
    getSelectedCategoryScale: state => (mutationType) => state.selectedScales[mutationType],
    getAllCategoryScales: () => (mutationType) => CATEGORY_SCALES[mutationType]
}

// mutations
const mutations = {

}

// actions
const actions = {
    // TODO: emit legend?
}

export default {
    state,
    getters,
    mutations,
    actions
}