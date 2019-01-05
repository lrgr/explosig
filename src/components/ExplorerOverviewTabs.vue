<template>
    <div>
        <div class="overview-tab-container">
            <div :class="activeOverviewClasses()">
                <span class="tab-target" @click="activateOverview">Overview</span>
            </div>
            <div v-for="sampleId in selectedSamples" :key="sampleId" :class="activeSampleClasses(sampleId)">
                <span class="tab-target" @click="activateSample(sampleId)">{{ sampleId }}</span><span class="tab-close" @click="deselectSample(sampleId)">x</span>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import API from './../api.js';

import VSpinner from './VSpinner.vue';

import { HistoryEvent } from 'vue-declarative-plots';
import { EVENT_TYPE_SAMPLES, EVENT_SUBTYPE_SAMPLES } from './../vdp/Samples';

export default {
    name: 'SamplesTabs',
    components: {
        VSpinner,
    },
    data() {
        return {
            
        };
    },
    computed: {
        selectedSamples() {
            return this.getSamples().selectedSamples;
        },
        ...mapGetters([
            'getSamples',
            'getStack'
        ])
    },
    methods: {
        deselectSample(sampleId) {
            let samplesObject = this.getSamples();
            if(samplesObject.selectedSamples.includes(sampleId)) {
                let updatedSamples = Array.from(samplesObject.selectedSamples)
                updatedSamples.splice(updatedSamples.indexOf(sampleId), 1);
                samplesObject.updateSelectedSamples(updatedSamples);
                this.getStack().push(new HistoryEvent(
                    EVENT_TYPE_SAMPLES, 
                    EVENT_SUBTYPE_SAMPLES, 
                    "N/A", 
                    "updateSelectedSamples", 
                    [Array.from(updatedSamples)]
                ));
            }
        },
        activateSample(sampleId) {
            let samplesObject = this.getSamples();
            samplesObject.updateActiveSample(sampleId);
            this.getStack().push(new HistoryEvent(
                EVENT_TYPE_SAMPLES, 
                EVENT_SUBTYPE_SAMPLES, 
                "N/A", 
                "updateActiveSample", 
                [sampleId]
            ));
        },
        activateOverview() {
            let samplesObject = this.getSamples();
            samplesObject.updateActiveSample(null);
            this.getStack().push(new HistoryEvent(
                EVENT_TYPE_SAMPLES, 
                EVENT_SUBTYPE_SAMPLES, 
                "N/A", 
                "updateActiveSample", 
                [null]
            ));
        },
        isActiveSample(sampleId) {
            return this.getSamples().activeSample === sampleId;
        },
        isActiveOverview() {
            return this.getSamples().activeSample === null;
        },
        activeSampleClasses(sampleId) {
            if(this.isActiveSample(sampleId)) {
                return ["overview-tab", "active-tab"];
            } else {
                return ["overview-tab", "inactive-tab"];
            }
        },
        activeOverviewClasses() {
            if(this.isActiveOverview()) {
                return ["overview-tab", "active-tab"];
            } else {
                return ["overview-tab", "inactive-tab"];
            }
        },
    }
}
</script>

<style scoped lang="scss">
@import './../style/variables.scss';
@import './../style/modal.scss';

.overview-tab-container {
    display: flex;
    flex-direction: row;
    overflow-x: scroll;
    .active-tab {
        background-color: lightblue;
    }
    .inactive-tab {
        background-color: #ECECEC;
    }
    .overview-tab {
        padding: 4px;
        border-top: 2px solid white;
        border-right: 1px solid white;
        border-left: 2px solid white;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
        box-sizing: border-box;
        white-space: nowrap;
        
        .tab-target {
            cursor: pointer;
            display: inline-block;
            text-overflow: ellipsis;
            overflow: hidden;
            max-width: 120px;
            box-sizing: border-box;
            vertical-align: top;
            direction: rtl;
            text-align: left;
        }

        .tab-close {
            cursor: pointer;
            color: #A50026;
            margin-left: 6px;
        }
    }
}

</style>
