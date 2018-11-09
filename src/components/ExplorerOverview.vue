<template>
    <div>
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
                :disableBrushing="true"
            />
        </PlotContainer>
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
                :disableBrushing="true"
            />
        </PlotContainer>
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
                :disableBrushing="true"
            />
        </PlotContainer>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    name: 'ExplorerOverview',
    props: {
        'widthProportion': {
            type: Number
        }
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
            'getScale'
        ])
    }
}
</script>

<style scoped lang="scss">
@import './../style/variables.scss';
@import '~vue-declarative-plots/dist/vue-declarative-plots.css';


</style>
