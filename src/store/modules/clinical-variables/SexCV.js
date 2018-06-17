import AbstractCategoricalCV from './AbstractCategoricalCV';

export default class SexCV extends AbstractCategoricalCV {
    
    get id () {
        return "Sex";
    }
    
    get name () {
        return "Sex";
    }

    get domain() {
        return ["female", "male"];
    }

    get range() {
        return ["Female", "Male"];
    }
    
}