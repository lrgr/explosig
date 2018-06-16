import * as d3 from 'd3';
import { LegendListBus } from '../../../buses.js';

export default class AbstractCV {

    static type = Object.freeze({ DISCRETE:1, CONTINUOUS:2 });
    static unknownColor = "#E3E3E3";
    
    get id () {
        throw new Error('You have to implement the getter id!');
    }
    
    get name () {
        throw new Error('You have to implement the getter name!');
    }

    get scale() {
        throw new Error('You have to implement the getter scale!');
    }

    get scaleType() {
        throw new Error('You have to implement the getter scaleType!');
    }

    get range () {
        throw new Error('You have to implement the getter range!');
    }

    get domain () {
        throw new Error('You have to implement the getter domain!');
    }

    get colorScale () {
        return d3.interpolateRdYlBu;
    }

    transform (domainValue) {
        if(AbstractCV.isUnknown(domainValue)) {
            return "Unknown";
        }
        return this.scale(+domainValue);
    }

    color () {
        throw new Error('You have to implement the method color!');
    }

    emitLegend () {
        LegendListBus.$emit(this.id, {
            "meta": {
                "title": this.name,
                "type": this.scaleType
            },
            "data": this.domain.map((domainValue) => {
                return {
                    "name": this.transform(domainValue),
                    "color": this.color(domainValue)
                };
            })
        });
    }

    comparator() {
        throw new Error('You have to implement the method comparator!');
    }

    static isUnknown(domainValue) {
        return (domainValue == "nan" || domainValue === undefined);
    }
}