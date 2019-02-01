<template>
    <div>
        <PlotInfo title="Clinical Variables" :style="{'margin-top': '15px'}">
            <p slot="info">
                This plot shows clinical variables for each sample.
            </p>
        </PlotInfo>
        <div class="clinical-tracks-wrapper">
            <div class="clinical-axis-wrapper">
                <PlotContainer
                    :pWidth="0"
                    :pHeight="(numClinicalVariables * 25)"
                    :pMarginTop="0"
                    :pMarginLeft="150"
                    :pMarginRight="0"
                    :pMarginBottom="20"
                >
                    <Axis
                        slot="axisLeft"
                        side="left"
                        :tickRotation="0"
                        variable="clinical_variable"
                        :getScale="getScale"
                        :getStack="getStack"
                        :disableBrushing="true"
                    />
                </PlotContainer>
            </div>
            <div v-for="clinicalVar in selectedClinicalVariables" :key="clinicalVar">
                <PlotContainer
                    :pWidth="(colWidth-150-5)"
                    :pHeight="20"
                    :pMarginTop="0"
                    :pMarginLeft="150"
                    :pMarginRight="5"
                    :pMarginBottom="5"
                >
                    <TrackPlot 
                        slot="plot"
                        data="clinical_data"
                        x="sample_id"
                        :c="clinicalVar"
                        :getData="getData"
                        :getScale="getScale"
                        :clickHandler="sampleClickHandler"
                    />
                </PlotContainer>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import PlotInfo from './PlotInfo.vue';

import { IMUSE_COLUMNS } from './../vdp/Sizes.js';

export default {
    name: 'ClinicalTracks',
    components: {
        PlotInfo,
    },
    props: {
        'sampleClickHandler': {
            type: Function
        }
    },
    computed: {
        colWidth() {
            return this.windowWidth * this.getSizes().columns[IMUSE_COLUMNS.MAIN] - 25;
        },
        numClinicalVariables() {
            return (this.getConfig().selectedClinicalVariables.length);
        },
        selectedClinicalVariables() {
            return (this.getConfig().selectedClinicalVariables);
        },
        ...mapGetters([
            'windowHeight', 
            'windowWidth',
            'getConfig',
            'getStack',
            'getData',
            'getScale',
            'getSizes'
        ])
    }
}
</script>

<style scoped lang="scss">
@import './../style/variables.scss';

.clinical-tracks-wrapper {
    position: relative;
}

.clinical-axis-wrapper {
    position: absolute;
    margin-top: -2.5px;
}
</style>
