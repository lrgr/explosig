import AbstractCategoricalCV from './AbstractCategoricalCV';

export default class VitalStatusCV extends AbstractCategoricalCV {
    
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