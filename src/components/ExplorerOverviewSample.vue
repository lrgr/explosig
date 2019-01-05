<template>
    <div>
        <h3 class="sample-title">{{ sampleId }}</h3>
        <!-- Counts -->
        <PlotInfo title="Reconstruction of Mutation Profile" :showTitle="true">
            <p slot="info">
                This plot displays the mutation counts and the reconstruction using signatures with the error for each category.
            </p>
        </PlotInfo>
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
            sampleId: ""
        };
    },
    created() {
        this.sampleId = this.getSamples().activeSample;
        this.initScalesAndData();
    },
    methods: {
        initScalesAndData() {
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

</style>
