import { dispatch as d3_dispatch } from "d3-dispatch";

const DISPATCH_EVENT_UPDATE = "update";

export const EVENT_TYPE_VISIBILITY = 101;
export const EVENT_SUBTYPE_VISIBILITY = 101;
export const EVENT_SUBTYPE_RESET_VISIBILITY = "resetVisibility";

/**
 * Visibility class to store visible/hidden state of plots.
 */
export default class Visibility {

    constructor() {
        this._dispatch = d3_dispatch(DISPATCH_EVENT_UPDATE);
        this._hiddenPlots = [];
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
        this._hiddenPlots = [];
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