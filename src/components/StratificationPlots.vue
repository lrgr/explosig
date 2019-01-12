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
            <PlotContainer
                :pWidth="(colWidth-130-5)"
                :pHeight="300"
                :pMarginTop="10"
                :pMarginLeft="130"
                :pMarginRight="5"
                :pMarginBottom="130"
                >
                <Axis
                    slot="axisLeft"
                    :variable="choice.y"
                    side="left" 
                    :getScale="getScale"
                    :getStack="getStack"
                />
                <StratifiedBoxPlot
                    slot="plot"
                    :variable="choice.variable"
                    :data="choice.data"
                    :s="choice.s"
                    :x="choice.x"
                    :y="choice.y"
                    :o="choice.o"
                    :getData="getData"
                    :getScale="getScale"
                    :drawOutliers="true"
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
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import PlotInfo from './PlotInfo.vue';

export default {
    name: 'StratificationPlots',
    components: {
        PlotInfo,
    },
    props: {
        'widthProportion': {
            type: Number
        }
    },
    computed: {
        colWidth() {
            return this.windowWidth * this.widthProportion - 25;
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

</style>
