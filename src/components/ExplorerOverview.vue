<template>
    <div>
        <div id="stratification-plots">
            <StratificationPlots 
                :key="stratificationKey"
                :widthProportion="widthProportion"
            />
        </div>
        <!-- Counts -->
        <PlotInfo title="Number of Mutations by Mutation Type">
            <p slot="info">
                This plot displays the distribution of mutation counts, separated by mutation type.
            </p>
        </PlotInfo>
        <PlotContainer
            :pWidth="(colWidth-130-5)"
            :pHeight="300"
            :pMarginTop="10"
            :pMarginLeft="130"
            :pMarginRight="5"
            :pMarginBottom="100"
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
        <PlotInfo title="Exposures by Signature">
            <p slot="info">
                This plot displays the distribution of mutation signature exposures, separated by signature.<br>
                For each mutation type, we also show a normalized version of the distribution.
            </p>
        </PlotInfo>
        <PlotContainer v-if="showSbs"
            :pWidth="(colWidth-130-5)"
            :pHeight="300"
            :pMarginTop="10"
            :pMarginLeft="130"
            :pMarginRight="5"
            :pMarginBottom="5"
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
                x="sig_sbs"
                y="exposure_sbs"
                o="sample_id"
                :getData="getData"
                :getScale="getScale"
                :drawOutliers="true"
            />
        </PlotContainer>
        <PlotContainer v-if="showSbs"
            :pWidth="(colWidth-130-5)"
            :pHeight="300"
            :pMarginTop="0"
            :pMarginLeft="130"
            :pMarginRight="5"
            :pMarginBottom="100"
            >
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
                x="sig_sbs"
                y="exposure_sbs_normalized"
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
                :disableBrushing="true"
            />
        </PlotContainer>
        <PlotContainer v-if="showDbs"
            :pWidth="(colWidth-130-5)"
            :pHeight="300"
            :pMarginTop="10"
            :pMarginLeft="130"
            :pMarginRight="5"
            :pMarginBottom="5"
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
                x="sig_dbs"
                y="exposure_dbs"
                o="sample_id"
                :getData="getData"
                :getScale="getScale"
                :drawOutliers="true"
            />
        </PlotContainer>
        <PlotContainer v-if="showDbs"
            :pWidth="(colWidth-130-5)"
            :pHeight="300"
            :pMarginTop="0"
            :pMarginLeft="130"
            :pMarginRight="5"
            :pMarginBottom="100"
            >
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
                x="sig_dbs"
                y="exposure_dbs_normalized"
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
                :disableBrushing="true"
            />
        </PlotContainer>
        <PlotContainer v-if="showIndel"
            :pWidth="(colWidth-130-5)"
            :pHeight="300"
            :pMarginTop="0"
            :pMarginLeft="130"
            :pMarginRight="5"
            :pMarginBottom="5"
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
                x="sig_indel"
                y="exposure_indel"
                o="sample_id"
                :getData="getData"
                :getScale="getScale"
                :drawOutliers="true"
            />
        </PlotContainer>
        <PlotContainer v-if="showIndel"
            :pWidth="(colWidth-130-5)"
            :pHeight="300"
            :pMarginTop="0"
            :pMarginLeft="130"
            :pMarginRight="5"
            :pMarginBottom="100"
            >
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
                x="sig_indel"
                y="exposure_indel_normalized"
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
                :disableBrushing="true"
            />
        </PlotContainer>

        
        
        
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import PlotInfo from './PlotInfo.vue';
import StratificationPlots from './StratificationPlots.vue';

export default {
    name: 'ExplorerOverview',
    components: {
        PlotInfo,
        StratificationPlots
    },
    props: {
        'widthProportion': {
            type: Number
        }
    },
    data() {
        return {
            stratificationKey: 1
        };
    },
    mounted() {
        this.getStratification().onUpdate(this.name, this.rerender);
    },
    methods: {
        rerender() {
            this.stratificationKey++;
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
        ...mapGetters([
            'windowHeight', 
            'windowWidth',
            'getConfig',
            'getStack',
            'getData',
            'getScale',
            'getStratification'
        ])
    }
}
</script>

<style scoped lang="scss">
@import './../style/variables.scss';
@import '~vue-declarative-plots/dist/vue-declarative-plots.css';


</style>
