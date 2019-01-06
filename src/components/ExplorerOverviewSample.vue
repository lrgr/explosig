<template>
    <div>
        <h3 class="sample-title">Sample {{ sampleId }}</h3>
        <!-- Counts -->
        <PlotInfo title="Reconstruction of Mutation Profile" :showTitle="true">
            <p slot="info">
                This plot displays the mutation counts and the reconstruction using signatures with the error for each category.
            </p>
        </PlotInfo>
        <div v-if="showSbs">
            <p class="sample-cosine-similarity">SBS Reconstruction Cosine Similarity: {{ cosineSimilaritySbs }}</p>
            <PlotContainer
                :pWidth="(colWidth-100-5)"
                :pHeight="200"
                :pMarginTop="10"
                :pMarginLeft="100"
                :pMarginRight="5"
                :pMarginBottom="5"
            >
                <Axis 
                    slot="axisLeft"
                    :variable="('count_SBS_' + sampleId)"
                    side="left"

                    :getScale="getScale"
                    :getStack="getStack"
                />
                <BarPlot 
                    slot="plot"
                    :data="('count_SBS_' + sampleId)"
                    x="cat_SBS"
                    :y="('count_SBS_' + sampleId)"
                    :getData="getData"
                    :getScale="getScale"
                />
            </PlotContainer>

            <PlotContainer
                :pWidth="(colWidth-100-5)"
                :pHeight="200"
                :pMarginTop="10"
                :pMarginLeft="100"
                :pMarginRight="5"
                :pMarginBottom="5"
            >
                <Axis 
                    slot="axisLeft"
                    :variable="('reconstruction_SBS_' + sampleId)"
                    side="left"

                    :getScale="getScale"
                    :getStack="getStack"
                />
                <BarPlot 
                    slot="plot"
                    :data="('reconstruction_SBS_' + sampleId)"
                    x="cat_SBS"
                    :y="('reconstruction_SBS_' + sampleId)"
                    :getData="getData"
                    :getScale="getScale"
                />
            </PlotContainer>

            <PlotContainer
                :pWidth="(colWidth-100-5)"
                :pHeight="200"
                :pMarginTop="10"
                :pMarginLeft="100"
                :pMarginRight="5"
                :pMarginBottom="5"
            >
                <Axis 
                    slot="axisLeft"
                    :variable="('error_SBS_' + sampleId)"
                    side="left"

                    :getScale="getScale"
                    :getStack="getStack"
                />
                <BarPlot 
                    slot="plot"
                    :data="('error_SBS_' + sampleId)"
                    x="cat_SBS"
                    :y="('error_SBS_' + sampleId)"
                    :getData="getData"
                    :getScale="getScale"
                />
            </PlotContainer>

            <PlotContainer
                :pWidth="(colWidth-100-5)"
                :pHeight="0"
                :pMarginTop="0"
                :pMarginLeft="100"
                :pMarginRight="5"
                :pMarginBottom="200"
            >
                <Axis 
                    slot="axisBottom"
                    variable="cat_SBS"
                    side="bottom"
                    :tickRotation="-65"
                    :disableBrushing="true"
                    :getScale="getScale"
                    :getStack="getStack"
                />
            </PlotContainer>
        </div>

        <div v-if="showDbs">
            <p class="sample-cosine-similarity">DBS Reconstruction Cosine Similarity: {{ cosineSimilarityDbs }}</p>
            <PlotContainer
                :pWidth="(colWidth-100-5)"
                :pHeight="200"
                :pMarginTop="10"
                :pMarginLeft="100"
                :pMarginRight="5"
                :pMarginBottom="5"
            >
                <Axis 
                    slot="axisLeft"
                    :variable="('count_DBS_' + sampleId)"
                    side="left"

                    :getScale="getScale"
                    :getStack="getStack"
                />
                <BarPlot 
                    slot="plot"
                    :data="('count_DBS_' + sampleId)"
                    x="cat_DBS"
                    :y="('count_DBS_' + sampleId)"
                    :getData="getData"
                    :getScale="getScale"
                />
            </PlotContainer>

            <PlotContainer
                :pWidth="(colWidth-100-5)"
                :pHeight="200"
                :pMarginTop="10"
                :pMarginLeft="100"
                :pMarginRight="5"
                :pMarginBottom="5"
            >
                <Axis 
                    slot="axisLeft"
                    :variable="('reconstruction_DBS_' + sampleId)"
                    side="left"

                    :getScale="getScale"
                    :getStack="getStack"
                />
                <BarPlot 
                    slot="plot"
                    :data="('reconstruction_DBS_' + sampleId)"
                    x="cat_DBS"
                    :y="('reconstruction_DBS_' + sampleId)"
                    :getData="getData"
                    :getScale="getScale"
                />
            </PlotContainer>

            <PlotContainer
                :pWidth="(colWidth-100-5)"
                :pHeight="200"
                :pMarginTop="10"
                :pMarginLeft="100"
                :pMarginRight="5"
                :pMarginBottom="5"
            >
                <Axis 
                    slot="axisLeft"
                    :variable="('error_DBS_' + sampleId)"
                    side="left"

                    :getScale="getScale"
                    :getStack="getStack"
                />
                <BarPlot 
                    slot="plot"
                    :data="('error_DBS_' + sampleId)"
                    x="cat_DBS"
                    :y="('error_DBS_' + sampleId)"
                    :getData="getData"
                    :getScale="getScale"
                />
            </PlotContainer>

            <PlotContainer
                :pWidth="(colWidth-100-5)"
                :pHeight="0"
                :pMarginTop="0"
                :pMarginLeft="100"
                :pMarginRight="5"
                :pMarginBottom="200"
            >
                <Axis 
                    slot="axisBottom"
                    variable="cat_DBS"
                    side="bottom"
                    :tickRotation="-65"
                    :disableBrushing="true"
                    :getScale="getScale"
                    :getStack="getStack"
                />
            </PlotContainer>
        </div>

        <div v-if="showIndel">
            <p class="sample-cosine-similarity">INDEL Reconstruction Cosine Similarity: {{ cosineSimilarityIndel }}</p>
            <PlotContainer
                :pWidth="(colWidth-100-5)"
                :pHeight="200"
                :pMarginTop="10"
                :pMarginLeft="100"
                :pMarginRight="5"
                :pMarginBottom="5"
            >
                <Axis 
                    slot="axisLeft"
                    :variable="('count_INDEL_' + sampleId)"
                    side="left"

                    :getScale="getScale"
                    :getStack="getStack"
                />
                <BarPlot 
                    slot="plot"
                    :data="('count_INDEL_' + sampleId)"
                    x="cat_INDEL"
                    :y="('count_INDEL_' + sampleId)"
                    :getData="getData"
                    :getScale="getScale"
                />
            </PlotContainer>

            <PlotContainer
                :pWidth="(colWidth-100-5)"
                :pHeight="200"
                :pMarginTop="10"
                :pMarginLeft="100"
                :pMarginRight="5"
                :pMarginBottom="5"
            >
                <Axis 
                    slot="axisLeft"
                    :variable="('reconstruction_INDEL_' + sampleId)"
                    side="left"

                    :getScale="getScale"
                    :getStack="getStack"
                />
                <BarPlot 
                    slot="plot"
                    :data="('reconstruction_INDEL_' + sampleId)"
                    x="cat_INDEL"
                    :y="('reconstruction_INDEL_' + sampleId)"
                    :getData="getData"
                    :getScale="getScale"
                />
            </PlotContainer>

            <PlotContainer
                :pWidth="(colWidth-100-5)"
                :pHeight="200"
                :pMarginTop="10"
                :pMarginLeft="100"
                :pMarginRight="5"
                :pMarginBottom="5"
            >
                <Axis 
                    slot="axisLeft"
                    :variable="('error_INDEL_' + sampleId)"
                    side="left"

                    :getScale="getScale"
                    :getStack="getStack"
                />
                <BarPlot 
                    slot="plot"
                    :data="('error_INDEL_' + sampleId)"
                    x="cat_INDEL"
                    :y="('error_INDEL_' + sampleId)"
                    :getData="getData"
                    :getScale="getScale"
                />
            </PlotContainer>

            <PlotContainer
                :pWidth="(colWidth-100-5)"
                :pHeight="0"
                :pMarginTop="0"
                :pMarginLeft="100"
                :pMarginRight="5"
                :pMarginBottom="200"
            >
                <Axis 
                    slot="axisBottom"
                    variable="cat_INDEL"
                    side="bottom"
                    :tickRotation="-65"
                    :disableBrushing="true"
                    :getScale="getScale"
                    :getStack="getStack"
                />
            </PlotContainer>
        </div>
 
    </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import PlotInfo from './PlotInfo.vue';
