<template>
    <div>
        <!-- Meta -->
        <PlotInfo title="Sample Metadata">
            <p slot="info">
                This plot shows metadata for each sample.
            </p>
        </PlotInfo>
        <NumSamples />
        <PlotContainer
            :pWidth="(colWidth-150-5)"
            :pHeight="20"
            :pMarginTop="130"
            :pMarginLeft="150"
            :pMarginRight="5"
            :pMarginBottom="0"
        >
            <Axis 
                slot="axisTop"
                variable="sample_id"
                side="top"
                :tickRotation="-65"
                :maxCharacters="4"
                :getScale="getScale"
                :getStack="getStack"
            />
            <Axis 
                slot="axisLeft"
                variable="sample_meta"
                side="left"
                :disableBrushing="true"
                :getScale="getScale"
                :getStack="getStack"
            />
            <TrackPlot 
                slot="plot"
                data="sample_meta"
                x="sample_id"
                c="proj_id"
                :getData="getData"
                :getScale="getScale"
                :clickHandler="sampleClickHandler"
            />
        </PlotContainer>

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
            :pMarginTop="3"
            :pMarginLeft="150"
            :pMarginRight="5"
            :pMarginBottom="3"
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
                :clickHandler="sampleClickHandler"
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
        <PlotContainer v-if="showSbs" :key="('sbs' + explorerMainKey)"
            :pWidth="(colWidth-150-5)"
            :pHeight="200"
            :pMarginTop="3"
            :pMarginLeft="150"
            :pMarginRight="5"
            :pMarginBottom="3"
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
                c="sig_SBS"
                :getData="getData"
                :getScale="getScale"
                :clickHandler="sampleClickHandler"
            />
        </PlotContainer>
        <PlotContainer v-if="showSbs && showNormalizedExposures" :key="('sbs_norm' + explorerMainKey)"
            :pWidth="(colWidth-150-5)"
            :pHeight="200"
            :pMarginTop="3"
            :pMarginLeft="150"
            :pMarginRight="5"
            :pMarginBottom="3"
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
                c="sig_SBS"
                :getData="getData"
                :getScale="getScale"
                :clickHandler="sampleClickHandler"
            />
        </PlotContainer>
        <PlotContainer v-if="showSbs && showCosineSimilarity" :key="('sbs_cosine' + explorerMainKey)"
            :pWidth="(colWidth-150-5)"
            :pHeight="100"
            :pMarginTop="5"
            :pMarginLeft="150"
            :pMarginRight="5"
            :pMarginBottom="5"
        >
            <Axis 
                slot="axisLeft"
                variable="cosine_similarity_SBS"
                side="left"
                :getScale="getScale"
                :getStack="getStack"
            />
            <BarPlot 
                slot="plot"
                data="cosine_similarity_SBS"
                x="sample_id"
                y="cosine_similarity_SBS"
                barColor="gray"
                :getData="getData"
                :getScale="getScale"
                :clickHandler="sampleClickHandler"
            />
        </PlotContainer>

        <PlotContainer v-if="showDbs" :key="('dbs' + explorerMainKey)"
            :pWidth="(colWidth-150-5)"
            :pHeight="200"
            :pMarginTop="5"
            :pMarginLeft="150"
            :pMarginRight="5"
            :pMarginBottom="5"
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
                c="sig_DBS"
                :getData="getData"
                :getScale="getScale"
                :clickHandler="sampleClickHandler"
            />
        </PlotContainer>
        <PlotContainer v-if="showDbs && showNormalizedExposures" :key="('dbs_norm' + explorerMainKey)"
            :pWidth="(colWidth-150-5)"
            :pHeight="200"
            :pMarginTop="5"
            :pMarginLeft="150"
            :pMarginRight="5"
            :pMarginBottom="5"
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
                c="sig_DBS"
                :getData="getData"
                :getScale="getScale"
                :clickHandler="sampleClickHandler"
            />
        </PlotContainer>
        <PlotContainer v-if="showDbs && showCosineSimilarity" :key="('dbs_cosine' + explorerMainKey)"
            :pWidth="(colWidth-150-5)"
            :pHeight="100"
            :pMarginTop="5"
            :pMarginLeft="150"
            :pMarginRight="5"
            :pMarginBottom="5"
        >
            <Axis 
                slot="axisLeft"
                variable="cosine_similarity_DBS"
                side="left"
                :getScale="getScale"
                :getStack="getStack"
            />
            <BarPlot 
                slot="plot"
                data="cosine_similarity_DBS"
                x="sample_id"
                y="cosine_similarity_DBS"
                barColor="gray"
                :getData="getData"
                :getScale="getScale"
                :clickHandler="sampleClickHandler"
            />
        </PlotContainer>


        <PlotContainer v-if="showIndel" :key="('indel' + explorerMainKey)"
            :pWidth="(colWidth-150-5)"
            :pHeight="200"
            :pMarginTop="5"
            :pMarginLeft="150"
            :pMarginRight="5"
            :pMarginBottom="5"
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
                c="sig_INDEL"
                :getData="getData"
                :getScale="getScale"
                :clickHandler="sampleClickHandler"
            />
        </PlotContainer>
         <PlotContainer v-if="showIndel && showNormalizedExposures" :key="('indel_norm' + explorerMainKey)"
            :pWidth="(colWidth-150-5)"
            :pHeight="200"
            :pMarginTop="5"
            :pMarginLeft="150"
            :pMarginRight="5"
            :pMarginBottom="5"
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
                c="sig_INDEL"
                :getData="getData"
                :getScale="getScale"
                :clickHandler="sampleClickHandler"
            />
        </PlotContainer>
        <PlotContainer v-if="showIndel && showCosineSimilarity" :key="('indel_cosine' + explorerMainKey)"
            :pWidth="(colWidth-150-5)"
            :pHeight="100"
            :pMarginTop="5"
            :pMarginLeft="150"
            :pMarginRight="5"
            :pMarginBottom="5"
        >
            <Axis 
                slot="axisLeft"
                variable="cosine_similarity_INDEL"
                side="left"
                :getScale="getScale"
                :getStack="getStack"
            />
            <BarPlot 
                slot="plot"
                data="cosine_similarity_INDEL"
                x="sample_id"
                y="cosine_similarity_INDEL"
                barColor="gray"
                :getData="getData"
                :getScale="getScale"
                :clickHandler="sampleClickHandler"
            />
        </PlotContainer>
        
        <!-- Toggle for normalized exposure plots -->
        <VisibilityButtons />

        

        <!-- Gene Alterations -->
        <div v-if="showGenes">
            <GeneTracks :widthProportion="widthProportion" :sampleClickHandler="sampleClickHandler" />
        </div>

        <!-- Clinical Variables -->
        <div v-if="showClinical">
            <ClinicalTracks :widthProportion="widthProportion" :sampleClickHandler="sampleClickHandler" />
        </div>

        <!-- Hierarchical Clustering -->
        <PlotInfo 
            title="Hierarchical Clustering of Normalized Mutation Signature Exposures" 
            :style="{'margin-top': '15px'}"
        >
            <p slot="info">
                This plot shows normalized exposures to mutation signatures per sample after clustering.<br>
                Ward linkage has been used to cluster samples.
            </p>
        </PlotInfo>

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
                variable="sig_SBS"
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
                y="sig_SBS"
                c="exposure_sbs_normalized"
                :getScale="getScale"
                :getStack="getStack"
                :getData="getData"
                :clickHandler="sampleClickHandler"
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
                variable="sig_DBS"
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
                y="sig_DBS"
                c="exposure_dbs_normalized"
                :getScale="getScale"
                :getStack="getStack"
                :getData="getData"
                :clickHandler="sampleClickHandler"
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
                variable="sig_INDEL"
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
                y="sig_INDEL"
                c="exposure_indel_normalized"
                :getScale="getScale"
                :getStack="getStack"
                :getData="getData"
                :clickHandler="sampleClickHandler"
            />
        </PlotContainer>

        <PlotContainer
            :pWidth="(colWidth-150-5)"
            :pHeight="0"
            :pMarginTop="0"
            :pMarginLeft="150"
            :pMarginRight="20"
            :pMarginBottom="200"
        >
            <DendrogramAxis
                slot="axisBottom"
                variable="sample_id"
                h="exposures_clustering"
                side="bottom"
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
import ClinicalTracks from './ClinicalTracks.vue';
import GeneTracks from './GeneTracks.vue';
import VisibilityButtons from './VisibilityButtons.vue';
import NumSamples from './NumSamples.vue';


