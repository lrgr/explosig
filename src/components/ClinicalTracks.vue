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
                    :pHeight="(numClinicalVariables * 24.3)"
                    :pMarginTop="0"
                    :pMarginLeft="150"
                    :pMarginRight="0"
                    :pMarginBottom="10"
                >
                    <Axis
                        slot="axisLeft"
                        side="left"
                        :tickRotation="-25"
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
                        :data="('cv_' + clinicalVar)"
                        x="sample_id"
                        :c="('cv_' + clinicalVar)"
                        :getData="getData"
                        :getScale="getScale"
                    />
                </PlotContainer>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import PlotInfo from './PlotInfo.vue';

export default {
    name: 'ClinicalTracks',
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
            'getScale'
        ])
    }
}
</script>

<style scoped lang="scss">
@import './../style/variables.scss';
@import '~vue-declarative-plots/dist/vue-declarative-plots.css';

.clinical-tracks-wrapper {
    position: relative;
}

.clinical-axis-wrapper {
    position: absolute;
}
</style>
