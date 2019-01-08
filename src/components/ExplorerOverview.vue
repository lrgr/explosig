<template>
    <div>
        <StratificationPlots 
            :key="explorerOverviewKey"
            :widthProportion="widthProportion"
        />
        <!-- Counts -->
        <PlotInfo title="Number of Mutations by Mutation Type" :showTitle="true">
            <p slot="info">
                This plot displays the distribution of mutation counts, separated by mutation type.
            </p>
        </PlotInfo>
        <PlotContainer :key="('counts_overview_' + explorerOverviewKey)"
            :pWidth="(colWidth-130-10)"
            :pHeight="300"
            :pMarginTop="10"
            :pMarginLeft="130"
            :pMarginRight="10"
            :pMarginBottom="70"
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
        <!-- Exposures -->
        <PlotInfo title="Exposures by Signature" :showTitle="true">
            <p slot="info">
                This plot displays the distribution of mutation signature exposures, separated by signature.<br>
                For each mutation type, we also show a normalized version of the distribution.
            </p>
        </PlotInfo>
        <PlotContainer v-if="showSbs" :key="('sbs_overview_' + explorerOverviewKey)"
            :pWidth="(colWidth-130-10)"
            :pHeight="300"
            :pMarginTop="5"
            :pMarginLeft="130"
            :pMarginRight="10"
            :pMarginBottom="110"
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
        <PlotContainer v-if="showSbs && showNormalizedExposures" :key="('sbs_overview_norm_' + explorerOverviewKey)"
            :pWidth="(colWidth-130-10)"
            :pHeight="300"
            :pMarginTop="75"
            :pMarginLeft="130"
            :pMarginRight="10"
            :pMarginBottom="5"
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
        <PlotContainer v-if="showDbs" :key="('dbs_overview_' + explorerOverviewKey)"
            :pWidth="(colWidth-130-10)"
            :pHeight="300"
            :pMarginTop="5"
            :pMarginLeft="130"
            :pMarginRight="10"
            :pMarginBottom="110"
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
        <PlotContainer v-if="showDbs && showNormalizedExposures" :key="('dbs_overview_norm_' + explorerOverviewKey)"
            :pWidth="(colWidth-130-10)"
            :pHeight="300"
            :pMarginTop="75"
            :pMarginLeft="130"
            :pMarginRight="10"
            :pMarginBottom="5"
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
        <PlotContainer v-if="showIndel" :key="('indel_overview_' + explorerOverviewKey)"
            :pWidth="(colWidth-130-10)"
            :pHeight="300"
            :pMarginTop="5"
            :pMarginLeft="130"
            :pMarginRight="10"
            :pMarginBottom="110"
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
        <PlotContainer v-if="showIndel && showNormalizedExposures" :key="('indel_overview_norm_' + explorerOverviewKey)"
            :pWidth="(colWidth-130-10)"
            :pHeight="300"
            :pMarginTop="75"
            :pMarginLeft="130"
            :pMarginRight="10"
            :pMarginBottom="5"
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

        <VisibilityButtons style="margin: 20px 0px;"/>
 
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import PlotInfo from './PlotInfo.vue';
import StratificationPlots from './StratificationPlots.vue';
import VisibilityButtons from './VisibilityButtons.vue';

import { PLOT_GROUPS } from './../vdp/Visibility';

export default {
    name: 'ExplorerOverview',
    components: {
        PlotInfo,
        StratificationPlots,
        VisibilityButtons
    },
    props: {
        'widthProportion': {
            type: Number
        }
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
            'getStratification'
        ])
    }
}
</script>

<style scoped lang="scss">
@import './../style/variables.scss';
@import '~vue-declarative-plots/dist/vue-declarative-plots.css';


</style>
