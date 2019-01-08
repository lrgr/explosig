<template>
    <div>
        <div class="explorer-control" :style="{ 'height': 24 + 'px' }"> 
            <HistoryButtons />
            <SortButtons />
            <StratificationButtons />
            <SharingButtons :style="{'float': 'right'}" />
        </div> 
        <div class="explorer" :style="{ 'height': (windowHeight-73) + 'px' }">
            <div class="explorer-main explorer-col">
                <!--<div class="explorer-col-title">
                    <h3>Main</h3>
                </div>-->
                <ExplorerMain :widthProportion="(5/10)"/>
            </div>
            <div class="explorer-overview explorer-col">
                <ExplorerOverviewTabs />
                <ExplorerOverview :widthProportion="(3/10)" v-if="showOverview"/>
                <ExplorerOverviewSampleContainer :widthProportion="(3/10)" v-if="showOverviewSample"/>
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
import { HistoryStack, EVENT_TYPES, EVENT_SUBTYPE_RESETS } from 'vue-declarative-plots';
import { CategoricalScale, ContinuousScale, GenomeScale, DataContainer } from 'vue-declarative-plots';

import Stratification, { EVENT_TYPE_STRATIFY, EVENT_SUBTYPE_STRATIFY, EVENT_SUBTYPE_RESET_STRATIFY } from './../vdp/Stratification.js';
import Visibility, { EVENT_TYPE_VISIBILITY, EVENT_SUBTYPE_VISIBILITY, EVENT_SUBTYPE_RESET_VISIBILITY, PLOT_GROUPS } from './../vdp/Visibility.js';
import Samples, { EVENT_TYPE_SAMPLES, EVENT_SUBTYPE_SAMPLES, EVENT_SUBTYPE_RESET_SAMPLES } from './../vdp/Samples.js';

import HistoryButtons from './HistoryButtons.vue';
import SortButtons from './SortButtons.vue';
import StratificationButtons from './StratificationButtons.vue';
import SharingButtons from './SharingButtons.vue';

import ExplorerOverviewTabs from './ExplorerOverviewTabs.vue';
import ExplorerOverviewSampleContainer from './ExplorerOverviewSampleContainer.vue';

import ExplorerLegend from './ExplorerLegend.vue';
import ExplorerOverview from './ExplorerOverview.vue';
import ExplorerMain from './ExplorerMain.vue';

import API from './../api.js';
import { CONTINUOUS_CLINICAL_VARS } from './../constants.js';

import { 
    SBS_SUPERCAT_COLORS, DBS_SUPERCAT_COLORS, INDEL_SUPERCAT_COLORS,
    SBS_SUPERCAT_MAP, DBS_SUPERCAT_MAP, INDEL_SUPERCAT_MAP,
    SBS_CATS, DBS_CATS, INDEL_CATS,
    getCategoryColors
} from './../categories.js';

