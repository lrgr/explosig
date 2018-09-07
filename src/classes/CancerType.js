import { MUT_TYPES } from './../constants.js';

export default class CancerType {

    constructor(id, name, signatures) {
        this.name = name; // string
        this.id = id; // string
        this.signatures = {};
        for(let mutType of MUT_TYPES) {
            if(signatures.hasOwnProperty(mutType)) {
                this.signatures[mutType] = signatures[mutType];
            } else {
                this.signatures[mutType] = [];
            }
        }
    }

    get signaturesFlat() {
        let result = [];
        for(let mutType of MUT_TYPES) {
            for(let sig of this.signatures[mutType]) {
                result.push(sig);
            }
        }
        return result;
    }
    
}