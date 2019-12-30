<template>
    <div>
        <StratificationPlots 
            :key="explorerOverviewKey"
        />
        <!-- Counts -->
        <PlotInfo title="Number of Mutations by Mutation Type" :showTitle="true">
            <p slot="info">
                This plot displays the distribution of mutation counts, separated by mutation type.
            </p>
        </PlotInfo>
        <ResizablePlotContainer :key="('counts_overview_' + explorerOverviewKey)"
            plotCode="overview_counts"
            :pWidth="(colWidth-130-10)"
            :pHeight="300"
            :pMarginTop="10"
            :pMarginLeft="130"
            :pMarginRight="10"
            :pMarginBottom="70"
        >
            <PlotContainer 
                slot="inner"
                :showDownloadButton="true"
                :downloadButtonSize="12"
                :downloadButtonOffsetY="22"
                :downloadButtonOffsetX="20"
                :showResizeButton="true"
                :resizeButtonSize="12"
            >
                <Axis
                    slot="axisLeft"
                    variable="mut_count"
                    side="left" 
                    :getScale="getScale"
                    :getStack="getStack"
                />
                <MultiBoxPlot
                    slot="plot"
                    data="mut_count"
                    x="mut_type"
                    y="mut_count"
                    o="sample_id"
                    :getData="getData"
                    :getScale="getScale"
                    :drawOutliers="true"
                />
                <Axis
                    slot="axisBottom"
                    variable="mut_type"
                    side="bottom" 
                    :tickRotation="-65"
                    :getScale="getScale"
                    :getStack="getStack"
                    :disableBrushing="true"
                />
            </PlotContainer>
        </ResizablePlotContainer>
        <!-- Exposures -->
        <PlotInfo title="Exposures by Signature" :showTitle="true">
            <p slot="info">
                This plot displays the distribution of mutation signature exposures, separated by signature.<br>
                For each mutation type, we also show a normalized version of the distribution.
            </p>
        </PlotInfo>
        <ResizablePlotContainer v-if="showSbs" :key="('sbs_overview_' + explorerOverviewKey)"
            plotCode="overview_sbs"
            :pWidth="(colWidth-130-10)"
            :pHeight="300"
            :pMarginTop="5"
            :pMarginLeft="130"
            :pMarginRight="10"
            :pMarginBottom="110"
        >
            <PlotContainer
                slot="inner"
                :showDownloadButton="true"
                :downloadButtonSize="12"
                :downloadButtonOffsetY="22"
                :downloadButtonOffsetX="20"
                :showResizeButton="true"
                :resizeButtonSize="12"
            >
                <Axis
                    slot="axisLeft"
                    variable="exposure_sbs"
                    side="left" 
                    :getScale="getScale"
                    :getStack="getStack"
                />
                <MultiBoxPlot
                    slot="plot"
                    data="exposure_sbs"
                    x="sig_SBS"
                    y="exposure_sbs"
                    o="sample_id"
                    :getData="getData"
                    :getScale="getScale"
                    :drawOutliers="true"
                />
                <Axis
                    slot="axisBottom"
                    variable="sig_SBS"
                    side="bottom" 
                    :tickRotation="-65"
                    :getScale="getScale"
                    :getStack="getStack"
                    :disableBrushing="true"
                />
            </PlotContainer>
        </ResizablePlotContainer>
        <ResizablePlotContainer v-if="showSbs && showNormalizedExposures" :key="('sbs_overview_norm_' + explorerOverviewKey)"
            plotCode="overview_sbs_norm"
            :pWidth="(colWidth-130-10)"
            :pHeight="300"
            :pMarginTop="75"
            :pMarginLeft="130"
            :pMarginRight="10"
            :pMarginBottom="5"
        >
            <PlotContainer
                slot="inner"    
                :showDownloadButton="true"
                :downloadButtonSize="12"
                :downloadButtonOffsetY="22"
                :downloadButtonOffsetX="20"
                :showResizeButton="true"
                :resizeButtonSize="12"
            >
                <Axis
                    slot="axisTop"
                    variable="sig_SBS"
                    side="top" 
                    :tickRotation="-65"
                    :showLabel="false"
                    :getScale="getScale"
                    :getStack="getStack"
                    :disableBrushing="true"
                />
                <Axis
                    slot="axisLeft"
                    variable="exposure_sbs_normalized"
                    side="left" 
                    :getScale="getScale"
                    :getStack="getStack"
                />
                <MultiBoxPlot
                    slot="plot"
                    data="exposure_sbs_normalized"
                    x="sig_SBS"
                    y="exposure_sbs_normalized"
                    o="sample_id"
                    :getData="getData"
                    :getScale="getScale"
                    :drawOutliers="true"
                />
            </PlotContainer>
        </ResizablePlotContainer>
        <ResizablePlotContainer v-if="showDbs" :key="('dbs_overview_' + explorerOverviewKey)"
            plotCode="overview_dbs"
            :pWidth="(colWidth-130-10)"
            :pHeight="300"
            :pMarginTop="5"
            :pMarginLeft="130"
            :pMarginRight="10"
            :pMarginBottom="110"
        >
            <PlotContainer 
                slot="inner"
                :showDownloadButton="true"
                :downloadButtonSize="12"
                :downloadButtonOffsetY="22"
                :downloadButtonOffsetX="20"
                :showResizeButton="true"
                :resizeButtonSize="12"
            >
                <Axis
                    slot="axisLeft"
                    variable="exposure_dbs"
                    side="left" 
                    :getScale="getScale"
                    :getStack="getStack"
                />
                <MultiBoxPlot
                    slot="plot"
                    data="exposure_dbs"
                    x="sig_DBS"
                    y="exposure_dbs"
                    o="sample_id"
                    :getData="getData"
                    :getScale="getScale"
                    :drawOutliers="true"
                />
                <Axis
                    slot="axisBottom"
                    variable="sig_DBS"
                    side="bottom" 
                    :tickRotation="-65"
                    :getScale="getScale"
                    :getStack="getStack"
                    :disableBrushing="true"
                />
            </PlotContainer>
        </ResizablePlotContainer>
        <ResizablePlotContainer v-if="showDbs && showNormalizedExposures" :key="('dbs_overview_norm_' + explorerOverviewKey)"
            plotCode="overview_dbs_norm"
            :pWidth="(colWidth-130-10)"
            :pHeight="300"
            :pMarginTop="75"
            :pMarginLeft="130"
            :pMarginRight="10"
            :pMarginBottom="5"
        >
            <PlotContainer 
                slot="inner"
                :showDownloadButton="true"
                :downloadButtonSize="12"
                :downloadButtonOffsetY="22"
                :downloadButtonOffsetX="20"
                :showResizeButton="true"
                :resizeButtonSize="12"
            >
                <Axis
                    slot="axisTop"
                    variable="sig_DBS"
                    side="top" 
                    :tickRotation="-65"
                    :showLabel="false"
                    :getScale="getScale"
                    :getStack="getStack"
                    :disableBrushing="true"
                />
                <Axis
                    slot="axisLeft"
                    variable="exposure_dbs_normalized"
                    side="left" 
                    :getScale="getScale"
                    :getStack="getStack"
                />
                <MultiBoxPlot
                    slot="plot"
                    data="exposure_dbs_normalized"
                    x="sig_DBS"
                    y="exposure_dbs_normalized"
                    o="sample_id"
                    :getData="getData"
                    :getScale="getScale"
                    :drawOutliers="true"
                />
            </PlotContainer>
        </ResizablePlotContainer>
        <ResizablePlotContainer v-if="showIndel" :key="('indel_overview_' + explorerOverviewKey)"
            plotCode="overview_indel"
            :pWidth="(colWidth-130-10)"
            :pHeight="300"
            :pMarginTop="5"
            :pMarginLeft="130"
            :pMarginRight="10"
            :pMarginBottom="110"
        >
            <PlotContainer 
                slot="inner"
                :showDownloadButton="true"
                :downloadButtonSize="12"
                :downloadButtonOffsetY="22"
                :downloadButtonOffsetX="20"
                :showResizeButton="true"
                :resizeButtonSize="12"
            >
                <Axis
                    slot="axisLeft"
                    variable="exposure_indel"
                    side="left" 
                    :getScale="getScale"
                    :getStack="getStack"
                />
                <MultiBoxPlot
                    slot="plot"
                    data="exposure_indel"
                    x="sig_INDEL"
                    y="exposure_indel"
                    o="sample_id"
                    :getData="getData"
                    :getScale="getScale"
                    :drawOutliers="true"
                />
                <Axis
                    slot="axisBottom"
                    variable="sig_INDEL"
                    side="bottom" 
                    :tickRotation="-65"
                    :getScale="getScale"
                    :getStack="getStack"
                    :disableBrushing="true"
                />
            </PlotContainer>
        </ResizablePlotContainer>
        <ResizablePlotContainer v-if="showIndel && showNormalizedExposures" :key="('indel_overview_norm_' + explorerOverviewKey)"
            plotCode="overview_indel_norm"
            :pWidth="(colWidth-130-10)"
            :pHeight="300"
            :pMarginTop="75"
            :pMarginLeft="130"
            :pMarginRight="10"
            :pMarginBottom="5"
        >
            <PlotContainer 
                slot="inner"
                :showDownloadButton="true"
                :downloadButtonSize="12"
                :downloadButtonOffsetY="22"
                :downloadButtonOffsetX="20"
                :showResizeButton="true"
                :resizeButtonSize="12"
            >
                <Axis
                    slot="axisTop"
                    variable="sig_INDEL"
                    side="top" 
                    :tickRotation="-65"
                    :showLabel="false"
                    :getScale="getScale"
                    :getStack="getStack"
                    :disableBrushing="true"
                />
                <Axis
                    slot="axisLeft"
                    variable="exposure_indel_normalized"
                    side="left" 
                    :getScale="getScale"
                    :getStack="getStack"
                />
                <MultiBoxPlot
                    slot="plot"
                    data="exposure_indel_normalized"
                    x="sig_INDEL"
                    y="exposure_indel_normalized"
                    o="sample_id"
                    :getData="getData"
                    :getScale="getScale"
                    :drawOutliers="true"
                />
            </PlotContainer>
        </ResizablePlotContainer>

        <!-- Samples with Signatures -->
        <PlotInfo title="Samples with Signatures" :showTitle="true">
            <p slot="info">
                This plot displays the number of samples with greater than 1 mutation attributed to each signature.
            </p>
        </PlotInfo>
        <ResizablePlotContainer v-if="showSbs" :key="('sbs_sws_' + explorerOverviewKey)"
            plotCode="overview_sbs_sws"
            :pWidth="(colWidth-130-10)"
            :pHeight="300"
            :pMarginTop="5"
            :pMarginLeft="130"
            :pMarginRight="10"
            :pMarginBottom="110"
        >
            <PlotContainer
                slot="inner"
                :showDownloadButton="true"
                :downloadButtonSize="12"
                :downloadButtonOffsetY="22"
                :downloadButtonOffsetX="20"
                :showResizeButton="true"
                :resizeButtonSize="12"
            >
                <Axis
                    slot="axisLeft"
                    variable="num_samples"
                    side="left" 
                    :getScale="getScale"
                    :getStack="getStack"
                />
                <CountBarPlot
                    slot="plot"
                    data="exposure_sbs"
                    x="sig_SBS"
                    y="num_samples"
                    o="sample_id"
                    :filterFunction="(val) => (val > 1)"
                    :getData="getData"
                    :getScale="getScale"
                />
                <Axis
                    slot="axisBottom"
                    variable="sig_SBS"
                    side="bottom" 
                    :tickRotation="-65"
                    :getScale="getScale"
                    :getStack="getStack"
                    :disableBrushing="true"
                />
            </PlotContainer>
        </ResizablePlotContainer>
        <ResizablePlotContainer v-if="showDbs" :key="('dbs_sws_' + explorerOverviewKey)"
            plotCode="overview_dbs_sws"
            :pWidth="(colWidth-130-10)"
            :pHeight="300"
            :pMarginTop="5"
            :pMarginLeft="130"
            :pMarginRight="10"
            :pMarginBottom="110"
        >
            <PlotContainer
                slot="inner"
                :showDownloadButton="true"
                :downloadButtonSize="12"
                :downloadButtonOffsetY="22"
                :downloadButtonOffsetX="20"
                :showResizeButton="true"
                :resizeButtonSize="12"
            >
                <Axis
                    slot="axisLeft"
                    variable="num_samples"
                    side="left" 
                    :getScale="getScale"
                    :getStack="getStack"
                />
                <CountBarPlot
                    slot="plot"
                    data="exposure_dbs"
                    x="sig_DBS"
                    y="num_samples"
                    o="sample_id"
                    :filterFunction="(val) => (val > 1)"
                    :getData="getData"
                    :getScale="getScale"
                />
                <Axis
                    slot="axisBottom"
                    variable="sig_DBS"
                    side="bottom" 
                    :tickRotation="-65"
                    :getScale="getScale"
                    :getStack="getStack"
                    :disableBrushing="true"
                />
            </PlotContainer>
        </ResizablePlotContainer>
        <ResizablePlotContainer v-if="showIndel" :key="('indel_sws_' + explorerOverviewKey)"
            plotCode="overview_indel_sws"
            :pWidth="(colWidth-130-10)"
            :pHeight="300"
            :pMarginTop="5"
            :pMarginLeft="130"
            :pMarginRight="10"
            :pMarginBottom="110"
        >
            <PlotContainer
                slot="inner"
                :showDownloadButton="true"
                :downloadButtonSize="12"
                :downloadButtonOffsetY="22"
                :downloadButtonOffsetX="20"
                :showResizeButton="true"
                :resizeButtonSize="12"
            >
                <Axis
                    slot="axisLeft"
                    variable="num_samples"
                    side="left" 
                    :getScale="getScale"
                    :getStack="getStack"
                />
                <CountBarPlot
                    slot="plot"
                    data="exposure_indel"
                    x="sig_INDEL"
                    y="num_samples"
                    o="sample_id"
                    :filterFunction="(val) => (val > 1)"
                    :getData="getData"
                    :getScale="getScale"
                />
                <Axis
                    slot="axisBottom"
                    variable="sig_INDEL"
                    side="bottom" 
                    :tickRotation="-65"
                    :getScale="getScale"
                    :getStack="getStack"
                    :disableBrushing="true"
                />
            </PlotContainer>
        </ResizablePlotContainer>

        <!-- Survival by Dominant Signature -->
        <PlotInfo title="Survival by Dominant Signature" :showTitle="true">
            <p slot="info">
                This plot displays patient survival stratified by dominant signature for each signature type.<br>
                For each sample, the dominant signature is the signature with the maximum exposure.
            </p>
        </PlotInfo>
        <ResizablePlotContainer v-if="showSbs" :key="('sbs_dominant_' + explorerOverviewKey)"
            plotCode="overview_sbs_dominant"
            :pWidth="(colWidth-130-10)"
            :pHeight="300"
            :pMarginTop="5"
            :pMarginLeft="130"
            :pMarginRight="10"
            :pMarginBottom="110"
        >
            <PlotContainer
                slot="inner"
                :showDownloadButton="true"
                :downloadButtonSize="12"
                :downloadButtonOffsetY="22"
                :downloadButtonOffsetX="20"
                :showResizeButton="true"
                :resizeButtonSize="12"
            >
                <Axis
                    slot="axisLeft"
                    variable="survival_pct"
                    side="left" 
                    :getScale="getScale"
                    :getStack="getStack"
                />
                <StratifiedKaplanMeierPlot
                    slot="plot"
                    data="survival"
                    s="dominant_sig_sbs"
                    variable="sig_SBS"
                    c="sig_SBS"
                    x="survival_time"
                    y="survival_pct"
                    o="sample_id"
                    :getData="getData"
                    :getScale="getScale"
                />
                <Axis
                    slot="axisBottom"
                    variable="survival_time"
                    side="bottom" 
                    :tickRotation="-65"
                    :getScale="getScale"
                    :getStack="getStack"
                    :disableBrushing="false"
                />
            </PlotContainer>
        </ResizablePlotContainer>
        <ResizablePlotContainer v-if="showDbs" :key="('dbs_dominant_' + explorerOverviewKey)"
            plotCode="overview_dbs_dominant"
            :pWidth="(colWidth-130-10)"
            :pHeight="300"
            :pMarginTop="5"
            :pMarginLeft="130"
            :pMarginRight="10"
            :pMarginBottom="110"
        >
            <PlotContainer
                slot="inner"
                :showDownloadButton="true"
                :downloadButtonSize="12"
                :downloadButtonOffsetY="22"
                :downloadButtonOffsetX="20"
                :showResizeButton="true"
                :resizeButtonSize="12"
            >
                <Axis
                    slot="axisLeft"
                    variable="survival_pct"
                    side="left" 
                    :getScale="getScale"
                    :getStack="getStack"
                />
                <StratifiedKaplanMeierPlot
                    slot="plot"
                    data="survival"
                    s="dominant_sig_dbs"
                    variable="sig_DBS"
                    c="sig_DBS"
                    x="survival_time"
                    y="survival_pct"
                    o="sample_id"
                    :getData="getData"
                    :getScale="getScale"
                />
                <Axis
                    slot="axisBottom"
                    variable="survival_time"
                    side="bottom" 
                    :tickRotation="-65"
                    :getScale="getScale"
                    :getStack="getStack"
                    :disableBrushing="false"
                />
            </PlotContainer>
        </ResizablePlotContainer>
        <ResizablePlotContainer v-if="showIndel" :key="('indel_dominant_' + explorerOverviewKey)"
            plotCode="overview_indel_dominant"
            :pWidth="(colWidth-130-10)"
            :pHeight="300"
            :pMarginTop="5"
            :pMarginLeft="130"
            :pMarginRight="10"
            :pMarginBottom="110"
        >
            <PlotContainer
                slot="inner"
                :showDownloadButton="true"
                :downloadButtonSize="12"
                :downloadButtonOffsetY="22"
                :downloadButtonOffsetX="20"
                :showResizeButton="true"
                :resizeButtonSize="12"
            >
                <Axis
                    slot="axisLeft"
                    variable="survival_pct"
                    side="left" 
                    :getScale="getScale"
                    :getStack="getStack"
                />
                <StratifiedKaplanMeierPlot
                    slot="plot"
                    data="survival"
                    s="dominant_sig_indel"
                    variable="sig_INDEL"
                    c="sig_INDEL"
                    x="survival_time"
                    y="survival_pct"
                    o="sample_id"
                    :getData="getData"
                    :getScale="getScale"
                />
                <Axis
                    slot="axisBottom"
                    variable="survival_time"
                    side="bottom" 
                    :tickRotation="-65"
                    :getScale="getScale"
                    :getStack="getStack"
                    :disableBrushing="false"
                />
            </PlotContainer>
        </ResizablePlotContainer>

        <div class="overview-footer"></div>
 
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import PlotInfo from './PlotInfo.vue';
import StratificationPlots from './StratificationPlots.vue';
import VisibilityButtons from './VisibilityButtons.vue';
import ResizablePlotContainer from './ResizablePlotContainer.vue';

