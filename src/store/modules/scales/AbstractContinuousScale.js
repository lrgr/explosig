import * as d3 from 'd3';
import AbstractScale from './AbstractScale.js';

export default class AbstractContinuousScale extends AbstractScale {
    
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
        return AbstractScale._type.CONTINUOUS;
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
        if(AbstractScale.isUnknown(domainValue)) {
            return AbstractScale.unknownColor;
        }
        return this.colorScale((domainValue - this.domain[0]) / parseFloat(this.domain[1] - this.domain[0]));
    }

    comparator(a, b) {
        return d3.descending(
            (a == "nan" ? -1 : +a), 
            (b == "nan" ? -1 : +b)
        );
    }

    categorize_color(domainValue) {
        // Classify a value into a category and return a clipped value
        // The number does not matter other than for coloring purposes
        // For example: age < 60 returns 0 and age >= 60 returns 100
        throw new Error('You have to implement the partitioner!');
    }

    categorize_string(domainValue) {
        // Classify a value into a category and return a string
        // For example: age < 60 or age >= 60
        throw new Error('You have to implement the partitioner!');
    }

}