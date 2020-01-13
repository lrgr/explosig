<template>
    <div>
        <!-- Gene Mutation -->
        <PlotInfo title="Gene Mutation" :style="{'margin-top': '15px'}">
            <p slot="info">
                This plot shows a mutation classification for each selected gene and sample.
            </p>
        </PlotInfo>
        <PlotContainer
            :pWidth="(colWidth-150-5)"
            :pHeight="(selectedGenesMut.length * 25)"
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
            downloadName="explosig_multisample_gene_mutation"
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
            <MultiDataTrackPlot 
                slot="plot"
                x="sample_id"
                :dataArray="selectedGenesMutData"
                :cArray="selectedGenesMutScales"
                :getData="getData"
                :getScale="getScale"
                :clickHandler="sampleClickHandler"
            />
        </PlotContainer>
        
        <!-- Gene Expression -->
        <PlotInfo title="Gene Expression" :style="{'margin-top': '15px'}">
            <p slot="info">
                This plot shows gene expression values for each selected gene and sample.
                RNA Seq v2 mRNA median Z-score values have been processed such that over-expression corresponds to &ge; 2 and under-expression corresponds to &le; -2.
            </p>
        </PlotInfo>
        <PlotContainer
            :pWidth="(colWidth-150-5)"
            :pHeight="(selectedGenesExp.length * 25)"
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
            downloadName="explosig_multisample_gene_expression"
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
            <MultiDataTrackPlot 
                slot="plot"
                x="sample_id"
                :dataArray="selectedGenesExpData"
                :cArray="selectedGenesExpScales"
                :getData="getData"
                :getScale="getScale"
                :clickHandler="sampleClickHandler"
            />
        </PlotContainer>
       
        <!-- Gene CNA -->
        <PlotInfo title="Gene Copy Number Alteration" :style="{'margin-top': '15px'}">
            <p slot="info">
                This plot shows CNA values for each selected gene and sample.
            </p>
        </PlotInfo>
        <PlotContainer
            :pWidth="(colWidth-150-5)"
            :pHeight="(selectedGenesCNA.length * 25)"
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
            downloadName="explosig_multisample_gene_CNA"
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
            <MultiDataTrackPlot 
                slot="plot"
                x="sample_id"
                :dataArray="selectedGenesCNAData"
                :cArray="selectedGenesCNAScales"
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
            selectedGenesMut: [],
            selectedGenesExp: [],
            selectedGenesCNA: [],
        }
    },
    mounted() {
        const mutScale = this.getScale("gene_mut");
        this.selectedGenesMut = mutScale.domain.slice();

        const expScale = this.getScale("gene_exp");
        this.selectedGenesExp = expScale.domain.slice();

        const cnaScale = this.getScale("gene_cna");
        this.selectedGenesCNA = expScale.domain.slice();
    },
    computed: {
        colWidth() {
            return this.windowWidth * this.getSizes().columns[EXPLORER_COLUMNS.MAIN] - 25;
        },
        selectedGenesMutData() {
            return this.selectedGenesMut.map(g => `gene_mut_${g}`)
        },
        selectedGenesMutScales() {
            return Array.from(new Array(this.selectedGenesMut.length), () => "mut_class");
        },
        selectedGenesExpData() {
            return this.selectedGenesExp.map(g => `gene_exp_${g}`)
        },
        selectedGenesExpScales() {
            return Array.from(new Array(this.selectedGenesExp.length), () => "gene_expression");
        },
        selectedGenesCNAData() {
            return this.selectedGenesCNA.map(g => `gene_cna_${g}`)
        },
        selectedGenesCNAScales() {
            return Array.from(new Array(this.selectedGenesCNA.length), () => "copy_number");
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
