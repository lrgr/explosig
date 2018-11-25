import { dispatch as d3_dispatch } from "d3-dispatch";

const DISPATCH_EVENT_UPDATE = "update";

export const EVENT_TYPE_VISIBILITY = 101;
export const EVENT_SUBTYPE_VISIBILITY = 101;
export const EVENT_SUBTYPE_RESET_VISIBILITY = "resetVisibility";

export const PLOT_GROUPS = Object.freeze({
    'NORMALIZED_EXPOSURES': 1
});

/**
 * Visibility class to store visible/hidden state of plots.
 */
export default class Visibility {

    constructor(hiddenPlots) {
        this._dispatch = d3_dispatch(DISPATCH_EVENT_UPDATE);
        if(hiddenPlots !== undefined) {
            this._hiddenPlots = hiddenPlots;
            this._hiddenPlotsOriginal = Array.from(hiddenPlots); // shallow copy
        } else {
            this._hiddenPlots = [];
            this._hiddenPlotsOriginal = [];
        }
        
    }

    updateHiddenPlots(hiddenPlots) {
        this._hiddenPlots = hiddenPlots;
        this.emitUpdate();
    }
    
    get hiddenPlots() {
        return this._hiddenPlots;
    }

    /**
     * Reset the choices.
     */
    resetVisibility() {
        this._hiddenPlots = this._hiddenPlotsOriginal;
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