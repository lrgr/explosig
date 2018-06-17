import * as d3 from 'd3';
import AbstractCV from './AbstractCV.js';

export default class AbstractCategoricalCV extends AbstractCV {
    
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

    get range() {
        // implementation example:
        // return [0, 1, 2];
        throw new Error('You have to implement the getter range!');
    }

    get domain() {
        // implementation example:
        // return ["string0", "string1", "string2"];
        throw new Error('You have to implement the getter domain!');
    }

    color (domainValue) {
        if(AbstractCV.isUnknown(domainValue)) {
            return AbstractCV.unknownColor;
        }
        return this.colorScale(this.domain.findIndex((el) => (el === domainValue)) / parseFloat(this.domain.length - 1));
    }

    comparator(a, b) {
        return d3.descending(
            (a == "nan" ? -1 : this.domain.indexOf(a)), 
            (b == "nan" ? -1 : this.domain.indexOf(b))
        );
    }

}