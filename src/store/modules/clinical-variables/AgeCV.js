import AbstractContinuousCV from './AbstractContinuousCV';

export default class AgeCV extends AbstractContinuousCV {
    
    get id () {
        return "Diagnosis Age";
    }
    
    get name () {
        return "Diagnosis Age";
    }

    get domain() {
        return [0, 120];
    }

    get range() {
        return this.domain;
    }

}
