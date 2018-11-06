import * as d3 from 'd3';
import AbstractCategoricalScale from '../AbstractCategoricalScale.js';


export default class AbstractMutationCategoryScale extends AbstractCategoricalScale {

    static _mutationType = Object.freeze({ SBS:'SBS', DBS:'DBS', INDEL:'INDEL' });
    
    get id () {
        throw new Error('You have to implement the getter id!');
    }
    
    get name () {
        throw new Error('You have to implement the getter name!');
    }

    get mutationType() {
        throw new Error('You have to implement the getter mutation type!');
    }

    get domain() {
        throw new Error('You have to implement the getter domain!');
    }

    get range() {
        return Array.apply(null, { length: this.domain.length }).map(Number.call, Number)
    }
    
}