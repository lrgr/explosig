import AbstractMutationCategoryScale from './AbstractMutationCategoryScale.js';

export default class Sbs96Cat extends AbstractMutationCategoryScale {
    
    get id() {
        return 'SBS_96';
    }
    
    get name() {
        return 'SBS 96';
    }

    get mutationType() {
        return AbstractMutationCategoryScale._mutationType.SBS;
    }

}