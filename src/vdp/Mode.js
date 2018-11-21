import { dispatch as d3_dispatch } from "d3-dispatch";

const DISPATCH_EVENT_UPDATE = "update";

export const EVENT_TYPE_MODE = 102;
export const EVENT_SUBTYPE_MODE = 102;
export const EVENT_SUBTYPE_RESET_MODE = "resetMode";

export const MODES = Object.freeze({ 
    "OVERVIEW": 1, 
    "SAMPLE": 2, 
    "SIGNATURES": 3
});

/**
 * Mode class to store current mode (overview/sample/signatures).
 */
export default class Mode {

    constructor() {
        this._dispatch = d3_dispatch(DISPATCH_EVENT_UPDATE);
        this._mode = MODES.OVERVIEW;
        this._modeOptions = undefined;
    }

    updateMode(mode, modeOptions) {
        this._mode = mode;
        this._modeOptions = modeOptions;
        console.assert(Object.values(MODES).includes(mode));
        this.emitUpdate();
    }
    
    get mode() {
        return this._mode;
    }
    
    get modeOptions() {
        return this._modeOptions;
    }

    /**
     * Reset the mode to overview.
     */
    resetMode() {
        this._mode = MODES.OVERVIEW;
        this._modeOptions = undefined;
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