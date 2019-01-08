import { dispatch as d3_dispatch } from "d3-dispatch";

const DISPATCH_EVENT_UPDATE = "update";

export const EVENT_TYPE_SAMPLES = 102;
export const EVENT_SUBTYPE_SAMPLES = 102;
export const EVENT_SUBTYPE_RESET_SAMPLES = "resetSamples";


/**
 * Mode class to store current selected samples.
 */
export default class Samples {

    constructor() {
        this._dispatch = d3_dispatch(DISPATCH_EVENT_UPDATE);
        this._selectedSamples = [];
        this._activeSample = null;
    }

    updateSelectedSamples(selectedSamples) {
        this._selectedSamples = selectedSamples;
        
        if(!this._selectedSamples.includes(this._activeSample)) {
            if(this._selectedSamples.length > 0) {
                this._activeSample = this._selectedSamples[this._selectedSamples.length - 1];
            } else {
                this._activeSample = null;
            }
        } else {
            this._activeSample = this._selectedSamples[this._selectedSamples.length - 1];
        }
        this.emitUpdate();
    }

    updateActiveSample(activeSample) {
        this._activeSample = activeSample;
        this.emitUpdate();
    }
    
    get selectedSamples() {
        return this._selectedSamples;
    }

    get activeSample() {
        return this._activeSample;
    }
    
    /**
     * Reset the selected samples.
     */
    resetSamples() {
        this._selectedSamples = [];
        this._activeSample = null;
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

}