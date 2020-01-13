<template>
    <div>
        <PlotInfo title="Clinical Variables" :style="{'margin-top': '15px'}">
            <p slot="info">
                This plot shows clinical variables for each sample.
            </p>
        </PlotInfo>
        <PlotContainer
            :pWidth="(colWidth-150-5)"
            :pHeight="(numClinicalVariables * 25)"
            :pMarginTop="0"
            :pMarginLeft="150"
            :pMarginRight="0"
            :pMarginBottom="0"

            :showDownloadButton="true"
            :downloadButtonSize="12"
            :downloadButtonOffsetY="22"
            :downloadButtonOffsetX="20"
            :showResizeButton="true"
            :resizeButtonSize="12"
            downloadName="explosig_multisample_clinical_data"
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
            <MultiDataTrackPlot 
                slot="plot"
                x="sample_id"
                :dataArray="selectedClinicalData"
                :cArray="selectedClinicalVariables"
                :getData="getData"
                :getScale="getScale"
                :clickHandler="sampleClickHandler"
            />
        </PlotContainer>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import PlotInfo from './PlotInfo.vue';

import { EXPLORER_COLUMNS } from './../vdp/Sizes.js';

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
    data() {
        return {
            selectedClinicalVariables: []
        }
    },
    mounted() {
        const cvScale = this.getScale("clinical_variable");
        this.selectedClinicalVariables = cvScale.domain;
        cvScale.onUpdate("clinical_tracks", () => {
            this.selectedClinicalVariables = cvScale.domain;
        });
    },
    computed: {
        colWidth() {
            return this.windowWidth * this.getSizes().columns[EXPLORER_COLUMNS.MAIN] - 25;
        },
        numClinicalVariables() {
            return this.selectedClinicalVariables.length;
        },
        selectedClinicalData() {
            return Array.from(new Array(this.selectedClinicalVariables.length), () => "clinical_data");
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

</style>