export default {
    name: 'Explorer',
    components: {
        HistoryButtons,
        SortButtons,
        StratificationButtons,
        SharingButtons,
        ExplorerLegend,
        ExplorerOverview,
        ExplorerMain,
        ExplorerOverviewTabs,
        ExplorerOverviewSampleContainer
    },
    computed: {
        widthMain() {
            return this.windowWidth * (5/10) - 25;
        },
        showOverview() {
            return this.getSamples().activeSample === null;
        },
        showOverviewSample() {
            return this.getSamples().activeSample !== null;
        },
        ...mapGetters([
            'windowHeight', 
            'windowWidth',
            'getConfig',
            'getStack',
            'getStratification',
            'getVisibility',
            'getSamples',
            'getData',
            'getScale'
        ])
    },
    created() {
        this.initStack();
        this.initStratification();
        this.initVisibility();
        this.initSamples();
        this.initScalesAndData();
    },
    methods: {
        initStack() {
            // Initialize the history stack
            const stack = new HistoryStack(
                {
                    [EVENT_TYPES.SCALE]: this.getScale,
                    [EVENT_TYPES.DATA]: this.getData,
                    [EVENT_TYPE_STRATIFY]: this.getStratification,
                    [EVENT_TYPE_VISIBILITY]: this.getVisibility,
                    [EVENT_TYPE_SAMPLES]: this.getSamples
                }, 
                {
                    [EVENT_SUBTYPE_STRATIFY]: EVENT_SUBTYPE_RESET_STRATIFY,
                    [EVENT_SUBTYPE_VISIBILITY]: EVENT_SUBTYPE_RESET_VISIBILITY,
                    [EVENT_SUBTYPE_SAMPLES]: EVENT_SUBTYPE_RESET_SAMPLES,
                    ...EVENT_SUBTYPE_RESETS
                }
            );
            this.setStack(stack);
        },
        initStratification() {
            const stratification = new Stratification();
            this.setStratification(stratification);
        },
        initVisibility() {
            const visibility = new Visibility([PLOT_GROUPS.NORMALIZED_EXPOSURES, PLOT_GROUPS.COSINE_SIMILARITY]);
            this.setVisibility(visibility);
        },
        initSamples() {
            const samples = new Samples();
            this.setSamples(samples);
        },
        initScalesAndData() {
            const projectsScale = new CategoricalScale("proj_id", "Study", this.getConfig().selectedSamples);
            this.setScale({key: "proj_id", scale: projectsScale});

            const mutTypeScale = new CategoricalScale("mut_type", "Mutation Type", ["SBS", "DBS", "INDEL"]);
            this.setScale({key: "mut_type", scale: mutTypeScale});

            const sigsSbsScale = new CategoricalScale("sig_SBS", "SBS Signature", this.getConfig().selectedSignaturesSbs);
            this.setScale({key: "sig_SBS", scale: sigsSbsScale});

            const sigsDbsScale = new CategoricalScale("sig_DBS", "DBS Signature", this.getConfig().selectedSignaturesDbs);
            this.setScale({key: "sig_DBS", scale: sigsDbsScale});

            const sigsIndelScale = new CategoricalScale("sig_INDEL", "INDEL Signature", this.getConfig().selectedSignaturesIndel);
            this.setScale({key: "sig_INDEL", scale: sigsIndelScale});

            /* SAMPLES METADATA  */
            const samplesMetaScale = new CategoricalScale("sample_meta", "", ["Study"]);
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

            const exposureSbsCosineSimilarityScale = new ContinuousScale("cosine_similarity_SBS", "SBS Cos. Sim.", [0, 1]);
            this.setScale({key: "cosine_similarity_SBS", scale: exposureSbsCosineSimilarityScale});

            const exposureSbsCosineSimilarityData = new DataContainer("cosine_similarity_SBS", "SBS Cos. Sim.", API.fetchPlotReconstructionCosineSimilarity({
                "projects": this.getConfig().selectedSamples,
                "signatures": this.getConfig().selectedSignaturesSbs,
                "mut_type": "SBS"
            }));
            this.setData({key: "cosine_similarity_SBS", data: exposureSbsCosineSimilarityData});

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

            const exposureDbsCosineSimilarityScale = new ContinuousScale("cosine_similarity_DBS", "DBS Cos. Sim.", [0, 1]);
            this.setScale({key: "cosine_similarity_DBS", scale: exposureDbsCosineSimilarityScale});

            const exposureDbsCosineSimilarityData = new DataContainer("cosine_similarity_DBS", "DBS Cos. Sim.", API.fetchPlotReconstructionCosineSimilarity({
                "projects": this.getConfig().selectedSamples,
                "signatures": this.getConfig().selectedSignaturesDbs,
                "mut_type": "DBS"
            }));
            this.setData({key: "cosine_similarity_DBS", data: exposureDbsCosineSimilarityData});

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

            const exposureIndelCosineSimilarityScale = new ContinuousScale("cosine_similarity_INDEL", "INDEL Cos. Sim.", [0, 1]);
            this.setScale({key: "cosine_similarity_INDEL", scale: exposureIndelCosineSimilarityScale});

            const exposureIndelCosineSimilarityData = new DataContainer("cosine_similarity_INDEL", "INDEL Cos. Sim.", API.fetchPlotReconstructionCosineSimilarity({
                "projects": this.getConfig().selectedSamples,
                "signatures": this.getConfig().selectedSignaturesIndel,
                "mut_type": "INDEL"
            }));
            this.setData({key: "cosine_similarity_INDEL", data: exposureIndelCosineSimilarityData});

            /* Contexts scales for reconstruction and signature plots */
            const contextsScaleSbs = new CategoricalScale("cat_SBS", "SBS Mutation Category", SBS_CATS, undefined, getCategoryColors(SBS_CATS, SBS_SUPERCAT_MAP, SBS_SUPERCAT_COLORS));
            this.setScale({key: "cat_SBS", scale: contextsScaleSbs});

            const contextsScaleDbs = new CategoricalScale("cat_DBS", "DBS Mutation Category", DBS_CATS, undefined, getCategoryColors(DBS_CATS, DBS_SUPERCAT_MAP, DBS_SUPERCAT_COLORS));
            this.setScale({key: "cat_DBS", scale: contextsScaleDbs});

            const contextsScaleIndel = new CategoricalScale("cat_INDEL", "INDEL Mutation Category", INDEL_CATS, undefined, getCategoryColors(INDEL_CATS, INDEL_SUPERCAT_MAP, INDEL_SUPERCAT_COLORS));
            this.setScale({key: "cat_INDEL", scale: contextsScaleIndel});

            /* CLUSTERING  */
            const exposuresClusteringData = new DataContainer("exposures_clustering", "Clustering by Exposure", API.fetchClustering({
                "projects": this.getConfig().selectedSamples,
                "signatures": {
                    "SBS": this.getConfig().selectedSignaturesSbs,
                    "DBS": this.getConfig().selectedSignaturesDbs,
                    "INDEL": this.getConfig().selectedSignaturesIndel
                }
            }));
            this.setData({key: "exposures_clustering", data: exposuresClusteringData});

            /* GENE ALTERATION DATA */
            const geneScale = new CategoricalScale("gene", "Gene", this.getConfig().selectedGenes);
            this.setScale({key: "gene", scale: geneScale});

            const geneEventScale = new CategoricalScale("mut_class", "Mutation Classification", API.fetchScaleGeneAlterations(), undefined, {"None": "#FFFFFF"});
            this.setScale({key: "mut_class", scale: geneEventScale});

            for(const geneId of this.getConfig().selectedGenes) {
                this.setData({key: ("gene_" + geneId), data: new DataContainer("gene_" + geneId, geneId + " Mutation Type", API.fetchGeneEventTrack({
                    "projects": this.getConfig().selectedSamples,
                    "gene_id": geneId
                }))});
            }

            /* CLINICAL DATA */
            const clinicalVariableScale = new CategoricalScale(
                "clinical_variable", 
                "Clinical Variable", 
                this.getConfig().selectedClinicalVariables
            );
            this.setScale({key:"clinical_variable", scale: clinicalVariableScale});

            for(const clinicalVar of this.getConfig().selectedClinicalVariables) {
                if(CONTINUOUS_CLINICAL_VARS.includes(clinicalVar)) {
                    this.setScale({key: ("cv_" + clinicalVar), scale: new ContinuousScale("cv_" + clinicalVar, clinicalVar, API.fetchScaleClinicalTrack({
                        "projects": this.getConfig().selectedSamples,
                        "clinical_variable": clinicalVar
                    }))});
                } else {
                    this.setScale({key: ("cv_" + clinicalVar), scale: new CategoricalScale("cv_" + clinicalVar, clinicalVar, API.fetchScaleClinicalTrack({
                        "projects": this.getConfig().selectedSamples,
                        "clinical_variable": clinicalVar
                    }))});
                }
                
                this.setData({key: ("cv_" + clinicalVar), data: new DataContainer("cv_" + clinicalVar, clinicalVar, API.fetchClinicalTrack({
                    "projects": this.getConfig().selectedSamples,
                    "clinical_variable": clinicalVar
                }))});
            }


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
            'setScale',
            'setStratification',
            'setVisibility',
            'setSamples'
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
        border-left: 1px solid $color-lgray;
    }
    .explorer-legend {
        flex: 2;
        border-left: 1px solid $color-lgray;
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
    .explorer-control-right {
        float: right;
    }
}

</style>
