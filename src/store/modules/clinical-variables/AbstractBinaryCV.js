import * as d3 from 'd3';
import AbstractCV from './AbstractCV.js';

export default class AbstractBinaryCV extends AbstractCV {
    
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
        return AbstractCV.type.DISCRETE;
    }

    get range () {
        return ["Yes", "No"];
    }

    get domain () {
        return [1, 0];
    }

    color (domainValue) {
        if(AbstractCV.isUnknown(domainValue)) {
            return AbstractCV.unknownColor;
        }
        return this.colorScale(domainValue);
    }

    comparator(a, b) {
        return d3.descending(
            (a == "nan" ? -1 : +a), 
            (b == "nan" ? -1 : +b)
        );
    }

}