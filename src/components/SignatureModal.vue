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

                        <h3 class="sig-modal-title">{{ sigInfo.id }}</h3>
                        Mutation Type: {{ sigInfo.mut_type}}<br>
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
                                variable="probability"
                                side="left"
                                :disableBrushing="true"
                                :getScale="getScale"
                                :getStack="getStack"
                            />
                            <BarPlot 
                                slot="plot"
                                data="signature"
                                :x="('cat_'+sigInfo.mut_type)"
                                y="probability"
                                :getData="getData"
                                :getScale="getScale"
                            />
                            <Axis 
                                slot="axisBottom"
                                :variable="('cat_'+sigInfo.mut_type)"
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

import { HistoryStack, EVENT_TYPES, EVENT_SUBTYPE_RESETS } from 'vue-declarative-plots';
import { CategoricalScale, ContinuousScale, GenomeScale, DataContainer } from 'vue-declarative-plots';
import { 
    SBS_SUPERCAT_COLORS, DBS_SUPERCAT_COLORS, INDEL_SUPERCAT_COLORS,
    SBS_SUPERCAT_MAP, DBS_SUPERCAT_MAP, INDEL_SUPERCAT_MAP,
    SBS_CATS, DBS_CATS, INDEL_CATS,
    getCategoryColors
} from './../categories.js';

export default {
    name: 'SignatureModal',
    props: ['clickedSignature'],
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
            selectedSignature: null,
            selectedSignatureIndex: null,
            prevSignature: null,
            nextSignature: null
        };
    },
    mounted() {
        API.fetchDataListing().then((listing) => {
            this.allSignatures = listing["signatures"];
        });

        /* Contexts scales for reconstruction and signature plots */
        this.plotScales["cat_SBS"] = new CategoricalScale("cat_SBS", "SBS Mutation Category", SBS_CATS, undefined, getCategoryColors(SBS_CATS, SBS_SUPERCAT_MAP, SBS_SUPERCAT_COLORS));

        this.plotScales["cat_DBS"] = new CategoricalScale("cat_DBS", "DBS Mutation Category", DBS_CATS, undefined, getCategoryColors(DBS_CATS, DBS_SUPERCAT_MAP, DBS_SUPERCAT_COLORS));

        this.plotScales["cat_INDEL"] = new CategoricalScale("cat_INDEL", "INDEL Mutation Category", INDEL_CATS, undefined, getCategoryColors(INDEL_CATS, INDEL_SUPERCAT_MAP, INDEL_SUPERCAT_COLORS));

        this.plotScales["probability"] = new ContinuousScale("probability", "Probability", [0.0, 0.2]);

        this.initStack();
        
    },
    watch: {
        clickedSignature(val) {
            this.selectedSignature = val;
        },
        selectedSignature(val) {
            if(this.selectedSignature !== null) {
            let sigIndex = this.selectedSignatures.indexOf(val);
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


            this.rerender();
            this.modalVisible = true;
            }
        }
    },
    computed: {
        sigInfo() {
            if(this.selectedSignature !== null) {
                return this.allSignatures.find(el => el.id === this.selectedSignature);
            }
            return undefined;
        },
        mutType() {
            if(this.selectedSignature !== null) {
                return this.allSignatures.find(el => el.id === this.selectedSignature).mut_type;
            }
            return undefined;
        },
        selectedSignatures() {
            let config = this.getConfig();
            let mutType = this.mutType;
            if(mutType === "SBS") {
                return config.selectedSignaturesSbs;
            } else if(mutType === "DBS") {
                return config.selectedSignaturesDbs;
            } else if(mutType === "INDEL") {
                return config.selectedSignaturesIndel;
            } else {
                return [];
            }
        },
        modalWidth() {
            return (0.8 * 0.9 * this.windowWidth);
        },
        ...mapGetters([
            'windowWidth',
            'getConfig'
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
                // set up scales and data
                this.plotData["signature"] = new DataContainer("signature", sigInfo.id, API.fetchPlotSignature({
                    "signature": sigInfo.id,
                    "mut_type": sigInfo.mut_type
                }));
                this.sigModalKey++;
            }
        },
        getData(key) {
            return this.plotData[key];
        },
        getScale(key) {
            return this.plotScales[key];
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
