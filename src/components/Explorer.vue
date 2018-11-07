<template>
    <div>
        <div class="explorer-control" :style="{ 'height': 26 + 'px' }"> 
            <HistoryButtons />
        </div> 
        <div class="explorer" :style="{ 'height': (windowHeight-75) + 'px' }">
            <div class="explorer-main explorer-col">
                <div class="explorer-col-title">
                    <h3>Main</h3>
                    <div class="explorer-plot-container">
                        <Axis 
                            variable="exposure_sbs"
                            side="left"
                            :pWidth="(widthMain-150-5)"
                            :pHeight="300"
                            :pMarginTop="5"
                            :pMarginLeft="150"
                            :pMarginRight="5"
                            :pMarginBottom="150"
                            :getScale="getScale"
                            :getStack="getStack"
                        />
                        <StackedBarPlot 
                            data="exposure_sbs"
                            x="sample_id"
                            y="exposure_sbs"
                            c="sig_sbs"
                            :pWidth="(widthMain-150-10)"
                            :pHeight="300"
                            :pMarginTop="5"
                            :pMarginLeft="150"
                            :pMarginRight="5"
                            :pMarginBottom="150"
                            :getData="getData"
                            :getScale="getScale"
                            :getStack="getStack"
                        />
                        <Axis 
                            variable="sample_id"
                            side="bottom"
                            :tickRotation="-65"
                            :pWidth="(widthMain-150-5)"
                            :pHeight="300"
                            :pMarginTop="5"
                            :pMarginLeft="150"
                            :pMarginRight="5"
                            :pMarginBottom="150"
                            :getScale="getScale"
                            :getStack="getStack"
                        />
                    </div>
                </div>
            </div>
            <div class="explorer-overview explorer-col">
                <div class="explorer-col-title">
                    <h3>Overview</h3>
                </div>
            </div>
            <div class="explorer-legend explorer-col">
                <div class="explorer-col-title">
                    <h3>Legend</h3>
                </div>
                <CategoricalLegend
                    variable="project"
                    lStyle="bar"
                    :lWidth="widthLegend"
                    :getScale="getScale"
                    :getStack="getStack"
                />
                <CategoricalLegend
                    variable="sig_sbs"
                    lStyle="bar"
                    :lWidth="widthLegend"
                    :getScale="getScale"
                    :getStack="getStack"
                />
                <CategoricalLegend
                    variable="sig_dbs"
                    lStyle="bar"
                    :lWidth="widthLegend"
                    :getScale="getScale"
                    :getStack="getStack"
                />
                <CategoricalLegend
                    variable="sig_indel"
                    lStyle="bar"
                    :lWidth="widthLegend"
                    :getScale="getScale"
                    :getStack="getStack"
                />
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import { HistoryStack, EVENT_TYPES, EVENT_SUBTYPES, EVENT_SUBTYPE_RESETS } from 'vue-declarative-plots';
import { CategoricalScale, ContinuousScale, GenomeScale, DataContainer } from 'vue-declarative-plots';

import HistoryButtons from './HistoryButtons.vue';

import API from './../api.js';

export default {
    name: 'Explorer',
    components: {
        HistoryButtons,
    },
    computed: {
        widthMain() {
            return this.windowWidth * (5/10) - 25;
        },
        widthOverview() {
            return this.windowWidth * (3/10) - 25;
        },
        widthLegend() {
            return this.windowWidth * (2/10) - 25;
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
            const projectsScale = new CategoricalScale("project", "Project", this.getConfig().selectedSamples);
            this.setScale({key: "project", scale: projectsScale});

            const sigsSbsScale = new CategoricalScale("sig_sbs", "SBS Signature", this.getConfig().selectedSignaturesSbs);
            this.setScale({key: "sig_sbs", scale: sigsSbsScale});

            const sigsDbsScale = new CategoricalScale("sig_dbs", "DBS Signature", this.getConfig().selectedSignaturesDbs);
            this.setScale({key: "sig_dbs", scale: sigsDbsScale});

            const sigsIndelScale = new CategoricalScale("sig_indel", "INDEL Signature", this.getConfig().selectedSignaturesIndel);
            this.setScale({key: "sig_indel", scale: sigsIndelScale});

            const samplesScale = new CategoricalScale("sample_id", "Sample", API.fetchSamples({"projects": this.getConfig().selectedSamples}));
            this.setScale({key: "sample_id", scale: samplesScale});

            const exposureSbsScale = new ContinuousScale("exposure_sbs", "SBS Exposure", API.fetchScaleExposures({
                "projects": this.getConfig().selectedSamples,
                "signatures": this.getConfig().selectedSignaturesSbs,
                "mut_type": "SBS"
            }));
            this.setScale({key: "exposure_sbs", scale: exposureSbsScale});

            const exposureSbsData = new DataContainer("exposure_sbs", "SBS Exposure", API.fetchDataExposures({
                "projects": this.getConfig().selectedSamples,
                "signatures": this.getConfig().selectedSignaturesSbs,
                "mut_type": "SBS"
            }));
            this.setData({key: "exposure_sbs", data: exposureSbsData});
        },
        ...mapMutations([
            'setStack',
            'setData',
            'setScale'
        ])
    }
}
</script>

<style scoped lang="scss">
@import './../style/variables.scss';
@import '~vue-declarative-plots/dist/vue-declarative-plots.css';

.explorer {
    display: flex;
    flex-direction: row;
    .explorer-col {
        overflow-y: scroll;
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
    background-color: #FAFAFA;
    &>div {
        margin-left: 5px;
    }
}

.explorer-plot-container {
    position: relative;
}
</style>
