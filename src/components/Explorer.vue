<template>
    <div>
        <div class="explorer-control" :style="{ 'height': 24 + 'px' }"> 
            <HistoryButtons />
            <SortButtons />
            <StratificationButtons />
            <FilterButtons />

            <SharingButtons :style="{'float': 'right'}" />
        </div> 
        <div class="explorer" :style="{ 'height': (windowHeight-73) + 'px' }">
            <div class="explorer-main explorer-col" :style="{'width': colWidthMain + 'px'}">
                <ExplorerMain/>
            </div>
            <Divider side="left" />
            <div class="explorer-overview explorer-col" :style="{'width': colWidthOverview + 'px'}">
                <ExplorerOverviewTabs />
                <ExplorerOverview v-if="showOverview"/>
                <ExplorerOverviewSampleContainer v-if="showOverviewSample"/>
            </div>
            <Divider side="right" />
            <div class="explorer-legend explorer-col" :style="{'width': colWidthLegend + 'px'}">
                <div class="explorer-col-title">
                    <h3>Legend</h3>
                </div>
                <ExplorerLegend />
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import { max as d3_max, sum as d3_sum } from 'd3-array';
import { HistoryStack, EVENT_TYPES, EVENT_SUBTYPE_RESETS } from 'vueplotlib';
import { CategoricalScale, ContinuousScale, GenomeScale, DataContainer } from 'vueplotlib';

import Stratification, { EVENT_TYPE_STRATIFY, EVENT_SUBTYPE_STRATIFY, EVENT_SUBTYPE_RESET_STRATIFY } from './../vdp/Stratification.js';
import Visibility, { EVENT_TYPE_VISIBILITY, EVENT_SUBTYPE_VISIBILITY, EVENT_SUBTYPE_RESET_VISIBILITY, PLOT_GROUPS } from './../vdp/Visibility.js';
import Samples, { EVENT_TYPE_SAMPLES, EVENT_SUBTYPE_SAMPLES, EVENT_SUBTYPE_RESET_SAMPLES } from './../vdp/Samples.js';
import Sizes, { EVENT_TYPE_SIZES, EVENT_SUBTYPE_COLUMNS, EVENT_SUBTYPE_RESET_COLUMNS, EXPLORER_COLUMNS, EVENT_SUBTYPE_HEIGHTS, EVENT_SUBTYPE_RESET_HEIGHTS } from './../vdp/Sizes.js';

import HistoryButtons from './HistoryButtons.vue';
import SortButtons from './SortButtons.vue';
import StratificationButtons from './StratificationButtons.vue';
import FilterButtons from './FilterButtons.vue';
import SharingButtons from './SharingButtons.vue';

import ExplorerOverviewTabs from './ExplorerOverviewTabs.vue';
import ExplorerOverviewSampleContainer from './ExplorerOverviewSampleContainer.vue';

import ExplorerLegend from './ExplorerLegend.vue';
import ExplorerOverview from './ExplorerOverview.vue';
import ExplorerMain from './ExplorerMain.vue';

import Divider from './Divider.vue';

