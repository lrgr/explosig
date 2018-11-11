import { dispatch as d3_dispatch } from "d3-dispatch";

const DISPATCH_EVENT_UPDATE = "update";

export const EVENT_TYPE_STRATIFY = 100;
export const EVENT_SUBTYPE_STRATIFY = 100;
export const EVENT_SUBTYPE_RESET_STRATIFY = "resetChoices";

/**
 * Stratification class to store stratification choices.
 */
export default class Stratification {

    constructor() {
        this._dispatch = d3_dispatch(DISPATCH_EVENT_UPDATE);
        this._choices = [];
    }

    updateChoices(choices) {
        this._choices = choices;
        this.emitUpdate();
    }
    
    get choices() {
        return this._choices;
    }

    /**
     * Reset the choices.
     */
    resetChoices() {
        this._choices = [];
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