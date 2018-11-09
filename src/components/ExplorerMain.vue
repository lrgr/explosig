<template>
    <div>
        <!-- Counts -->
        <PlotContainer
            :pWidth="(colWidth-150-5)"
            :pHeight="200"
            :pMarginTop="5"
            :pMarginLeft="150"
            :pMarginRight="5"
            :pMarginBottom="150"
        >
            <Axis 
                slot="axisLeft"
                variable="mut_count_sum"
                side="left"
                
                :getScale="getScale"
                :getStack="getStack"
            />
            <StackedBarPlot 
                slot="plot"
                data="mut_count"
                x="sample_id"
                y="mut_count_sum"
                c="mut_type"
                :getData="getData"
                :getScale="getScale"
            />
            <Axis 
                slot="axisBottom"
                variable="sample_id"
                side="bottom"
                :tickRotation="-65"
                :getScale="getScale"
                :getStack="getStack"
            />
        </PlotContainer>

        <!-- Exposures -->
        <PlotContainer v-if="showSbs"
            :pWidth="(colWidth-150-5)"
            :pHeight="200"
            :pMarginTop="5"
            :pMarginLeft="150"
            :pMarginRight="5"
            :pMarginBottom="5"
        >
            <Axis 
                slot="axisLeft"
                variable="exposure_sum_sbs"
                side="left"
                
                :getScale="getScale"
                :getStack="getStack"
            />
            <StackedBarPlot 
                slot="plot"
                data="exposure_sbs"
                x="sample_id"
                y="exposure_sum_sbs"
                c="sig_sbs"
                :getData="getData"
                :getScale="getScale"
            />
        </PlotContainer>
        <PlotContainer v-if="showSbs"
            :pWidth="(colWidth-150-5)"
            :pHeight="200"
            :pMarginTop="5"
            :pMarginLeft="150"
            :pMarginRight="5"
            :pMarginBottom="5"
        >
            <Axis 
                slot="axisLeft"
                variable="exposure_sum_sbs_normalized"
                side="left"
                
                :getScale="getScale"
                :getStack="getStack"
            />
            <StackedBarPlot 
                slot="plot"
                data="exposure_sbs_normalized"
                x="sample_id"
                y="exposure_sum_sbs_normalized"
                c="sig_sbs"
                :getData="getData"
                :getScale="getScale"
            />
        </PlotContainer>
        <PlotContainer v-if="showDbs"
            :pWidth="(colWidth-150-5)"
            :pHeight="200"
            :pMarginTop="5"
            :pMarginLeft="150"
            :pMarginRight="5"
            :pMarginBottom="5"
        >
            <Axis 
                slot="axisLeft"
                variable="exposure_sum_dbs"
                side="left"
                :getScale="getScale"
                :getStack="getStack"
            />
            <StackedBarPlot 
                slot="plot"
                data="exposure_dbs"
                x="sample_id"
                y="exposure_sum_dbs"
                c="sig_dbs"
                :getData="getData"
                :getScale="getScale"
            />
        </PlotContainer>
        <PlotContainer v-if="showDbs"
            :pWidth="(colWidth-150-5)"
            :pHeight="200"
            :pMarginTop="5"
            :pMarginLeft="150"
            :pMarginRight="5"
            :pMarginBottom="5"
        >
            <Axis 
                slot="axisLeft"
                variable="exposure_sum_dbs_normalized"
                side="left"
                :getScale="getScale"
                :getStack="getStack"
            />
            <StackedBarPlot 
                slot="plot"
                data="exposure_dbs_normalized"
                x="sample_id"
                y="exposure_sum_dbs_normalized"
                c="sig_dbs"
                :getData="getData"
                :getScale="getScale"
            />
        </PlotContainer>
        <PlotContainer v-if="showIndel"
            :pWidth="(colWidth-150-5)"
            :pHeight="200"
            :pMarginTop="5"
            :pMarginLeft="150"
            :pMarginRight="5"
            :pMarginBottom="5"
        >
            <Axis 
                slot="axisLeft"
                variable="exposure_sum_indel"
                side="left"
                :getScale="getScale"
                :getStack="getStack"
            />
            <StackedBarPlot 
                slot="plot"
                data="exposure_indel"
                x="sample_id"
                y="exposure_sum_indel"
                c="sig_indel"
                :getData="getData"
                :getScale="getScale"
            />
        </PlotContainer>
         <PlotContainer v-if="showIndel"
            :pWidth="(colWidth-150-5)"
            :pHeight="200"
            :pMarginTop="5"
            :pMarginLeft="150"
            :pMarginRight="5"
            :pMarginBottom="5"
        >
            <Axis 
                slot="axisLeft"
                variable="exposure_sum_indel_normalized"
                side="left"
                :getScale="getScale"
                :getStack="getStack"
            />
            <StackedBarPlot 
                slot="plot"
                data="exposure_indel_normalized"
                x="sample_id"
                y="exposure_sum_indel_normalized"
                c="sig_indel"
                :getData="getData"
                :getScale="getScale"
            />
        </PlotContainer>
        <PlotContainer
            :pWidth="(colWidth-150-5)"
            :pHeight="0"
            :pMarginTop="0"
            :pMarginLeft="150"
            :pMarginRight="5"
            :pMarginBottom="150"
        >
            <Axis 
                slot="axisBottom"
                variable="sample_id"
                side="bottom"
                :tickRotation="-65"
                :getScale="getScale"
                :getStack="getStack"
            />
        </PlotContainer>

    
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    name: 'ExplorerMain',
    props: {
        'widthProportion': {
            type: Number
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
