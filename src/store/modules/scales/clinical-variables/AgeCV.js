import AbstractContinuousScale from '../AbstractContinuousScale';

export default class AgeCV extends AbstractContinuousScale {
    
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
