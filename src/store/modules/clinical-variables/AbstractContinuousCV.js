import * as d3 from 'd3';
import AbstractCV from './AbstractCV.js';

export default class AbstractContinuousCV extends AbstractCV {
    
    get id() {
        throw new Error('You have to implement the getter id!');
    }
    
    get name() {
        throw new Error('You have to implement the getter name!');
    }

    get scale() {
        return d3.scaleLinear()
            .domain(this.domain)
            .range(this.range);
    }

    get scaleType() {
        return AbstractCV.type.CONTINUOUS;
    }

    get range() {
        // implementation example:
        // return [minVal, maxVal];
        throw new Error('You have to implement the getter range!');
    }

    get domain() {
        // implementation example:
        // return [minVal, maxVal];
        throw new Error('You have to implement the getter domain!');
    }

    get colorScale() {
        return d3.interpolateYlOrRd;
    }

    color(domainValue) {
        if(AbstractCV.isUnknown(domainValue)) {
            return AbstractCV.unknownColor;
        }
        return this.colorScale((domainValue - this.domain[0]) / parseFloat(this.domain[1] - this.domain[0]));
    }

    comparator(a, b) {
        return d3.descending(
            (a == "nan" ? -1 : +a), 
            (b == "nan" ? -1 : +b)
        );
    }

}