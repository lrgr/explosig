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
                    :pHeight="(numGenes * 24.5)"
                    :pMarginTop="0"
                    :pMarginLeft="150"
                    :pMarginRight="0"
                    :pMarginBottom="10"
                >
                    <Axis
                        slot="axisLeft"
                        side="left"
                        :tickRotation="-25"
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

export default {
    name: 'GeneTracks',
    components: {
        PlotInfo,
    },
    props: {
        'widthProportion': {
            type: Number
        },
        'sampleClickHandler': {
            type: Function
        }
    },
    computed: {
        colWidth() {
            return this.windowWidth * this.widthProportion - 25;
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
            'getScale'
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
}
</style>
