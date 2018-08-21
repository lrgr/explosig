import AbstractMutationCategoryScale from './AbstractMutationCategoryScale.js';

const DBS_10_CATEGORIES = [
    'AC>NN',
    'AT>NN',
    'CC>NN',
    'CG>NN',
    'CT>NN',
    'GC>NN',
    'TA>NN',
    'TC>NN',
    'TG>NN',
    'TT>NN'
];

export default class Dbs10Cat extends AbstractMutationCategoryScale {
    
    get id() {
        return 'DBS_10';
    }
    
    get name() {
        return 'DBS 10';
    }

    get mutationType() {
        return AbstractMutationCategoryScale._mutationType.DBS;
    }

    get domain() {
        return DBS_10_CATEGORIES;
    }

}