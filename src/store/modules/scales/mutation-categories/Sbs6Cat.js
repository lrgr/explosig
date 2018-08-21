import AbstractMutationCategoryScale from './AbstractMutationCategoryScale.js';

const SBS_6_CATEGORIES = [
    'C>A', 
    'C>G',
    'C>T',
    'T>A',
    'T>C',
    'T>G'
];

export default class Sbs6Cat extends AbstractMutationCategoryScale {
    
    get id() {
        return 'SBS_6';
    }
    
    get name() {
        return 'SBS 6';
    }

    get mutationType() {
        return AbstractMutationCategoryScale._mutationType.SBS;
    }

    get domain() {
        return SBS_6_CATEGORIES;
    }

}