import * as d3 from 'd3';
import AbstractScale from './AbstractScale.js';

export default class AbstractBinaryScale extends AbstractScale {
    
    get id () {
        throw new Error('You have to implement the getter id!');
    }
    
    get name () {
        throw new Error('You have to implement the getter name!');
    }

    get scale() {
        return d3.scaleOrdinal()
            .domain(this.domain)
            .range(this.range);
    }

    get scaleType() {
        return AbstractScale._type.DISCRETE;
    }

    get range () {
        return ["Yes", "No"];
    }

    get domain () {
        return [1, 0];
    }

    color (domainValue) {
        if(AbstractScale.isUnknown(domainValue)) {
            return AbstractScale.unknownColor;
        }
        return this.colorScale(1 - domainValue);
    }

    comparator(a, b) {
        return d3.descending(
            (a == "nan" ? -1 : +a), 
            (b == "nan" ? -1 : +b)
        );
    }

}