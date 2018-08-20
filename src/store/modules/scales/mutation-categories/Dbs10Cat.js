import AbstractMutationCategoryScale from './AbstractMutationCategoryScale.js';

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

}