import API from './../api.js';


import { CategoricalScale, ContinuousScale, GenomeScale, DataContainer } from 'vue-declarative-plots';


export default {
    name: 'ExplorerOverviewSample',
    components: {
        PlotInfo
    },
    props: {
        'widthProportion': {
            type: Number
        }
    },
    data() {
        return {
            sampleId: "",
            cosineSimilaritySbs: "Loading...",
            cosineSimilarityDbs: "Loading...",
            cosineSimilarityIndel: "Loading..."
        };
    },
    created() {
        this.sampleId = this.getSamples().activeSample;
        this.initScalesAndData();
    },
    methods: {
        initScalesAndData() {

            /*
                SBS
            */
            if(this.showSbs) {
                API.fetchPlotReconstructionCosineSimilaritySingleSample({
                    "projects": this.getConfig().selectedSamples,
                    "signatures": this.getConfig().selectedSignaturesSbs,
                    "mut_type": "SBS",
                    "sample_id": this.sampleId
                }).then((data) => {
                    this.cosineSimilaritySbs = data["cosine_similarity_SBS"];
                });


                // COUNTS
                if(this.getData("count_SBS_" + this.sampleId) === undefined) {
                    const countsSbsData = new DataContainer("count_SBS_" + this.sampleId, "SBS Counts for " + this.sampleId, API.fetchPlotCountsPerCategorySingleSample({
                        "projects": this.getConfig().selectedSamples,
                        "signatures": this.getConfig().selectedSignaturesSbs,
                        "mut_type": "SBS",
                        "sample_id": this.sampleId
                    }));
                    this.setData({key: "count_SBS_" + this.sampleId, data: countsSbsData});
                }
                if(this.getScale("count_SBS_" + this.sampleId) === undefined) {
                    const countsSbsScale = new ContinuousScale("count_SBS_" + this.sampleId, "SBS Category Count", API.fetchScaleReconstructionSingleSample({
                        "projects": this.getConfig().selectedSamples,
                        "signatures": this.getConfig().selectedSignaturesSbs,
                        "mut_type": "SBS",
                        "sample_id": this.sampleId
                    }));
                    this.setScale({key: "count_SBS_" + this.sampleId, scale: countsSbsScale});
                }

                // RECONSTRUCTION
                if(this.getData("reconstruction_SBS_" + this.sampleId) === undefined) {
                    const reconstructionSbsData = new DataContainer("reconstruction_SBS_" + this.sampleId, "SBS Reconstruction for " + this.sampleId, API.fetchPlotReconstructionSingleSample({
                        "projects": this.getConfig().selectedSamples,
                        "signatures": this.getConfig().selectedSignaturesSbs,
                        "mut_type": "SBS",
                        "sample_id": this.sampleId
                    }));
                    this.setData({key: "reconstruction_SBS_" + this.sampleId, data: reconstructionSbsData});
                }

                if(this.getScale("reconstruction_SBS_" + this.sampleId) === undefined) {
                    const reconstructionSbsScale = new ContinuousScale("reconstruction_SBS_" + this.sampleId, "SBS Category Reconstruction", API.fetchScaleReconstructionSingleSample({
                        "projects": this.getConfig().selectedSamples,
                        "signatures": this.getConfig().selectedSignaturesSbs,
                        "mut_type": "SBS",
                        "sample_id": this.sampleId
                    }));
                    this.setScale({key: "reconstruction_SBS_" + this.sampleId, scale: reconstructionSbsScale});
                }

                // RECONSTRUCTION ERROR
                if(this.getData("error_SBS_" + this.sampleId) === undefined) {
                    const errorSbsData = new DataContainer("error_SBS_" + this.sampleId, "SBS Reconstruction Error for " + this.sampleId, API.fetchPlotReconstructionErrorSingleSample({
                        "projects": this.getConfig().selectedSamples,
                        "signatures": this.getConfig().selectedSignaturesSbs,
                        "mut_type": "SBS",
                        "sample_id": this.sampleId
                    }));
                    this.setData({key: "error_SBS_" + this.sampleId, data: errorSbsData});
                }

                if(this.getScale("error_SBS_" + this.sampleId) === undefined) {
                    const errorSbsScale = new ContinuousScale("error_SBS_" + this.sampleId, "SBS Error", API.fetchScaleReconstructionErrorSingleSample({
                        "projects": this.getConfig().selectedSamples,
                        "signatures": this.getConfig().selectedSignaturesSbs,
                        "mut_type": "SBS",
                        "sample_id": this.sampleId
                    }));
                    this.setScale({key: "error_SBS_" + this.sampleId, scale: errorSbsScale});
                }
            }

            /*
                DBS
            */
            if(this.showDbs) {
                API.fetchPlotReconstructionCosineSimilaritySingleSample({
                    "projects": this.getConfig().selectedSamples,
                    "signatures": this.getConfig().selectedSignaturesDbs,
                    "mut_type": "DBS",
                    "sample_id": this.sampleId
                }).then((data) => {
                    this.cosineSimilarityDbs = data["cosine_similarity_DBS"];
                });


                // COUNTS
                if(this.getData("count_DBS_" + this.sampleId) === undefined) {
                    const countsDbsData = new DataContainer("count_DBS_" + this.sampleId, "DBS Counts for " + this.sampleId, API.fetchPlotCountsPerCategorySingleSample({
                        "projects": this.getConfig().selectedSamples,
                        "signatures": this.getConfig().selectedSignaturesDbs,
                        "mut_type": "DBS",
                        "sample_id": this.sampleId
                    }));
                    this.setData({key: "count_DBS_" + this.sampleId, data: countsDbsData});
                }
                if(this.getScale("count_DBS_" + this.sampleId) === undefined) {
                    const countsDbsScale = new ContinuousScale("count_DBS_" + this.sampleId, "DBS Category Count", API.fetchScaleReconstructionSingleSample({
                        "projects": this.getConfig().selectedSamples,
                        "signatures": this.getConfig().selectedSignaturesDbs,
                        "mut_type": "DBS",
                        "sample_id": this.sampleId
                    }));
                    this.setScale({key: "count_DBS_" + this.sampleId, scale: countsDbsScale});
                }

                // RECONSTRUCTION
                if(this.getData("reconstruction_DBS_" + this.sampleId) === undefined) {
                    const reconstructionDbsData = new DataContainer("reconstruction_DBS_" + this.sampleId, "DBS Reconstruction for " + this.sampleId, API.fetchPlotReconstructionSingleSample({
                        "projects": this.getConfig().selectedSamples,
                        "signatures": this.getConfig().selectedSignaturesDbs,
                        "mut_type": "DBS",
                        "sample_id": this.sampleId
                    }));
                    this.setData({key: "reconstruction_DBS_" + this.sampleId, data: reconstructionDbsData});
                }

                if(this.getScale("reconstruction_DBS_" + this.sampleId) === undefined) {
                    const reconstructionDbsScale = new ContinuousScale("reconstruction_DBS_" + this.sampleId, "DBS Category Reconstruction", API.fetchScaleReconstructionSingleSample({
                        "projects": this.getConfig().selectedSamples,
                        "signatures": this.getConfig().selectedSignaturesDbs,
                        "mut_type": "DBS",
                        "sample_id": this.sampleId
                    }));
                    this.setScale({key: "reconstruction_DBS_" + this.sampleId, scale: reconstructionDbsScale});
                }

                // RECONSTRUCTION ERROR
                if(this.getData("error_DBS_" + this.sampleId) === undefined) {
                    const errorDbsData = new DataContainer("error_DBS_" + this.sampleId, "DBS Reconstruction Error for " + this.sampleId, API.fetchPlotReconstructionErrorSingleSample({
                        "projects": this.getConfig().selectedSamples,
                        "signatures": this.getConfig().selectedSignaturesDbs,
                        "mut_type": "DBS",
                        "sample_id": this.sampleId
                    }));
                    this.setData({key: "error_DBS_" + this.sampleId, data: errorDbsData});
                }

                if(this.getScale("error_DBS_" + this.sampleId) === undefined) {
                    const errorDbsScale = new ContinuousScale("error_DBS_" + this.sampleId, "DBS Error", API.fetchScaleReconstructionErrorSingleSample({
                        "projects": this.getConfig().selectedSamples,
                        "signatures": this.getConfig().selectedSignaturesDbs,
                        "mut_type": "DBS",
                        "sample_id": this.sampleId
                    }));
                    this.setScale({key: "error_DBS_" + this.sampleId, scale: errorDbsScale});
                }
            }

            /*
                INDEL
            */
            if(this.showIndel) {
                API.fetchPlotReconstructionCosineSimilaritySingleSample({
                    "projects": this.getConfig().selectedSamples,
                    "signatures": this.getConfig().selectedSignaturesIndel,
                    "mut_type": "INDEL",
                    "sample_id": this.sampleId
                }).then((data) => {
                    this.cosineSimilarityIndel = data["cosine_similarity_INDEL"];
                });


                // COUNTS
                if(this.getData("count_INDEL_" + this.sampleId) === undefined) {
                    const countsIndelData = new DataContainer("count_INDEL_" + this.sampleId, "INDEL Counts for " + this.sampleId, API.fetchPlotCountsPerCategorySingleSample({
                        "projects": this.getConfig().selectedSamples,
                        "signatures": this.getConfig().selectedSignaturesIndel,
                        "mut_type": "INDEL",
                        "sample_id": this.sampleId
                    }));
                    this.setData({key: "count_INDEL_" + this.sampleId, data: countsIndelData});
                }
                if(this.getScale("count_INDEL_" + this.sampleId) === undefined) {
                    const countsIndelScale = new ContinuousScale("count_INDEL_" + this.sampleId, "INDEL Category Count", API.fetchScaleReconstructionSingleSample({
                        "projects": this.getConfig().selectedSamples,
                        "signatures": this.getConfig().selectedSignaturesIndel,
                        "mut_type": "INDEL",
                        "sample_id": this.sampleId
                    }));
                    this.setScale({key: "count_INDEL_" + this.sampleId, scale: countsIndelScale});
                }

                // RECONSTRUCTION
                if(this.getData("reconstruction_INDEL_" + this.sampleId) === undefined) {
                    const reconstructionIndelData = new DataContainer("reconstruction_INDEL_" + this.sampleId, "INDEL Reconstruction for " + this.sampleId, API.fetchPlotReconstructionSingleSample({
                        "projects": this.getConfig().selectedSamples,
                        "signatures": this.getConfig().selectedSignaturesIndel,
                        "mut_type": "INDEL",
                        "sample_id": this.sampleId
                    }));
                    this.setData({key: "reconstruction_INDEL_" + this.sampleId, data: reconstructionIndelData});
                }

                if(this.getScale("reconstruction_INDEL_" + this.sampleId) === undefined) {
                    const reconstructionIndelScale = new ContinuousScale("reconstruction_INDEL_" + this.sampleId, "INDEL Category Reconstruction", API.fetchScaleReconstructionSingleSample({
                        "projects": this.getConfig().selectedSamples,
                        "signatures": this.getConfig().selectedSignaturesIndel,
                        "mut_type": "INDEL",
                        "sample_id": this.sampleId
                    }));
                    this.setScale({key: "reconstruction_INDEL_" + this.sampleId, scale: reconstructionIndelScale});
                }

                // RECONSTRUCTION ERROR
                if(this.getData("error_INDEL_" + this.sampleId) === undefined) {
                    const errorIndelData = new DataContainer("error_INDEL_" + this.sampleId, "INDEL Reconstruction Error for " + this.sampleId, API.fetchPlotReconstructionErrorSingleSample({
                        "projects": this.getConfig().selectedSamples,
                        "signatures": this.getConfig().selectedSignaturesIndel,
                        "mut_type": "INDEL",
                        "sample_id": this.sampleId
                    }));
                    this.setData({key: "error_INDEL_" + this.sampleId, data: errorIndelData});
                }

                if(this.getScale("error_INDEL_" + this.sampleId) === undefined) {
                    const errorIndelScale = new ContinuousScale("error_INDEL_" + this.sampleId, "INDEL Error", API.fetchScaleReconstructionErrorSingleSample({
                        "projects": this.getConfig().selectedSamples,
                        "signatures": this.getConfig().selectedSignaturesIndel,
                        "mut_type": "INDEL",
                        "sample_id": this.sampleId
                    }));
                    this.setScale({key: "error_INDEL_" + this.sampleId, scale: errorIndelScale});
                }
            }


        },
        ...mapMutations([
            'setData',
            'setScale',
            'setSamples'
        ])
    },
    computed: {
        colWidth() {
            return this.windowWidth * this.widthProportion - 25;
        },
        showSbs() {
            return (this.getConfig().selectedSignaturesSbs.length > 0);
        },
        showDbs() {
            return (this.getConfig().selectedSignaturesDbs.length > 0);
        },
        showIndel() {
            return (this.getConfig().selectedSignaturesIndel.length > 0);
        },
        ...mapGetters([
            'windowHeight', 
            'windowWidth',
            'getConfig',
            'getStack',
            'getData',
            'getScale',
            'getSamples'
        ])
    }
}
</script>

<style scoped lang="scss">
@import './../style/variables.scss';
@import '~vue-declarative-plots/dist/vue-declarative-plots.css';

.sample-title {
    text-align: center;
}
.sample-cosine-similarity {
    width: 100%;
    text-align: center;
}

</style>
