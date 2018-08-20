import AbstractCategoricalScale from '../AbstractCategoricalScale';

export default class SexCV extends AbstractCategoricalScale {
    
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