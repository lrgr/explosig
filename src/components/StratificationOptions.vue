<template>
    <div>
        Stratify <em>{{ getData(data).name }}</em> for <em>{{ _optionScale.name }}</em>&nbsp;
        <span>
            <select v-model="selectedKey">
                <option disabled value="">Please select one</option>
                <option v-for="sortVarKey in sortVarKeys" :key="sortVarKey" :value="sortVarKey">
                    {{ _optionScale.toHuman(sortVarKey) }}
                </option>
            </select>
             by 
             <span>
                <em>{{ getData(s).name }}</em> data 
            </span>
             on 
            <span>
                <em>{{ getScale(variable).name }}</em>
            </span>
        </span>&nbsp;
        <button @click="go" :disabled="!validSelection(selectedKey)">Go</button>
    </div>
</template>

<script>
import HistoryEvent from 'vue-declarative-plots/src/history/HistoryEvent.js';
import { EVENT_TYPE_STRATIFY, EVENT_SUBTYPE_STRATIFY } from './../vdp/Stratification.js';

let uuid = 0;
export default {
    name: 'StratificationOptions',
    props: {
        'variable': { // The variable to stratify by. Example: smoking
            type: String
        },
        'data': { // The data used for the box plot values. Example: exposure_sbs
            type: String 
        },
        'optionScale': { // The scale used for the options. Example: sig_sbs
            type: String 
        },
        'y': { // The scale used for the box plot values. Example: exposure_sbs
            type: String
        },
        'o': { // The scale used for the box plot observations. Example: sample_id
            type: String
        },
        's': { // The data used for the stratification values. Example: clinical_data
            type: String
        },
        'getScale': {
            type: Function
        },
        'getData': {
            type: Function
        },
        'getStack': {
            type: Function
        },
        'getStratification': {
            type: Function
        }
    },
    data() {
        return {
            selectedKey: null,
            sortVarKeys: []
        }
    },
    beforeCreate() {
        this.uuid = this.$options.name + uuid.toString();
        uuid += 1;
    },
    created() {
        this._optionScale = this.getScale(this.optionScale);
        this.sortVarKeys = this._optionScale.domain;
        this._optionScale.onUpdate(this.uuid, () => {
            this.sortVarKeys = this._optionScale.domain;
        });

        this._stack = this.getStack();
        this._stratification = this.getStratification();
    },
    methods: {
        validSelection(varValue) {
            return (varValue !== null);
        },
        go() {
            if(this.validSelection(this.selectedKey)) {
                const newChoices = [
                    {
                        x: this.variable,
                        y: this.y,
                        o: this.o,
                        data: this.data,
                        s: this.s,
                        variable: this.selectedKey
                    },
                    ...this._stratification.choices
                ];
                this._stratification.updateChoices(newChoices);
                this._stack.push(new HistoryEvent(
                    EVENT_TYPE_STRATIFY, 
                    EVENT_SUBTYPE_STRATIFY, 
                    "N/A", 
                    "updateChoices", 
                    [newChoices]
                ));
                this.$emit('stratify');
            }
        }
    }
}
</script>

<style>


</style>