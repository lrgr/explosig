import AbstractMutationCategoryScale from './AbstractMutationCategoryScale.js';

export default class Dbs78Cat extends AbstractMutationCategoryScale {
    
    get id() {
        return 'DBS_78';
    }
    
    get name() {
        return 'DBS 78';
    }

    get mutationType() {
        return AbstractMutationCategoryScale._mutationType.DBS;
    }

}