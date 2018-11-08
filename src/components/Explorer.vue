<template>
    <div>
        <div class="explorer-control" :style="{ 'height': 26 + 'px' }"> 
            <HistoryButtons />
        </div> 
        <div class="explorer" :style="{ 'height': (windowHeight-75) + 'px' }">
            <div class="explorer-main explorer-col">
                <div class="explorer-col-title">
                    <h3>Main</h3>
                </div>
                <div class="explorer-plot-container">
                    <div :style="{ 'height': (5+200+5) + 'px' }">
                        <Axis 
                            variable="exposure_sbs"
                            side="left"
                            :pWidth="(widthMain-150-5)"
                            :pHeight="200"
                            :pMarginTop="5"
                            :pMarginLeft="150"
                            :pMarginRight="5"
                            :pMarginBottom="5"
                            :getScale="getScale"
                            :getStack="getStack"
                        />
                        <StackedBarPlot 
                            data="exposure_sbs"
                            x="sample_id"
                            y="exposure_sbs"
                            c="sig_sbs"
                            :pWidth="(widthMain-150-10)"
                            :pHeight="200"
                            :pMarginTop="5"
                            :pMarginLeft="150"
                            :pMarginRight="5"
                            :pMarginBottom="150"
                            :getData="getData"
                            :getScale="getScale"
                            :getStack="getStack"
                        />
                    </div>
                    <div :style="{ 'height': (5+200+5) + 'px' }">
                        <Axis 
                            variable="exposure_dbs"
                            side="left"
                            :pWidth="(widthMain-150-5)"
                            :pHeight="200"
                            :pMarginTop="5"
                            :pMarginLeft="150"
                            :pMarginRight="5"
                            :pMarginBottom="5"
                            :getScale="getScale"
                            :getStack="getStack"
                        />
                        <StackedBarPlot 
                            data="exposure_dbs"
                            x="sample_id"
                            y="exposure_dbs"
                            c="sig_dbs"
                            :pWidth="(widthMain-150-10)"
                            :pHeight="200"
                            :pMarginTop="5"
                            :pMarginLeft="150"
                            :pMarginRight="5"
                            :pMarginBottom="150"
                            :getData="getData"
                            :getScale="getScale"
                            :getStack="getStack"
                        />
                    </div>
                    <div :style="{ 'height': (5+200+5) + 'px' }">
                        <Axis 
                            variable="exposure_indel"
                            side="left"
                            :pWidth="(widthMain-150-5)"
                            :pHeight="200"
                            :pMarginTop="5"
                            :pMarginLeft="150"
                            :pMarginRight="5"
                            :pMarginBottom="5"
                            :getScale="getScale"
                            :getStack="getStack"
                        />
                        <StackedBarPlot 
                            data="exposure_indel"
                            x="sample_id"
                            y="exposure_indel"
                            c="sig_indel"
                            :pWidth="(widthMain-150-10)"
                            :pHeight="200"
                            :pMarginTop="5"
                            :pMarginLeft="150"
                            :pMarginRight="5"
                            :pMarginBottom="150"
                            :getData="getData"
                            :getScale="getScale"
                            :getStack="getStack"
                        />
                    </div>
                    <div :style="{ 'height': (150) + 'px' }">
                        <Axis 
                            variable="sample_id"
                            side="bottom"
                            :tickRotation="-65"
                            :pWidth="(widthMain-150-5)"
                            :pHeight="0"
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
                <div class="explorer-plot-container">
                    <PlotContainer
                        :pWidth="(widthOverview-130-5)"
                        :pHeight="300"
                        :pMarginTop="10"
                        :pMarginLeft="130"
                        :pMarginRight="5"
                        :pMarginBottom="180"
                        >
                        <Axis
                            slot="axisLeft"
                            variable="exposure_sbs"
                            side="left" 
                            :tickRotation="-35"
                            :getScale="getScale"
                            :getStack="getStack"
                        />
                        <MultiBoxPlot
                            slot="plot"
                            data="exposure_sbs"
                            x="sig_sbs"
                            y="exposure_sbs"
                            o="sample_id"
                            :getData="getData"
                            :getScale="getScale"
                            :drawOutliers="true"
                        />
                        <Axis
                            slot="axisBottom"
                            variable="sig_sbs"
                            side="bottom" 
                            :tickRotation="-65"
                            :getScale="getScale"
                            :getStack="getStack"
                        />
                    </PlotContainer>
                </div>
                <div class="explorer-plot-container">
                    <PlotContainer
                        :pWidth="(widthOverview-130-5)"
                        :pHeight="300"
                        :pMarginTop="10"
                        :pMarginLeft="130"
                        :pMarginRight="5"
                        :pMarginBottom="180"
                        >
                        <Axis
                            slot="axisLeft"
                            variable="exposure_dbs"
                            side="left" 
                            :tickRotation="-35"
                            :getScale="getScale"
                            :getStack="getStack"
                        />
                        <MultiBoxPlot
                            slot="plot"
                            data="exposure_dbs"
                            x="sig_dbs"
                            y="exposure_dbs"
                            o="sample_id"
                            :getData="getData"
                            :getScale="getScale"
                            :drawOutliers="true"
                        />
                        <Axis
                            slot="axisBottom"
                            variable="sig_dbs"
                            side="bottom" 
                            :tickRotation="-65"
                            :getScale="getScale"
                            :getStack="getStack"
                        />
                    </PlotContainer>
                    <div class="explorer-plot-container">
                    <PlotContainer
                        :pWidth="(widthOverview-130-5)"
                        :pHeight="300"
                        :pMarginTop="10"
                        :pMarginLeft="130"
                        :pMarginRight="5"
                        :pMarginBottom="180"
                        >
                        <Axis
                            slot="axisLeft"
                            variable="exposure_indel"
                            side="left" 
                            :tickRotation="-35"
                            :getScale="getScale"
                            :getStack="getStack"
                        />
                        <MultiBoxPlot
                            slot="plot"
                            data="exposure_indel"
                            x="sig_indel"
                            y="exposure_indel"
                            o="sample_id"
                            :getData="getData"
                            :getScale="getScale"
                            :drawOutliers="true"
                        />
                        <Axis
                            slot="axisBottom"
                            variable="sig_indel"
                            side="bottom" 
                            :tickRotation="-65"
                            :getScale="getScale"
                            :getStack="getStack"
                        />
                    </PlotContainer>
                </div>
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

            const exposureDbsScale = new ContinuousScale("exposure_dbs", "DBS Exposure", API.fetchScaleExposures({
                "projects": this.getConfig().selectedSamples,
                "signatures": this.getConfig().selectedSignaturesDbs,
                "mut_type": "DBS"
            }));
            this.setScale({key: "exposure_dbs", scale: exposureDbsScale});

            const exposureDbsData = new DataContainer("exposure_dbs", "DBS Exposure", API.fetchDataExposures({
                "projects": this.getConfig().selectedSamples,
                "signatures": this.getConfig().selectedSignaturesDbs,
                "mut_type": "DBS"
            }));
            this.setData({key: "exposure_dbs", data: exposureDbsData});

            const exposureIndelScale = new ContinuousScale("exposure_indel", "INDEL Exposure", API.fetchScaleExposures({
                "projects": this.getConfig().selectedSamples,
                "signatures": this.getConfig().selectedSignaturesIndel,
                "mut_type": "INDEL"
            }));
            this.setScale({key: "exposure_indel", scale: exposureIndelScale});

            const exposureIndelData = new DataContainer("exposure_indel", "INDEL Exposure", API.fetchDataExposures({
                "projects": this.getConfig().selectedSamples,
                "signatures": this.getConfig().selectedSignaturesIndel,
                "mut_type": "INDEL"
            }));
            this.setData({key: "exposure_indel", data: exposureIndelData});
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
    &>div {
        position: relative;
    }
}
</style>
