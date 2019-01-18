import { dispatch as d3_dispatch } from "d3-dispatch";

const DISPATCH_EVENT_UPDATE = "update";

export const EVENT_TYPE_SIZES = 103;
export const EVENT_SUBTYPE_SIZES = 103;
export const EVENT_SUBTYPE_RESET_SIZES = "resetSizes";

export const IMUSE_COLUMNS = Object.freeze({
    'MAIN': 1,
    'OVERVIEW': 2,
    'LEGEND': 3
});

/**
 * Mode class to store current custom sizing configuration.
 */
export default class Sizes {

    constructor() {
        this._dispatch = d3_dispatch(DISPATCH_EVENT_UPDATE);
        this._columns = {
            [IMUSE_COLUMNS.MAIN]: 0.5,
            [IMUSE_COLUMNS.OVERVIEW]: 0.3,
            [IMUSE_COLUMNS.LEGEND]: 0.2
        };
    }

    updateColumns(columns) {
        this._columns = columns;
        this.emitUpdate();
    }

    get columns() {
        return this._columns;
    }
    
    /**
     * Reset the sizes.
     */
    resetSizes() {
        this._columns = {
            [IMUSE_COLUMNS.MAIN]: 0.5,
            [IMUSE_COLUMNS.OVERVIEW]: 0.3,
            [IMUSE_COLUMNS.LEGEND]: 0.2
        };
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