<template>
    <div>
        <!-- Counts -->
        <PlotInfo title="Reconstruction of Mutation Profile">
            <p slot="info">
                This plot displays the mutation counts and the reconstruction using signatures with the error for each category.
            </p>
        </PlotInfo>
        <PlotContainer
            :pWidth="(colWidth-150-5)"
            :pHeight="200"
            :pMarginTop="10"
            :pMarginLeft="150"
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

            const countsSbsData = new DataContainer("count_SBS_" + this.sampleId, "SBS Mutation Counts for " + this.sampleId, API.fetchPlotCountsNormalizedPerCategorySingleSample({
                "projects": this.getConfig().selectedSamples,
                "signatures": this.getConfig().selectedSignaturesSbs,
                "mut_type": "SBS",
                "sample_id": this.sampleId
            }));
            this.setData({key: "count_SBS_" + this.sampleId, data: countsSbsData});

            const countsSbsNormalizedScale = new ContinuousScale("count_SBS_" + this.sampleId, "SBS Normalized Count", [0, 0.5]);
            this.setScale({key: "count_SBS_" + this.sampleId, scale: countsSbsNormalizedScale});

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


</style>
