<template>
    <div>
        <!-- Gene Mutation -->
        <PlotInfo title="Gene Mutation" :style="{'margin-top': '15px'}">
            <p slot="info">
                This plot shows a mutation classification for each selected gene and sample.
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
                        variable="gene_mut"
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
                        :data="('gene_mut_' + geneId)"
                        x="sample_id"
                        c="mut_class"
                        :getData="getData"
                        :getScale="getScale"
                        :clickHandler="sampleClickHandler"
                    />
                </PlotContainer>
            </div>
        </div>
        <!-- Gene Expression -->
        <PlotInfo title="Gene Expression" :style="{'margin-top': '15px'}">
            <p slot="info">
                This plot shows gene expression values for each selected gene and sample.
                RNA Seq v2 mRNA median Z-score values have been processed such that over-expression corresponds to &ge; 2 and under-expression corresponds to &le; -2.
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
                        variable="gene_exp"
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
                        :data="('gene_exp_' + geneId)"
                        x="sample_id"
                        c="gene_expression"
                        :getData="getData"
                        :getScale="getScale"
                        :clickHandler="sampleClickHandler"
                    />
                </PlotContainer>
            </div>
        </div>
        <!-- Gene CNA -->
        <PlotInfo title="Gene Copy Number Alteration" :style="{'margin-top': '15px'}">
            <p slot="info">
                This plot shows CNA values for each selected gene and sample.
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
                        variable="gene_cna"
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
                        :data="('gene_cna_' + geneId)"
                        x="sample_id"
                        c="copy_number"
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
    data() {
        return {
            selectedGenes: []
        }
    },
    mounted() {
        const gScale = this.getScale("gene_mut");
        this.selectedGenes = gScale.domain;
        gScale.onUpdate("gene_tracks", () => {
            this.selectedGenes = gScale.domain;
            console.log("hi");
        });
    },
    computed: {
        colWidth() {
            return this.windowWidth * this.getSizes().columns[EXPLORER_COLUMNS.MAIN] - 25;
        },
        numGenes() {
            return (this.selectedGenes.length);
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
