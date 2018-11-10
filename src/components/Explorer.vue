<template>
    <div>
        <div class="explorer-control" :style="{ 'height': 24 + 'px' }"> 
            <HistoryButtons />
            <SortButtons />
            <!--<ShareButtons />-->
        </div> 
        <div class="explorer" :style="{ 'height': (windowHeight-73) + 'px' }">
            <div class="explorer-main explorer-col">
                <div class="explorer-col-title">
                    <h3>Main</h3>
                </div>
                <ExplorerMain :widthProportion="(5/10)"/>
            </div>
            <div class="explorer-overview explorer-col">
                <div class="explorer-col-title">
                    <h3>Overview</h3>
                </div>
                <ExplorerOverview :widthProportion="(3/10)"/>
            </div>
            <div class="explorer-legend explorer-col">
                <div class="explorer-col-title">
                    <h3>Legend</h3>
                </div>
                <ExplorerLegend :widthProportion="(2/10)"/>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import { HistoryStack, EVENT_TYPES, EVENT_SUBTYPES, EVENT_SUBTYPE_RESETS } from 'vue-declarative-plots';
import { CategoricalScale, ContinuousScale, GenomeScale, DataContainer } from 'vue-declarative-plots';

import HistoryButtons from './HistoryButtons.vue';
import SortButtons from './SortButtons.vue';
import ShareButtons from './ShareButtons.vue';


import ExplorerLegend from './ExplorerLegend.vue';
import ExplorerOverview from './ExplorerOverview.vue';
import ExplorerMain from './ExplorerMain.vue';


import API from './../api.js';

