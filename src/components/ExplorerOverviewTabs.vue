<template>
    <div>
        <div class="overview-tab-container">
            <div :class="activeOverviewClasses()">
                <span class="tab-target" @click="activateOverview">Overview</span>
            </div>
            <div 
                v-for="sampleId in selectedSamples" 
                :key="sampleId" 
                :class="activeSampleClasses(sampleId)"
                @mouseover="highlightSample(sampleId)"
                @mouseleave="unhighlightSample"
            >
                <span class="tab-target" @click="activateSample(sampleId)" :title="sampleId">{{ sampleId }}</span><span class="tab-close" @click="deselectSample(sampleId)">x</span>
            </div>
            <div class="overview-tab inactive-tab">
                <span class="tab-target" @click="addSample" title="Add Sample by ID">&nbsp;+&nbsp;</span>
            </div>
        </div>

        <div class="modal" v-show="modalVisible">
            <div class="modal-inner">
                <span class="modal-close" @click="closeModal">Close</span>
                <div class="add-sample-modal">
                    <h3>Add Sample by ID</h3>

                    <div v-if="errorMessage" class="add-sample-error">{{ errorMessage }}</div>
                    
                    <div class="add-sample-input-group">
                        <select v-model="projectToAdd">
                            <option v-for="proj of selectedProjects" :key="proj" :value="proj">{{ proj }}</option>
                        </select>
                        <input type="text" v-model="sampleToAdd" />
                        <button @click="addSampleSubmit">Add</button>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal-background" v-show="modalVisible" @click="closeModal"></div>
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
            modalVisible: false,
            sampleToAdd: "",
            projectToAdd: undefined,
            errorMessage: undefined
        };
    },
    created() {
        this.projectToAdd = this.selectedProjects[0];
    },
    computed: {
        selectedSamples() {
            return this.getSamples().selectedSamples;
        },
        selectedProjects() {
            return this.getConfig().selectedSamples;
        },
        ...mapGetters([
            'getSamples',
            'getStack',
            'getScale',
            'getConfig'
        ])
    },
    methods: {
        highlightSample(sampleId) {
            this.getScale("sample_id").emitHighlight(sampleId);
        },
        unhighlightSample() {
            this.getScale("sample_id").emitHighlightDestroy();
        },
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
            if(samplesObject.activeSample !== sampleId) {
                samplesObject.updateActiveSample(sampleId);
                this.getStack().push(new HistoryEvent(
                    EVENT_TYPE_SAMPLES, 
                    EVENT_SUBTYPE_SAMPLES, 
                    "N/A", 
                    "updateActiveSample", 
                    [sampleId]
                ));
            }
        },
        activateOverview() {
            let samplesObject = this.getSamples();
            if(samplesObject.activeSample !== null) {
                samplesObject.updateActiveSample(null);
                this.getStack().push(new HistoryEvent(
                    EVENT_TYPE_SAMPLES, 
                    EVENT_SUBTYPE_SAMPLES, 
                    "N/A", 
                    "updateActiveSample", 
                    [null]
                ));
            }
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
        addSample() {
            this.modalVisible = true;
        },
        closeModal() {
            this.modalVisible = false;
        },
        addSampleSubmit() {
            const allSamples = this.getScale("sample_id").domain;
            const sampleId = this.projectToAdd + " " + this.sampleToAdd;
            if(allSamples.includes(sampleId)) {
                this.sampleClickHandler(sampleId);
                this.closeModal();
                this.sampleToAdd = "";
            } else {
                this.errorMessage = "Sample not found. Please try again.";
            }
        },
        sampleClickHandler(sampleId) { // duplicated from ExplorerMain.vue
            let samplesObject = this.getSamples();
            if(!samplesObject.selectedSamples.includes(sampleId)) {
                let updatedSamples = [ ...samplesObject.selectedSamples, sampleId ];
                samplesObject.updateSelectedSamples(updatedSamples);
                this.getStack().push(new HistoryEvent(
                    EVENT_TYPE_SAMPLES, 
                    EVENT_SUBTYPE_SAMPLES, 
                    "N/A", 
                    "updateSelectedSamples", 
                    [Array.from(updatedSamples)]
                ));
            } else {
                if(samplesObject.activeSample !== sampleId) {
                    samplesObject.updateActiveSample(sampleId);
                    this.getStack().push(new HistoryEvent(
                        EVENT_TYPE_SAMPLES, 
                        EVENT_SUBTYPE_SAMPLES, 
                        "N/A", 
                        "updateActiveSample", 
                        [sampleId]
                    ));
                }
            }
        }
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
            user-select: none;
        }

        .tab-close {
            cursor: pointer;
            color: #A50026;
            margin-left: 6px;
            user-select: none;
        }
    }
}

.add-sample-modal {
    padding: 1rem;
    h3 {
        margin-top: 0;
    }
    .add-sample-error {
        color: red;
        margin-bottom: 0.5rem;
    }
    .add-sample-input-group {
        display: flex;
        flex-direction: row;
        select, input {
            flex-grow: 4
        }
        button {
            flex-grow: 1
        }
    }

}

</style>