import { PLOT_GROUPS } from './../vdp/Visibility.js';
import { EXPLORER_COLUMNS } from '../vdp/Sizes.js';

export default {
    name: 'ExplorerOverview',
    components: {
        PlotInfo,
        StratificationPlots,
        VisibilityButtons,
        ResizablePlotContainer
    },
    data() {
        return {
            explorerOverviewKey: 1
        };
    },
    mounted() {
        this.getStratification().onUpdate(this.name, this.rerender);
    },
    methods: {
        rerender() {
            this.explorerOverviewKey++;
        }
    },
    watch: {
        showNormalizedExposures() {
            this.explorerOverviewKey++;
        }
    },
    computed: {
        colWidth() {
            return this.windowWidth * this.getSizes().columns[EXPLORER_COLUMNS.OVERVIEW] - 25;
        },
        showSbs() {
            return (this.isEmptySession || this.getConfig().selectedSignaturesSbs.length > 0);
        },
        showDbs() {
            return (this.isEmptySession || this.getConfig().selectedSignaturesDbs.length > 0);
        },
        showIndel() {
            return (this.isEmptySession || this.getConfig().selectedSignaturesIndel.length > 0);
        },
        showStratified() {
            return (this.getStratification().choices.length > 0);
        },
        showNormalizedExposures() {
            return (!this.getVisibility().hiddenPlots.includes(PLOT_GROUPS.NORMALIZED_EXPOSURES));
        },
        ...mapGetters([
            'windowHeight', 
            'windowWidth',
            'getConfig',
            'getStack',
            'getData',
            'getScale',
            'getVisibility',
            'getStratification',
            'getSizes',
            'isEmptySession'
        ])
    }
}
</script>

<style scoped lang="scss">
@import './../style/variables.scss';

.overview-footer {
    margin-bottom: 2rem;
}
</style>