import API from './../api.js';

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
        FilterButtons,
        SharingButtons,
        ExplorerLegend,
        ExplorerOverview,
        ExplorerMain,
        ExplorerOverviewTabs,
        ExplorerOverviewSampleContainer,
        Divider
    },
    computed: {
        showOverview() {
            return this.getSamples().activeSample === null;
        },
        showOverviewSample() {
            return this.getSamples().activeSample !== null;
        },
        colWidthMain() {
            return this.windowWidth * this.getSizes().columns[EXPLORER_COLUMNS.MAIN];
        },
        colWidthOverview() {
            return this.windowWidth * this.getSizes().columns[EXPLORER_COLUMNS.OVERVIEW];
        },
        colWidthLegend() {
            return this.windowWidth * this.getSizes().columns[EXPLORER_COLUMNS.LEGEND];
        },
        ...mapGetters([
            'windowHeight', 
            'windowWidth',
            'continuousClinicalVariables',
            'getConfig',
            'getStack',
            'getStratification',
            'getVisibility',
            'getSamples',
            'getData',
            'getScale',
            'getSizes'
        ])
    },
    created() {
        this.initStack();
        this.initStratification();
        this.initVisibility();
        this.initSizes();
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
                    [EVENT_TYPE_SAMPLES]: this.getSamples,
                    [EVENT_TYPE_SIZES]: this.getSizes
                }, 
                {
                    [EVENT_SUBTYPE_STRATIFY]: EVENT_SUBTYPE_RESET_STRATIFY,
                    [EVENT_SUBTYPE_VISIBILITY]: EVENT_SUBTYPE_RESET_VISIBILITY,
                    [EVENT_SUBTYPE_SAMPLES]: EVENT_SUBTYPE_RESET_SAMPLES,
                    [EVENT_SUBTYPE_COLUMNS]: EVENT_SUBTYPE_RESET_COLUMNS,
                    [EVENT_SUBTYPE_HEIGHTS]: EVENT_SUBTYPE_RESET_HEIGHTS,
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
        initSizes() {
            const sizes = new Sizes();
            this.setSizes(sizes);
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
            const countScale = new ContinuousScale("mut_count", "Mutation Count", API.fetchPlotCounts({
                "projects": this.getConfig().selectedSamples
            }).then((data) => {
                const mutTypes = mutTypeScale.domain;
                return [0, d3_max(data.map(d => d3_max(mutTypes.map(mt => d[mt]))))];
            }));
            this.setScale({key: "mut_count", scale: countScale});

            const countSumScale = new ContinuousScale("mut_count_sum", "Mutation Count", API.fetchPlotCounts({
                "projects": this.getConfig().selectedSamples
            }).then((data) => {
                const mutTypes = mutTypeScale.domain;
                return [0, d3_max(data.map(d => d3_sum(mutTypes.map(mt => d[mt]))))];
            }));
            this.setScale({key: "mut_count_sum", scale: countSumScale});

            const countData = new DataContainer("mut_count", "Mutation Count", API.fetchPlotCounts({
                "projects": this.getConfig().selectedSamples
            }));
            this.setData({key: "mut_count", data: countData});

            /* SIGNATURE EXPOSURES: SBS */
            const exposureSbsScale = new ContinuousScale("exposure_sbs", "SBS Exposure", API.fetchPlotExposures({
                "projects": this.getConfig().selectedSamples,
                "signatures": this.getConfig().selectedSignaturesSbs,
                "mut_type": "SBS",
                "tricounts_method": this.getConfig().selectedTricountsMethod
            }).then((data) => {
                const sigNames = this.getConfig().selectedSignaturesSbs;
                return [0, d3_max(data.map(d => d3_max(sigNames.map(sn => d[sn]))))];
            }));
            this.setScale({key: "exposure_sbs", scale: exposureSbsScale});

            const exposureSumSbsScale = new ContinuousScale("exposure_sum_sbs", "SBS Exposure", API.fetchPlotExposures({
                "projects": this.getConfig().selectedSamples,
                "signatures": this.getConfig().selectedSignaturesSbs,
                "mut_type": "SBS",
                "tricounts_method": this.getConfig().selectedTricountsMethod
            }).then((data) => {
                const sigNames = this.getConfig().selectedSignaturesSbs;
                return [0, d3_max(data.map(d => d3_sum(sigNames.map(sn => d[sn]))))];
            }));
            this.setScale({key: "exposure_sum_sbs", scale: exposureSumSbsScale});

            const exposureSbsNormalizedScale = new ContinuousScale("exposure_sbs_normalized", "SBS Normalized Exposure", API.fetchScaleExposuresNormalized({
                "projects": this.getConfig().selectedSamples,
                "signatures": this.getConfig().selectedSignaturesSbs,
                "mut_type": "SBS",
                "tricounts_method": this.getConfig().selectedTricountsMethod
            }), "Greys");
            this.setScale({key: "exposure_sbs_normalized", scale: exposureSbsNormalizedScale});

            const exposureSbsSumNormalizedScale = new ContinuousScale("exposure_sum_sbs_normalized", "SBS Normalized Exposure", [0, 1]);
            this.setScale({key: "exposure_sum_sbs_normalized", scale: exposureSbsSumNormalizedScale});

            const exposureSbsData = new DataContainer("exposure_sbs", "SBS Exposure", API.fetchPlotExposures({
                "projects": this.getConfig().selectedSamples,
                "signatures": this.getConfig().selectedSignaturesSbs,
                "mut_type": "SBS",
                "tricounts_method": this.getConfig().selectedTricountsMethod
            }));
            this.setData({key: "exposure_sbs", data: exposureSbsData});

            const exposureSbsNormalizedData = new DataContainer("exposure_sbs_normalized", "SBS Normalized Exposure", API.fetchPlotExposuresNormalized({
                "projects": this.getConfig().selectedSamples,
                "signatures": this.getConfig().selectedSignaturesSbs,
                "mut_type": "SBS",
                "tricounts_method": this.getConfig().selectedTricountsMethod
            }));
            this.setData({key: "exposure_sbs_normalized", data: exposureSbsNormalizedData});

            const exposureSbsCosineSimilarityScale = new ContinuousScale("cosine_similarity_SBS", "SBS Cos. Sim.", [0, 1]);
            this.setScale({key: "cosine_similarity_SBS", scale: exposureSbsCosineSimilarityScale});

            const exposureSbsCosineSimilarityData = new DataContainer("cosine_similarity_SBS", "SBS Cos. Sim.", API.fetchPlotReconstructionCosineSimilarity({
                "projects": this.getConfig().selectedSamples,
                "signatures": this.getConfig().selectedSignaturesSbs,
                "mut_type": "SBS",
                "tricounts_method": this.getConfig().selectedTricountsMethod
            }));
            this.setData({key: "cosine_similarity_SBS", data: exposureSbsCosineSimilarityData});

            /* SIGNATURE EXPOSURES: DBS */
            const exposureDbsScale = new ContinuousScale("exposure_dbs", "DBS Exposure", API.fetchPlotExposures({
                "projects": this.getConfig().selectedSamples,
                "signatures": this.getConfig().selectedSignaturesDbs,
                "mut_type": "DBS",
                "tricounts_method": this.getConfig().selectedTricountsMethod
            }).then((data) => {
                const sigNames = this.getConfig().selectedSignaturesDbs;
                return [0, d3_max(data.map(d => d3_max(sigNames.map(sn => d[sn]))))];
            }));
            this.setScale({key: "exposure_dbs", scale: exposureDbsScale});

            const exposureSumDbsScale = new ContinuousScale("exposure_sum_dbs", "DBS Exposure", API.fetchPlotExposures({
                "projects": this.getConfig().selectedSamples,
                "signatures": this.getConfig().selectedSignaturesDbs,
                "mut_type": "DBS",
                "tricounts_method": this.getConfig().selectedTricountsMethod
            }).then((data) => {
                const sigNames = this.getConfig().selectedSignaturesDbs;
                return [0, d3_max(data.map(d => d3_sum(sigNames.map(sn => d[sn]))))];
            }));
            this.setScale({key: "exposure_sum_dbs", scale: exposureSumDbsScale});

            const exposureDbsNormalizedScale = new ContinuousScale("exposure_dbs_normalized", "DBS Normalized Exposure", API.fetchScaleExposuresNormalized({
                "projects": this.getConfig().selectedSamples,
                "signatures": this.getConfig().selectedSignaturesDbs,
                "mut_type": "DBS",
                "tricounts_method": this.getConfig().selectedTricountsMethod
            }), "Greys");
            this.setScale({key: "exposure_dbs_normalized", scale: exposureDbsNormalizedScale});

            const exposureDbsSumNormalizedScale = new ContinuousScale("exposure_sum_dbs_normalized", "DBS Normalized Exposure", [0, 1]);
            this.setScale({key: "exposure_sum_dbs_normalized", scale: exposureDbsSumNormalizedScale});

            const exposureDbsData = new DataContainer("exposure_dbs", "DBS Exposure", API.fetchPlotExposures({
                "projects": this.getConfig().selectedSamples,
                "signatures": this.getConfig().selectedSignaturesDbs,
                "mut_type": "DBS",
                "tricounts_method": this.getConfig().selectedTricountsMethod
            }));
            this.setData({key: "exposure_dbs", data: exposureDbsData});

            const exposureDbsNormalizedData = new DataContainer("exposure_dbs_normalized", "DBS Normalized Exposure", API.fetchPlotExposuresNormalized({
                "projects": this.getConfig().selectedSamples,
                "signatures": this.getConfig().selectedSignaturesDbs,
                "mut_type": "DBS",
                "tricounts_method": this.getConfig().selectedTricountsMethod
            }));
            this.setData({key: "exposure_dbs_normalized", data: exposureDbsNormalizedData});

            const exposureDbsCosineSimilarityScale = new ContinuousScale("cosine_similarity_DBS", "DBS Cos. Sim.", [0, 1]);
            this.setScale({key: "cosine_similarity_DBS", scale: exposureDbsCosineSimilarityScale});

            const exposureDbsCosineSimilarityData = new DataContainer("cosine_similarity_DBS", "DBS Cos. Sim.", API.fetchPlotReconstructionCosineSimilarity({
                "projects": this.getConfig().selectedSamples,
                "signatures": this.getConfig().selectedSignaturesDbs,
                "mut_type": "DBS",
                "tricounts_method": this.getConfig().selectedTricountsMethod
            }));
            this.setData({key: "cosine_similarity_DBS", data: exposureDbsCosineSimilarityData});

            /* SIGNATURE EXPOSURES: INDEL */
            const exposureIndelScale = new ContinuousScale("exposure_indel", "INDEL Exposure", API.fetchPlotExposures({
                "projects": this.getConfig().selectedSamples,
                "signatures": this.getConfig().selectedSignaturesIndel,
                "mut_type": "INDEL",
                "tricounts_method": this.getConfig().selectedTricountsMethod
            }).then((data) => {
                const sigNames = this.getConfig().selectedSignaturesIndel;
                return [0, d3_max(data.map(d => d3_max(sigNames.map(sn => d[sn]))))];
            }));
            this.setScale({key: "exposure_indel", scale: exposureIndelScale});

            const exposureSumIndelScale = new ContinuousScale("exposure_sum_indel", "INDEL Exposure", API.fetchPlotExposures({
                "projects": this.getConfig().selectedSamples,
                "signatures": this.getConfig().selectedSignaturesIndel,
                "mut_type": "INDEL",
                "tricounts_method": this.getConfig().selectedTricountsMethod
            }).then((data) => {
                const sigNames = this.getConfig().selectedSignaturesIndel;
                return [0, d3_max(data.map(d => d3_sum(sigNames.map(sn => d[sn]))))];
            }));
            this.setScale({key: "exposure_sum_indel", scale: exposureSumIndelScale});

            const exposureIndelNormalizedScale = new ContinuousScale("exposure_indel_normalized", "INDEL Normalized Exposure", API.fetchScaleExposuresNormalized({
                "projects": this.getConfig().selectedSamples,
                "signatures": this.getConfig().selectedSignaturesIndel,
                "mut_type": "INDEL",
                "tricounts_method": this.getConfig().selectedTricountsMethod
            }), "Greys");
            this.setScale({key: "exposure_indel_normalized", scale: exposureIndelNormalizedScale});

            const exposureIndelSumNormalizedScale = new ContinuousScale("exposure_sum_indel_normalized", "INDEL Normalized Exposure", [0, 1]);
            this.setScale({key: "exposure_sum_indel_normalized", scale: exposureIndelSumNormalizedScale});

            const exposureIndelData = new DataContainer("exposure_indel", "INDEL Exposure", API.fetchPlotExposures({
                "projects": this.getConfig().selectedSamples,
                "signatures": this.getConfig().selectedSignaturesIndel,
                "mut_type": "INDEL",
                "tricounts_method": this.getConfig().selectedTricountsMethod
            }));
            this.setData({key: "exposure_indel", data: exposureIndelData});

            const exposureIndelNormalizedData = new DataContainer("exposure_indel_normalized", "INDEL Normalized Exposure", API.fetchPlotExposuresNormalized({
                "projects": this.getConfig().selectedSamples,
                "signatures": this.getConfig().selectedSignaturesIndel,
                "mut_type": "INDEL",
                "tricounts_method": this.getConfig().selectedTricountsMethod
            }));
            this.setData({key: "exposure_indel_normalized", data: exposureIndelNormalizedData});

            const exposureIndelCosineSimilarityScale = new ContinuousScale("cosine_similarity_INDEL", "INDEL Cos. Sim.", [0, 1]);
            this.setScale({key: "cosine_similarity_INDEL", scale: exposureIndelCosineSimilarityScale});

            const exposureIndelCosineSimilarityData = new DataContainer("cosine_similarity_INDEL", "INDEL Cos. Sim.", API.fetchPlotReconstructionCosineSimilarity({
                "projects": this.getConfig().selectedSamples,
                "signatures": this.getConfig().selectedSignaturesIndel,
                "mut_type": "INDEL",
                "tricounts_method": this.getConfig().selectedTricountsMethod
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
                },
                "tricounts_method": this.getConfig().selectedTricountsMethod
            }));
            this.setData({key: "exposures_clustering", data: exposuresClusteringData});

            /* GENE ALTERATION DATA */
            const geneScaleMut = new CategoricalScale("gene_mut", (this.getConfig().selectedGenes.length > 3 ? "Gene Mut." : "Mut."), this.getConfig().selectedGenes);
            this.setScale({key: "gene_mut", scale: geneScaleMut});

            const geneScaleExp = new CategoricalScale("gene_exp", (this.getConfig().selectedGenes.length > 3 ? "Gene Expr." : "Expr."), this.getConfig().selectedGenes);
            this.setScale({key: "gene_exp", scale: geneScaleExp});

            const geneScaleCNA = new CategoricalScale("gene_cna", (this.getConfig().selectedGenes.length > 3 ? "Gene CNA" : "CNA"), this.getConfig().selectedGenes);
            this.setScale({key: "gene_cna", scale: geneScaleCNA});

            const geneMutScale = new CategoricalScale("mut_class", "Mutation Classification", API.fetchScaleGeneAlterations(), undefined, {"None": "#F5F5F5"});
            this.setScale({key: "mut_class", scale: geneMutScale});

            const geneExpScale = new CategoricalScale("gene_expression", "Gene Expression", ["Under", "Not differentially expressed", "Over"]);
            this.setScale({key: "gene_expression", scale: geneExpScale});

            const geneCNAScale = new CategoricalScale("copy_number", "Copy Number", ["-2", "-1", "0", "1", "2"]);
            this.setScale({key: "copy_number", scale: geneCNAScale});

            for(const geneId of this.getConfig().selectedGenes) {
                this.setData({key: ("gene_mut_" + geneId), data: new DataContainer("gene_mut_" + geneId, geneId + " Mutation Classification", API.fetchPlotGeneMutTrack({
                    "projects": this.getConfig().selectedSamples,
                    "gene_id": geneId
                }))});

                this.setData({key: ("gene_exp_" + geneId), data: new DataContainer("gene_exp_" + geneId, geneId + " Gene Expression", API.fetchPlotGeneExpTrack({
                    "projects": this.getConfig().selectedSamples,
                    "gene_id": geneId
                }))});

                this.setData({key: ("gene_cna_" + geneId), data: new DataContainer("gene_cna_" + geneId, geneId + " Copy Number", API.fetchPlotGeneCNATrack({
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
            this.setScale({key: "clinical_variable", scale: clinicalVariableScale});

            this.setData({key: "clinical_data", data: new DataContainer("clinical_data", "Clinical Data", API.fetchPlotClinical({
                "projects": this.getConfig().selectedSamples
            }))});

            for(const clinicalVar of this.getConfig().selectedClinicalVariables) {
                if(this.continuousClinicalVariables.includes(clinicalVar)) {
                    this.setScale({key: clinicalVar, scale: new ContinuousScale(clinicalVar, clinicalVar, API.fetchScaleClinical({
                        "projects": this.getConfig().selectedSamples
                    }).then((data) => {
                        return data[clinicalVar];
                    }))});
                } else {
                    this.setScale({key: clinicalVar, scale: new CategoricalScale(clinicalVar, clinicalVar, API.fetchScaleClinical({
                        "projects": this.getConfig().selectedSamples
                    }).then((data) => {
                        return data[clinicalVar];
                    }))});
                }
                
                
            }

            /* SURVIVAL DATA */
            const survivalPctScale = new ContinuousScale("survival_pct", "Percent Survival", [0, 100]);
            this.setScale({key: "survival_pct", scale: survivalPctScale});

            const survivalTimeScale = new ContinuousScale("survival_time", "Days", API.fetchPlotSurvival({
                    "projects": this.getConfig().selectedSamples
                }).then((data) => {
                    return [0, Math.max(d3_max(data, d => (d["days_to_death"] === "nan" ? NaN : d["days_to_death"])), d3_max(data, d => (d["days_to_last_followup"] === "nan" ? NaN : d["days_to_last_followup"])))]
                })
            );
            this.setScale({key: "survival_time", scale: survivalTimeScale});

            const survivalData = new DataContainer("survival", "Survival", API.fetchPlotSurvival({
                    "projects": this.getConfig().selectedSamples
                })
            );
            this.setData({key: "survival", data: survivalData});


            const makeDominantSigFunction = (sigs, sigs_name) => {
                return (data) => {
                    let result = data.map(d => {
                        let maxVal = 0;
                        let maxKey = "nan";
                        for(let sig of sigs) {
                            if(d[sig] > maxVal) {
                                maxVal = d[sig];
                                maxKey = sig;
                            }
                        }
                        return {
                            "sample_id": d["sample_id"],
                            [sigs_name]: maxKey
                        };
                    });
                    return result;
                }
            };

            /* Dominant Signatures */
            const dominantSigSbsMetaScale = new CategoricalScale("dominant_sig_sbs_meta", "", ["Dominant SBS Signature"]);
            this.setScale({key: "dominant_sig_sbs_meta", scale: dominantSigSbsMetaScale});

            const dominantSigSbsData = new DataContainer("dominant_sig_sbs", "SBS Dominant Signature", API.fetchPlotExposures({
                    "projects": this.getConfig().selectedSamples,
                    "signatures": this.getConfig().selectedSignaturesSbs,
                    "mut_type": "SBS",
                    "tricounts_method": this.getConfig().selectedTricountsMethod
                }).then(
                    makeDominantSigFunction(this.getConfig().selectedSignaturesSbs, "sig_SBS")
                )
            );
            this.setData({key: "dominant_sig_sbs", data: dominantSigSbsData});

            const dominantSigDbsMetaScale = new CategoricalScale("dominant_sig_dbs_meta", "", ["Dominant DBS Signature"]);
            this.setScale({key: "dominant_sig_dbs_meta", scale: dominantSigDbsMetaScale});

            const dominantSigDbsData = new DataContainer("dominant_sig_dbs", "DBS Dominant Signature", API.fetchPlotExposures({
                    "projects": this.getConfig().selectedSamples,
                    "signatures": this.getConfig().selectedSignaturesDbs,
                    "mut_type": "DBS",
                    "tricounts_method": this.getConfig().selectedTricountsMethod
                }).then(
                    makeDominantSigFunction(this.getConfig().selectedSignaturesDbs, "sig_DBS")
                )
            );
            this.setData({key: "dominant_sig_dbs", data: dominantSigDbsData});

            const dominantSigIndelMetaScale = new CategoricalScale("dominant_sig_indel_meta", "", ["Dominant INDEL Signature"]);
            this.setScale({key: "dominant_sig_indel_meta", scale: dominantSigIndelMetaScale});

            const dominantSigIndelData = new DataContainer("dominant_sig_indel", "INDEL Dominant Signature", API.fetchPlotExposures({
                    "projects": this.getConfig().selectedSamples,
                    "signatures": this.getConfig().selectedSignaturesIndel,
                    "mut_type": "INDEL",
                    "tricounts_method": this.getConfig().selectedTricountsMethod
                }).then(
                    makeDominantSigFunction(this.getConfig().selectedSignaturesIndel, "sig_INDEL")
                )
            );
            this.setData({key: "dominant_sig_indel", data: dominantSigIndelData});

            /* Samples with Signatures */
            const numSamplesScale = new ContinuousScale("num_samples", "Number of Samples", API.fetchScaleSamples({
                    "projects": this.getConfig().selectedSamples
                }).then((data) => {
                    return [0, data.length];
                })
            );
            this.setScale({key: "num_samples", scale: numSamplesScale});

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
            'setSamples',
            'setSizes'
        ])
    }
}
</script>

<style lang="scss">
@import './../style/variables.scss';

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
    .explorer-legend {
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
