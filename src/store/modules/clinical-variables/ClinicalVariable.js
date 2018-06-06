import * as d3 from 'd3';

export default class ClinicalVariable {

    static type = Object.freeze({ BINARY:1, DISCRETE:2, CONTINUOUS:3 });
    
    static get id () {
        throw new Error('You have to implement the method id!');
    }
    
    static get name () {
        throw new Error('You have to implement the method name!');
    }

    static get scale() {
        return d3.scaleBand()
            .domain(this.domain())
            .range(this.range());
    }

    static get scaleType() {
        return this.type.BINARY;
    }

    static get range () {
        return ["No", "Yes", "Unknown"];
    }

    static get domain () {
        return [0, 1, "nan"];
    }

    static get colorScale () {
        return d3.interpolateRainbow;
    }

    static transform (domainValue) {
        return this.range()[this.domain().findIndex((el) => (el === domainValue))];
    }

    static color (domainValue) {
        return this.colorScale(this.domain().findIndex((el) => (el === domainValue)) / parseFloat(this.domain().length));
    }

    static emitLegend () {
        LegendListBus.$emit("clinicalVariable-" + this.id(), {
            "meta": {
                "title": this.name(),
                "type": this.scaleType()
            },
            "data": this.domain().map((domainValue) => { return { "name": this.transform(domainValue), "color": this.color(domainValue) }; })
        });
    }

}