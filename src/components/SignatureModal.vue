<template>
    <div>
        <div class="modal" v-show="modalVisible">
            <div class="modal-inner">
                <span class="modal-close" @click="closeSigModal">Close</span>
                <div v-if="sigInfo !== undefined" class="sig-modal">
                    <div class="sig-nav-button sig-nav-prev" v-if="prevSignature !== null" @click="goToPrev">
                        <span>{{ prevSignature }}</span>
                    </div>
                    <div class="sig-nav-placeholder" v-if="prevSignature === null"></div>
                    <div class="sig-modal-inner">

                        <h3 class="sig-modal-title">{{ selectedSignature }}</h3>
                        Mutation Type: {{ selectedMutType }}<br>
                        Publication: <em>{{ sigInfo.publication }}</em><br>

                        <PlotContainer :key="('sig_modal_' + sigModalKey)"
                            :pWidth="(modalWidth-70-20)"
                            :pHeight="100"
                            :pMarginTop="15"
                            :pMarginLeft="70"
                            :pMarginRight="20"
                            :pMarginBottom="100"
                        >
                            <Axis 
                                slot="axisLeft"
                                :variable="('sig_prob_'+selectedMutType)"
                                side="left"
                                :disableBrushing="true"
                                :getScale="getScale"
                                :getStack="getStack"
                            />
                            <BarPlot 
                                slot="plot"
                                :data="('sig_'+selectedMutType+'_'+selectedSignatureIndex)"
                                :x="('cat_'+selectedMutType)"
                                :y="('sig_prob_'+selectedMutType)"
                                :getData="getData"
                                :getScale="getScale"
                            />
                            <Axis 
                                slot="axisBottom"
                                :variable="('cat_'+selectedMutType)"
                                :tickRotation="-65"
                                side="bottom"
                                :disableBrushing="true"
                                :getScale="getScale"
                                :getStack="getStack"
                            />
                        </PlotContainer>

                        {{ sigInfo.description }}
                    </div>
                    <div class="sig-nav-button sig-nav-next" v-if="nextSignature !== null" @click="goToNext">
                        <span>{{ nextSignature }}</span>
                    </div>
                    <div class="sig-nav-placeholder" v-if="nextSignature === null"></div>
                </div>
            </div>
        </div>
        <div class="modal-background" v-show="modalVisible" @click="closeSigModal"></div>
    </div>
</template>

<script>
import API from './../api.js';
import { mapGetters } from 'vuex';

import VSpinner from './VSpinner.vue';

import { HistoryStack, EVENT_TYPES, EVENT_SUBTYPE_RESETS } from 'vueplotlib';
import { CategoricalScale, ContinuousScale, GenomeScale, DataContainer } from 'vueplotlib';

export default {
    name: 'SignatureModal',
    props: ['clickedSignature', 'clickedMutType'],
    components: {
        VSpinner,
    },
    data() {
        return {
            modalVisible: false,
            allSignatures: [],
            loading: true,
            sigModalKey: 1,
            plotData: {},
            plotScales: {},
            stack: null,
            selectedMutType: null,
            selectedSignature: null,
            selectedSignatureIndex: null,
            prevSignature: null,
            nextSignature: null
        };
    },
    mounted() {
        if(!this.isEmptySession) {
            API.fetchDataListing().then((listing) => {
                this.allSignatures = listing["signatures"];
            });
        }

        this.initStack();
    },
    watch: {
        clickedSignature(val) {
            this.selectedSignature = val;
        },
        clickedMutType(val) {
            this.selectedMutType = val;
        },
        selectedSignature(val) {
            if(this.selectedSignature !== null) {
                const sigIndex = this.selectedSignatures.indexOf(val);
                if(sigIndex > 0 && this.selectedSignatures.length > 1) {
                    this.prevSignature = this.selectedSignatures[sigIndex-1];
                } else {
                    this.prevSignature = null;
                }
                if(sigIndex < (this.selectedSignatures.length - 1) && this.selectedSignatures.length > 1) {
                    this.nextSignature = this.selectedSignatures[sigIndex+1];
                } else {
                    this.nextSignature = null;
                }

                this.selectedSignatureIndex = sigIndex;

                this.rerender();
                this.modalVisible = true;
            }
        }
    },
    computed: {
        sigInfo() {
            if(!this.isEmptySession && this.selectedSignature !== null && this.selectedSignatureIndex !== null) {
                return this.allSignatures.find(el => el.id === this.selectedSignature);
            } else if(this.isEmptySession && this.selectedSignature !== null && this.selectedSignatureIndex !== null) {
                return {
                    'publication': 'Unknown',
                    'description': ''
                };
            }
            return undefined;
        },
        selectedSignatures() {
            const mutType = this.selectedMutType;
            const sigNamesScale = this.getScale("sig_" + mutType);
            return sigNamesScale.domain;
        },
        selectedTricountsMethod() {
            let config = this.getConfig();
            return config.selectedTricountsMethod;
        },
        modalWidth() {
            return (0.8 * 0.9 * this.windowWidth);
        },
        ...mapGetters([
            'windowWidth',
            'getData',
            'getScale',
            'getConfig',
            'isEmptySession'
        ])
    },
    methods: {
        goToPrev() {
            this.selectedSignature = this.prevSignature;
        },
        goToNext() {
            this.selectedSignature = this.nextSignature;
        },
        closeSigModal() {
            this.$emit('close-modal');
            this.modalVisible = false;
        },
        rerender() {
            let sigInfo = this.sigInfo;
            if(sigInfo !== undefined) {                
                this.sigModalKey++;
            }
        },
        getStack() {
            return this.stack;
        },
        initStack() {
            // Initialize the history stack
            const stack = new HistoryStack(
                {
                    [EVENT_TYPES.SCALE]: this.getScale,
                    [EVENT_TYPES.DATA]: this.getData
                }, 
                { 
                    ...EVENT_SUBTYPE_RESETS 
                }
            );
            this.stack = stack;
        }
    }
}
</script>

<style scoped lang="scss">
@import './../style/variables.scss';
@import './../style/modal.scss';

.sig-modal {
    width: 100%;
    padding: 0rem;
    .sig-nav-button {
        width: 5%;
        height: 60vh;
        margin-top: 10vh;
        cursor: pointer;
        display: inline-block;
        position: relative;
        user-select: none;
        span {
            display: inline-block;
            white-space: nowrap;
            position: absolute;
            top: 45%;
            left: 50%;
            user-select: none;
        }

        &:hover {
            background-color: rgba(192, 192, 192, 0.5);

        }
    }

    .sig-nav-placeholder {
        width: 5%;
        height: 60vh;
        display: inline-block;
        position: relative;
        user-select: none;
    }

    .sig-nav-prev span {
        transform: translateX(-50%) translateY(-50%) rotate(-90deg);
    }
    .sig-nav-next span {
        transform: translateX(-50%) translateY(-50%) rotate(90deg);
    }
    
    .sig-modal-inner {
        width: 90%;
        display: inline-block;
        vertical-align: top;
    }

    .sig-modal-title {
        text-align: center;
    }
}

</style>