import { PLOT_GROUPS } from './../vdp/Visibility';

import { HistoryEvent } from 'vue-declarative-plots';
import { EVENT_TYPE_SAMPLES, EVENT_SUBTYPE_SAMPLES } from './../vdp/Samples';


export default {
    name: 'ExplorerMain',
    components: {
        PlotInfo,
        ClinicalTracks,
        GeneTracks,
        VisibilityButtons,
        NumSamples
    },
    props: {
        'widthProportion': {
            type: Number
        }
    },
    data() {
        return {
            explorerMainKey: 1
        };
    },
    watch: {
        showNormalizedExposures() {
            this.explorerMainKey++;
        },
        showCosineSimilarity() {
            this.explorerMainKey++;
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
        showClinical() {
            return (this.getConfig().selectedClinicalVariables.length > 0);
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
        selectedClinicalVariables() {
            return (this.getConfig().selectedClinicalVariables);
        },
        showNormalizedExposures() {
            return (!this.getVisibility().hiddenPlots.includes(PLOT_GROUPS.NORMALIZED_EXPOSURES));
        },
        showCosineSimilarity() {
            return (!this.getVisibility().hiddenPlots.includes(PLOT_GROUPS.COSINE_SIMILARITY));
        },
        ...mapGetters([
            'windowHeight', 
            'windowWidth',
            'getConfig',
            'getVisibility',
            'getStack',
            'getData',
            'getScale',
            'getSamples'
        ])
    },
    methods: {
        sampleClickHandler(sampleId) {
            let samplesObject = this.getSamples();
            if(!samplesObject.selectedSamples.includes(sampleId)) {
                let updatedSamples = [ ...samplesObject.selectedSamples, sampleId ];
                samplesObject.updateSelectedSamples(updatedSamples);
                this.getStack().push(new HistoryEvent(
                    EVENT_TYPE_SAMPLES, 
                    EVENT_SUBTYPE_SAMPLES, 
                    "N/A", 
                    "updateSelectedSamples", 
                    [Array.from(updatedSamples)]
                ));
            } else {
                if(samplesObject.activeSample !== sampleId) {
                    samplesObject.updateActiveSample(sampleId);
                    this.getStack().push(new HistoryEvent(
                        EVENT_TYPE_SAMPLES, 
                        EVENT_SUBTYPE_SAMPLES, 
                        "N/A", 
                        "updateActiveSample", 
                        [sampleId]
                    ));
                }
            }
        }
    }
}
</script>

<style scoped lang="scss">
@import './../style/variables.scss';

</style>
