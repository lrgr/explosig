import * as d3 from 'd3';
import AbstractBinaryScale from '../AbstractBinaryScale';

export default class AlcoholCV extends AbstractBinaryScale {
    
    get id () {
        return "Alcohol Binary";
    }
    
    get name () {
        return "Alcohol User";
    }
    
}