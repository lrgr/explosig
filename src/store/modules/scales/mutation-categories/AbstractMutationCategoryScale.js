import * as d3 from 'd3';
import AbstractCategoricalScale from '../AbstractCategoricalScale.js';
import { CATEGORY_INDEX } from '../../../../constants';


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

    get range() {
        return Object.values(CATEGORY_INDEX[this.id]);
    }

    get domain() {
        return Object.keys(CATEGORY_INDEX[this.id]);
    }
    
}