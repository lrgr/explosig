import AbstractCategoricalScale from '../AbstractCategoricalScale';

export default class VitalStatusCV extends AbstractCategoricalScale {
    
    get id () {
        return "Vital Status";
    }
    
    get name () {
        return "Vital Status";
    }

    get domain() {
        return ["deceased", "alive"];
    }

    get range() {
        return ["Deceased", "Alive"];
    }
    
}