export default {
    name: 'Explorer',
    components: {
        HistoryButtons,
        SortButtons,
        ShareButtons,
        ExplorerLegend,
        ExplorerOverview,
        ExplorerMain
    },
    computed: {
        widthMain() {
            return this.windowWidth * (5/10) - 25;
        },
        ...mapGetters([
            'windowHeight', 
            'windowWidth',
            'getConfig',
            'getStack',
            'getData',
            'getScale'
        ])
    },
    created() {
        this.initStack();
        this.initScalesAndData();
    },
    methods: {
        initStack() {
            // Initialize the history stack
            const stack = new HistoryStack(
                {
                    [EVENT_TYPES.SCALE]: this.getScale,
                    [EVENT_TYPES.DATA]: this.getData
                }, 
                EVENT_SUBTYPE_RESETS
            );
            this.setStack(stack);
        },
        initScalesAndData() {
            const projectsScale = new CategoricalScale("proj_id", "Project", this.getConfig().selectedSamples);
            this.setScale({key: "proj_id", scale: projectsScale});

            const mutTypeScale = new CategoricalScale("mut_type", "Mutation Type", ["SBS", "DBS", "INDEL"]);
            this.setScale({key: "mut_type", scale: mutTypeScale});

            const sigsSbsScale = new CategoricalScale("sig_sbs", "SBS Signature", this.getConfig().selectedSignaturesSbs);
            this.setScale({key: "sig_sbs", scale: sigsSbsScale});

            const sigsDbsScale = new CategoricalScale("sig_dbs", "DBS Signature", this.getConfig().selectedSignaturesDbs);
            this.setScale({key: "sig_dbs", scale: sigsDbsScale});

            const sigsIndelScale = new CategoricalScale("sig_indel", "INDEL Signature", this.getConfig().selectedSignaturesIndel);
            this.setScale({key: "sig_indel", scale: sigsIndelScale});

            /* SAMPLES METADATA  */
            const samplesMetaScale = new CategoricalScale("sample_meta", "Sample Metadata", ["proj_id"], ["Project"]);
            this.setScale({key: "sample_meta", scale: samplesMetaScale});

            const samplesMetaData = new DataContainer("sample_meta", "Sample Metadata", API.fetchPlotSamplesMeta({
                "projects": this.getConfig().selectedSamples
            }));
            this.setData({key: "sample_meta", data: samplesMetaData});

            const samplesScale = new CategoricalScale("sample_id", "Sample", API.fetchScaleSamples({"projects": this.getConfig().selectedSamples}));
            this.setScale({key: "sample_id", scale: samplesScale});

            /* MUTATION COUNTS */
            const countScale = new ContinuousScale("mut_count", "Mutation Count", API.fetchScaleCounts({
                "projects": this.getConfig().selectedSamples
            }));
            this.setScale({key: "mut_count", scale: countScale});

            const countSumScale = new ContinuousScale("mut_count_sum", "Mutation Count", API.fetchScaleCountsSum({
                "projects": this.getConfig().selectedSamples
            }));
            this.setScale({key: "mut_count_sum", scale: countSumScale});

            const countData = new DataContainer("mut_count", "Mutation Count", API.fetchPlotCounts({
                "projects": this.getConfig().selectedSamples
            }));
            this.setData({key: "mut_count", data: countData});

            /* SIGNATURE EXPOSURES: SBS */
            const exposureSbsScale = new ContinuousScale("exposure_sbs", "SBS Exposure", API.fetchScaleExposures({
                "projects": this.getConfig().selectedSamples,
                "signatures": this.getConfig().selectedSignaturesSbs,
                "mut_type": "SBS"
            }));
            this.setScale({key: "exposure_sbs", scale: exposureSbsScale});

            const exposureSumSbsScale = new ContinuousScale("exposure_sum_sbs", "SBS Exposure", API.fetchScaleExposuresSum({
                "projects": this.getConfig().selectedSamples,
                "signatures": this.getConfig().selectedSignaturesSbs,
                "mut_type": "SBS"
            }));
            this.setScale({key: "exposure_sum_sbs", scale: exposureSumSbsScale});

            const exposureSbsNormalizedScale = new ContinuousScale("exposure_sbs_normalized", "Normalized SBS Exposure", API.fetchScaleExposuresNormalized({
                "projects": this.getConfig().selectedSamples,
                "signatures": this.getConfig().selectedSignaturesSbs,
                "mut_type": "SBS"
            }));
            this.setScale({key: "exposure_sbs_normalized", scale: exposureSbsNormalizedScale});

            const exposureSbsSumNormalizedScale = new ContinuousScale("exposure_sum_sbs_normalized", "Normalized SBS Exposure", [0, 1]);
            this.setScale({key: "exposure_sum_sbs_normalized", scale: exposureSbsSumNormalizedScale});

            const exposureSbsData = new DataContainer("exposure_sbs", "SBS Exposure", API.fetchPlotExposures({
                "projects": this.getConfig().selectedSamples,
                "signatures": this.getConfig().selectedSignaturesSbs,
                "mut_type": "SBS"
            }));
            this.setData({key: "exposure_sbs", data: exposureSbsData});

            const exposureSbsNormalizedData = new DataContainer("exposure_sbs_normalized", "Normalized SBS Exposure", API.fetchPlotExposuresNormalized({
                "projects": this.getConfig().selectedSamples,
                "signatures": this.getConfig().selectedSignaturesSbs,
                "mut_type": "SBS"
            }));
            this.setData({key: "exposure_sbs_normalized", data: exposureSbsNormalizedData});

            /* SIGNATURE EXPOSURES: DBS */
            const exposureDbsScale = new ContinuousScale("exposure_dbs", "DBS Exposure", API.fetchScaleExposures({
                "projects": this.getConfig().selectedSamples,
                "signatures": this.getConfig().selectedSignaturesDbs,
                "mut_type": "DBS"
            }));
            this.setScale({key: "exposure_dbs", scale: exposureDbsScale});

            const exposureSumDbsScale = new ContinuousScale("exposure_sum_dbs", "DBS Exposure", API.fetchScaleExposuresSum({
                "projects": this.getConfig().selectedSamples,
                "signatures": this.getConfig().selectedSignaturesDbs,
                "mut_type": "DBS"
            }));
            this.setScale({key: "exposure_sum_dbs", scale: exposureSumDbsScale});

            const exposureDbsNormalizedScale = new ContinuousScale("exposure_dbs_normalized", "Normalized DBS Exposure", API.fetchScaleExposuresNormalized({
                "projects": this.getConfig().selectedSamples,
                "signatures": this.getConfig().selectedSignaturesDbs,
                "mut_type": "DBS"
            }));
            this.setScale({key: "exposure_dbs_normalized", scale: exposureDbsNormalizedScale});

            const exposureDbsSumNormalizedScale = new ContinuousScale("exposure_sum_dbs_normalized", "Normalized DBS Exposure", [0, 1]);
            this.setScale({key: "exposure_sum_dbs_normalized", scale: exposureDbsSumNormalizedScale});

            const exposureDbsData = new DataContainer("exposure_dbs", "DBS Exposure", API.fetchPlotExposures({
                "projects": this.getConfig().selectedSamples,
                "signatures": this.getConfig().selectedSignaturesDbs,
                "mut_type": "DBS"
            }));
            this.setData({key: "exposure_dbs", data: exposureDbsData});

            const exposureDbsNormalizedData = new DataContainer("exposure_dbs_normalized", "Normalized DBS Exposure", API.fetchPlotExposuresNormalized({
                "projects": this.getConfig().selectedSamples,
                "signatures": this.getConfig().selectedSignaturesDbs,
                "mut_type": "DBS"
            }));
            this.setData({key: "exposure_dbs_normalized", data: exposureDbsNormalizedData});

            /* SIGNATURE EXPOSURES: INDEL */
            const exposureIndelScale = new ContinuousScale("exposure_indel", "INDEL Exposure", API.fetchScaleExposures({
                "projects": this.getConfig().selectedSamples,
                "signatures": this.getConfig().selectedSignaturesIndel,
                "mut_type": "INDEL"
            }));
            this.setScale({key: "exposure_indel", scale: exposureIndelScale});

            const exposureSumIndelScale = new ContinuousScale("exposure_sum_indel", "INDEL Exposure", API.fetchScaleExposuresSum({
                "projects": this.getConfig().selectedSamples,
                "signatures": this.getConfig().selectedSignaturesIndel,
                "mut_type": "INDEL"
            }));
            this.setScale({key: "exposure_sum_indel", scale: exposureSumIndelScale});

            const exposureIndelNormalizedScale = new ContinuousScale("exposure_indel_normalized", "Normalized INDEL Exposure", API.fetchScaleExposuresNormalized({
                "projects": this.getConfig().selectedSamples,
                "signatures": this.getConfig().selectedSignaturesIndel,
                "mut_type": "INDEL"
            }));
            this.setScale({key: "exposure_indel_normalized", scale: exposureIndelNormalizedScale});

            const exposureIndelSumNormalizedScale = new ContinuousScale("exposure_sum_indel_normalized", "Normalized INDEL Exposure", [0, 1]);
            this.setScale({key: "exposure_sum_indel_normalized", scale: exposureIndelSumNormalizedScale});

            const exposureIndelData = new DataContainer("exposure_indel", "INDEL Exposure", API.fetchPlotExposures({
                "projects": this.getConfig().selectedSamples,
                "signatures": this.getConfig().selectedSignaturesIndel,
                "mut_type": "INDEL"
            }));
            this.setData({key: "exposure_indel", data: exposureIndelData});

            const exposureIndelNormalizedData = new DataContainer("exposure_indel_normalized", "Normalized INDEL Exposure", API.fetchPlotExposuresNormalized({
                "projects": this.getConfig().selectedSamples,
                "signatures": this.getConfig().selectedSignaturesIndel,
                "mut_type": "INDEL"
            }));
            this.setData({key: "exposure_indel_normalized", data: exposureIndelNormalizedData});


            /* EXPLICIT LINKING IF NECESSARY */
            samplesScale.onHighlight("explorer", (sample_id) => {
                const sampleMetaForHighlight = samplesMetaData._data.find((el) => el["sample_id"] === sample_id);
                projectsScale.emitHighlight(sampleMetaForHighlight["proj_id"]);
            });

            samplesScale.onHighlightDestroy("explorer", () => {
                projectsScale.emitHighlightDestroy();
            });

            sigsSbsScale.onHighlight("explorer", () => {
                mutTypeScale.emitHighlight("SBS");
            });

            sigsSbsScale.onHighlightDestroy("explorer", () => {
                mutTypeScale.emitHighlightDestroy();
            });

            sigsDbsScale.onHighlight("explorer", () => {
                mutTypeScale.emitHighlight("DBS");
            });

            sigsDbsScale.onHighlightDestroy("explorer", () => {
                mutTypeScale.emitHighlightDestroy();
            });

            sigsIndelScale.onHighlight("explorer", () => {
                mutTypeScale.emitHighlight("INDEL");
            });

            sigsIndelScale.onHighlightDestroy("explorer", () => {
                mutTypeScale.emitHighlightDestroy();
            });

        },
        ...mapMutations([
            'setStack',
            'setData',
            'setScale'
        ])
    }
}
</script>

<style lang="scss">
@import './../style/variables.scss';
@import '~vue-declarative-plots/dist/vue-declarative-plots.css';

.explorer {
    display: flex;
    flex-direction: row;
    .explorer-col {
        overflow-y: scroll;
        overflow-x: hidden;
        .explorer-col-title {
            margin-left: 10px;
            h3 {
                margin-top: 10px;
                margin-bottom: 10px;
            }
        }
    }
    .explorer-main {
        flex: 5;
    }
    .explorer-overview {
        flex: 3;
    }
    .explorer-legend {
        flex: 2;
        &>div {
            margin-left: 10px;
        }
    }
}

.explorer-control {
    background-color: #f8f8f8;
    &>div {
        margin-left: 11px;
        display: inline-block;
        margin-right: 15px;
    }
    &>div>span.explorer-control-title {
        text-transform: uppercase;
        font-weight: 600;
        color: rgb(154, 154, 154);
        font-size: 0.75em;
        margin-right: 5px;

    }
}

</style>
