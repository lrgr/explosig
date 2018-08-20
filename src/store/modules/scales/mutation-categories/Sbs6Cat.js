import AbstractMutationCategoryScale from './AbstractMutationCategoryScale.js';

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

}