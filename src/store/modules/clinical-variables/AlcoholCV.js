import * as d3 from 'd3';
import AbstractBinaryCV from './AbstractBinaryCV';

export default class AlcoholCV extends AbstractBinaryCV {
    
    get id () {
        return "Alcohol Binary";
    }
    
    get name () {
        return "Alcohol User";
    }
    
}