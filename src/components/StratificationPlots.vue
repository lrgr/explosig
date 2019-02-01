<template>
    <div>
        <div v-for="(choice, index) in stratificationOptions" :key="index">
            <PlotInfo 
                :title="('Stratification of ' + choice.variable + ' by ' + getData(choice.s).name)"
                :showTitle="true"
            >
                <p slot="info">
                    These plots display signature exposures stratified by other variables such as gene mutation classification or clinical variable status.
                </p>
            </PlotInfo>
            <ResizablePlotContainer v-if="!isContinuousClinicalVariable(choice.x)"
                :plotCode="('stratification_plot' + JSON.stringify(choice))"
                :pWidth="(colWidth-130-5)"
                :pHeight="300"
                :pMarginTop="10"
                :pMarginLeft="130"
                :pMarginRight="5"
                :pMarginBottom="130"
            >
                <PlotContainer 
                    slot="inner"    
                >
                    <Axis
                        slot="axisLeft"
                        :variable="choice.y"
                        side="left" 
                        :getScale="getScale"
                        :getStack="getStack"
                    />
                    <StratifiedSinaPlot
                        slot="plot"
                        :variable="choice.variable"
                        :data="choice.data"
                        :s="choice.s"
                        :x="choice.x"
                        :y="choice.y"
                        :o="choice.o"
                        :getData="getData"
                        :getScale="getScale"
                        strokeColor="gray"
                    />
                    <Axis
                        :variable="choice.x"
                        slot="axisBottom"
                        side="bottom" 
                        :tickRotation="-65"
                        :getScale="getScale"
                        :getStack="getStack"
                        :disableBrushing="true"
                    />
                </PlotContainer>
            </ResizablePlotContainer>
            <ResizablePlotContainer v-if="isContinuousClinicalVariable(choice.x)"
                :plotCode="('stratification_plot' + JSON.stringify(choice))"
                :pWidth="(colWidth-130-5)"
                :pHeight="300"
                :pMarginTop="10"
                :pMarginLeft="130"
                :pMarginRight="5"
                :pMarginBottom="130"
            >
                <PlotContainer 
                    slot="inner"
                >
                    <Axis
                        slot="axisLeft"
                        :variable="choice.y"
                        side="left" 
                        :getScale="getScale"
                        :getStack="getStack"
                    />
                    <StratifiedScatterPlot
                        slot="plot"
                        :variable="choice.variable"
                        :data="choice.data"
                        :s="choice.s"
                        :x="choice.x"
                        :y="choice.y"
                        :o="choice.o"
                        :getData="getData"
                        :getScale="getScale"
                        :fillPoints="true"
                        strokeColor="gray"
                    />
                    <Axis
                        :variable="choice.x"
                        slot="axisBottom"
                        side="bottom" 
                        :tickRotation="-65"
                        :getScale="getScale"
                        :getStack="getStack"
                        :disableBrushing="true"
                    />
                </PlotContainer>
            </ResizablePlotContainer>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import PlotInfo from './PlotInfo.vue';
import ResizablePlotContainer from './ResizablePlotContainer.vue';

import { IMUSE_COLUMNS } from '../vdp/Sizes';

export default {
    name: 'StratificationPlots',
    components: {
        PlotInfo,
        ResizablePlotContainer
    },
    computed: {
        colWidth() {
            return this.windowWidth * this.getSizes().columns[IMUSE_COLUMNS.OVERVIEW] - 25;
        },
        showStratified() {
            return (this.getStratification().choices.length > 0);
        },
        stratificationOptions() {
            return this.getStratification().choices;
        },
        ...mapGetters([
            'windowHeight', 
            'windowWidth',
            'continuousClinicalVariables',
            'getConfig',
            'getStack',
            'getData',
            'getScale',
            'getStratification',
            'getSizes'
        ])
    },
    methods: {
        isContinuousClinicalVariable(clinicalVar) {
            return this.continuousClinicalVariables.includes(clinicalVar);
        }
    }
}
</script>

<style scoped lang="scss">
@import './../style/variables.scss';

</style>
