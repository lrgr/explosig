export default class SignatureGroup {

    constructor(id, name) {
        this.id = id;
        this.name = name;
        this.cancerTypes = [];
    }

    addCancerType(cancerType) {
        this.cancerTypes.push(cancerType);
    }
    
}