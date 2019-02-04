<template>
    <div>
        <PlotInfo title="Gene Alterations" :style="{'margin-top': '15px'}">
            <p slot="info">
                This plot shows mutation classification for each selected gene for each sample.
            </p>
        </PlotInfo>
        <div class="gene-tracks-wrapper">
            <div class="gene-axis-wrapper">
                <PlotContainer
                    :pWidth="0"
                    :pHeight="(numGenes * 25)"
                    :pMarginTop="0"
                    :pMarginLeft="150"
                    :pMarginRight="0"
                    :pMarginBottom="0"
                >
                    <Axis
                        slot="axisLeft"
                        side="left"
                        :tickRotation="0"
                        variable="gene"
                        :getScale="getScale"
                        :getStack="getStack"
                        :disableBrushing="true"
                    />
                </PlotContainer>
            </div>
            <div v-for="geneId in selectedGenes" :key="geneId">
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
                        :data="('gene_' + geneId)"
                        x="sample_id"
                        c="mut_class"
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
import { EXPLORER_COLUMNS } from '../vdp/Sizes';

export default {
    name: 'GeneTracks',
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
            return this.windowWidth * this.getSizes().columns[EXPLORER_COLUMNS.MAIN] - 25;
        },
        numGenes() {
            return (this.getConfig().selectedGenes.length);
        },
        selectedGenes() {
            return (this.getConfig().selectedGenes);
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

.gene-tracks-wrapper {
    position: relative;
}

.gene-axis-wrapper {
    position: absolute;
    margin-top: -2.5px;
}
</style>
