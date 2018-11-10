<template>
    <div>
        <!-- Counts -->
        <PlotInfo title="Number of Mutations per Sample">
            <p slot="info">
                This plot displays mutation counts for each sample, stacked by mutation type (single base substitution, doublet base substitution, indel).<br>
                Samples are on the x-axis and counts are on the y-axis.<br>
                Bar color signifies mutation type.
            </p>
        </PlotInfo>
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
        <PlotInfo title="Mutation Signature Exposures per Sample">
            <p slot="info">
                This group of plots displays mutation signature exposures for each sample.<br>
                Exposures are stacked and colored by signature.<br>
                Plots are separated by mutation type.<br>
                Every other plot shows exposures after normalizing (to sum to 1).
            </p>
        </PlotInfo>
        <PlotContainer v-if="showSbs"
            :pWidth="(colWidth-150-5)"
            :pHeight="200"
            :pMarginTop="10"
            :pMarginLeft="150"
            :pMarginRight="5"
            :pMarginBottom="0"
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
            :pMarginTop="10"
            :pMarginLeft="150"
            :pMarginRight="5"
            :pMarginBottom="0"
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
            :pMarginTop="10"
            :pMarginLeft="150"
            :pMarginRight="5"
            :pMarginBottom="0"
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
            :pMarginTop="10"
            :pMarginLeft="150"
            :pMarginRight="5"
            :pMarginBottom="0"
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
            :pMarginTop="10"
            :pMarginLeft="150"
            :pMarginRight="5"
            :pMarginBottom="0"
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
            :pMarginTop="10"
            :pMarginLeft="150"
            :pMarginRight="5"
            :pMarginBottom="0"
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

        <!-- Meta -->
        <div v-if="showMeta">
            <PlotInfo title="Sample Metadata">
                <p slot="info">
                    This plot shows metadata for each sample.
                </p>
            </PlotInfo>
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
                    data="sample_meta"
                    x="sample_id"
                    c="proj_id"
                    :getData="getData"
                    :getScale="getScale"
                />
            </PlotContainer>
        </div>

        <!-- Gene Alterations -->
        <div v-if="showGenes">
            <PlotInfo title="Gene Mutation Classification">
                <p slot="info">
                    This plot shows mutation classification for each selected gene for each sample.
                </p>
            </PlotInfo>
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
                    />
                </PlotContainer>
            </div>
        </div>

        <!-- Hierarchical Clustering -->
        <PlotInfo title="Hierarchical Clustering of Normalized Mutation Signature Exposures">
            <p slot="info">
                This plot shows normalized exposures to mutation signatures per sample after clustering.<br>
                Ward linkage has been used to cluster samples.
            </p>
        </PlotInfo>
        <PlotContainer
            :pWidth="(colWidth-150-5)"
            :pHeight="0"
            :pMarginTop="200"
            :pMarginLeft="150"
            :pMarginRight="20"
            :pMarginBottom="0"
        >
            <DendrogramAxis
                slot="axisTop"
                variable="sample_id"
                h="exposures_clustering"
                side="top"
                :getScale="getScale"
                :getStack="getStack"
                :getData="getData"
            />
        </PlotContainer>

        <PlotContainer v-if="showSbs"
            :pWidth="(colWidth-150-5)"
            :pHeight="(numSbs * 30)"
            :pMarginTop="0"
            :pMarginLeft="150"
            :pMarginRight="20"
            :pMarginBottom="5"
        >
            <Axis
                slot="axisLeft"
                variable="sig_sbs"
                side="left"
                :getScale="getScale"
                :getStack="getStack"
                :disableBrushing="true"
            />
            <HierarchicalMultiTrackPlot
                slot="plot"
                data="exposure_sbs_normalized"
                h="exposures_clustering"
                x="sample_id"
                y="sig_sbs"
                c="exposure_sbs_normalized"
                :getScale="getScale"
                :getStack="getStack"
                :getData="getData"
            />
        </PlotContainer>

        <PlotContainer v-if="showDbs"
            :pWidth="(colWidth-150-5)"
            :pHeight="(numDbs * 30)"
            :pMarginTop="0"
            :pMarginLeft="150"
            :pMarginRight="20"
            :pMarginBottom="5"
        >
            <Axis
                slot="axisLeft"
                variable="sig_dbs"
                side="left"
                :getScale="getScale"
                :getStack="getStack"
                :disableBrushing="true"
            />
            <HierarchicalMultiTrackPlot
                slot="plot"
                data="exposure_dbs_normalized"
                h="exposures_clustering"
                x="sample_id"
                y="sig_dbs"
                c="exposure_dbs_normalized"
                :getScale="getScale"
                :getStack="getStack"
                :getData="getData"
            />
        </PlotContainer>

        <PlotContainer v-if="showIndel"
            :pWidth="(colWidth-150-5)"
            :pHeight="(numIndel * 30)"
            :pMarginTop="0"
            :pMarginLeft="150"
            :pMarginRight="20"
            :pMarginBottom="5"
        >
            <Axis
                slot="axisLeft"
                variable="sig_indel"
                side="left"
                :getScale="getScale"
                :getStack="getStack"
                :disableBrushing="true"
            />
            <HierarchicalMultiTrackPlot
                slot="plot"
                data="exposure_indel_normalized"
                h="exposures_clustering"
                x="sample_id"
                y="sig_indel"
                c="exposure_indel_normalized"
                :getScale="getScale"
                :getStack="getStack"
                :getData="getData"
            />
        </PlotContainer>

    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import PlotInfo from './PlotInfo.vue';

export default {
    name: 'ExplorerMain',
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
        showSbs() {
            return (this.getConfig().selectedSignaturesSbs.length > 0);
        },
        showDbs() {
            return (this.getConfig().selectedSignaturesDbs.length > 0);
        },
        showIndel() {
            return (this.getConfig().selectedSignaturesIndel.length > 0);
        },
        showMeta() {
            return (this.getConfig().selectedSamples.length > 1);
        },
        showGenes() {
            return (this.getConfig().selectedGenes.length > 0);
        },
        numSbs() {
            return (this.getConfig().selectedSignaturesSbs.length);
        },
        numDbs() {
            return (this.getConfig().selectedSignaturesDbs.length);
        },
        numIndel() {
            return (this.getConfig().selectedSignaturesIndel.length);
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
@import '~vue-declarative-plots/dist/vue-declarative-plots.css';


</style>
