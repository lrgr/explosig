import { dispatch as d3_dispatch } from "d3-dispatch";

const DISPATCH_EVENT_UPDATE = "update";

/**
 * Configuration class with selected signatures, samples, genes, clinical variables.
 */
export default class Config {

    constructor() {
        this._dispatch = d3_dispatch(DISPATCH_EVENT_UPDATE);

        this._samples = [];
        this._signaturesSbs = [];
        this._signaturesDbs = [];
        this._signaturesIndel = [];
        this._genes = [];
        this._clinicalVariables = [];
    }

    /**
     * @returns {boolean} Whether anything has been selected yet.
     */
    isEmpty() {
        return (
            this._samples.length === 0 &&
            this._signaturesSbs.length === 0 &&
            this._signaturesDbs.length === 0 &&
            this._signaturesIndel.length === 0 &&
            this._genes.length === 0 &&
            this._clinicalVariables.length === 0
        )
    }

    updateConfig(samples, signaturesSbs, signaturesDbs, signaturesIndel, genes, clinicalVariables) {
        this._samples = samples;
        this._signaturesSbs = signaturesSbs;
        this._signaturesDbs = signaturesDbs;
        this._signaturesIndel = signaturesIndel;
        this._genes = genes;
        this._clinicalVariables = clinicalVariables;
        this.emitUpdate();
    }
    
    get selectedSamples() {
        return this._samples;
    }

    get selectedSignaturesSbs() {
        return this._signaturesSbs;
    }

    get selectedSignaturesDbs() {
        return this._signaturesDbs;
    }

    get selectedSignaturesIndel() {
        return this._signaturesIndel;
    }

    get selectedGenes() {
        return this._genes;
    }

    get selectedClinicalVariables() {
        return this._clinicalVariables;
    }

    /**
     * Reset the configuration.
     */
    resetConfig() {
        this._samples = [];
        this._signaturesSbs = [];
        this._signaturesDbs = [];
        this._signaturesIndel = [];
        this._genes = [];
        this._clinicalVariables = [];

        this.emitUpdate();
    }

     /**
     * Subscribe to update events.
     * @param {string} componentId 
     * @param {function} callback 
     */
    onUpdate(componentId, callback) {
        this._dispatch.on(DISPATCH_EVENT_UPDATE + "." + componentId, callback);
    }

    /**
     * Emit the update event.
     */
    emitUpdate() {
        this._dispatch.call(DISPATCH_EVENT_UPDATE);
    }

    export() {
        return {
            "samples": this._samples,
            "signaturesSbs": this._signaturesSbs,
            "signaturesDbs": this._signaturesDbs,
            "signaturesIndel": this._signaturesIndel,
            "genes": this._genes,
            "clinicalVariables": this._clinicalVariables
        };
    }

    import(config) {
        console.assert(config.hasOwnProperty("samples"))
        console.assert(config.hasOwnProperty("signaturesSbs"))
        console.assert(config.hasOwnProperty("signaturesDbs"))
        console.assert(config.hasOwnProperty("signaturesIndel"))
        console.assert(config.hasOwnProperty("genes"))
        console.assert(config.hasOwnProperty("clinicalVariables"))
        
        this._samples = config.samples;
        this._signaturesSbs = config.signaturesSbs;
        this._signaturesDbs = config.signaturesDbs;
        this._signaturesIndel = config.signaturesIndel;
        this._genes = config.genes;
        this._clinicalVariables = config.clinicalVariables;

        this.emitUpdate();
    }


}