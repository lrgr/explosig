import { dispatch as d3_dispatch } from "d3-dispatch-nosplit";

const DISPATCH_EVENT_UPDATE = "update";

export const EVENT_TYPE_SIZES = 103;
export const EVENT_SUBTYPE_COLUMNS = 103;
export const EVENT_SUBTYPE_RESET_COLUMNS = "resetColumns";
export const EVENT_SUBTYPE_HEIGHTS = 104;
export const EVENT_SUBTYPE_RESET_HEIGHTS = "resetHeights";

export const EXPLORER_COLUMNS = Object.freeze({
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
            [EXPLORER_COLUMNS.MAIN]: 0.5,
            [EXPLORER_COLUMNS.OVERVIEW]: 0.3,
            [EXPLORER_COLUMNS.LEGEND]: 0.2
        };
        this._plotHeights = {};
    }

    updateColumns(columns) {
        this._columns = columns;
        this.emitUpdate();
    }

    get columns() {
        return this._columns;
    }

    updatePlotHeights(plotHeights) {
        this._plotHeights = plotHeights;
        this.emitUpdate();
    }

    get plotHeights() {
        return this._plotHeights;
    }
    
    /**
     * Reset the column sizes.
     */
    resetColumns() {
        this._columns = {
            [EXPLORER_COLUMNS.MAIN]: 0.5,
            [EXPLORER_COLUMNS.OVERVIEW]: 0.3,
            [EXPLORER_COLUMNS.LEGEND]: 0.2
        };
        this.emitUpdate();
    }

    resetHeights() {
        this._plotHeights = {};
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