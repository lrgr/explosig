<template>
    <div>
        <!-- Meta -->
        <PlotInfo title="Samples">
            <p slot="info">
                This axis (and most other axes) show an "overview" (zoomed-out) view to provide context and enable interaction. 
                Here we also display a zoomed-out version of the Mutation Count plot behind the zoomed-out Sample axis for additional context.
                Samples can be filtered by panning or dragging the window along the zoomed-out view.
                <br><br>
                The Study track immediately below the Sample axis displays the study from which each sample comes.
            </p>
        </PlotInfo>
        <NumSamples />
        <!-- counts plot as background for sample axis -->
        <div id="counts-plot-background-container">
            <div id="counts-plot-background">
                <PlotContainer
                    :pWidth="(colWidth-150-5)"
                    :pHeight="35"
                    :pMarginTop="9"
                    :pMarginLeft="150"
                    :pMarginRight="5"
                    :pMarginBottom="0"
                >
                    <StackedBarPlot 
                        slot="plot"
                        data="mut_count"
                        x="sample_id"
                        y="mut_count_sum"
                        c="mut_type"
                        :getData="getData"
                        :getScale="getScale"
                        :filterX="false"
                        :filterY="false"
                    />
                </PlotContainer>
            </div>
        </div>
        <!-- samples axis -->
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
        <ResizablePlotContainer
            plotCode="main_mut_counts"
            :pWidth="(colWidth-150-5)"
            :pHeight="125"
            :pMarginTop="3"
            :pMarginLeft="150"
            :pMarginRight="5"
            :pMarginBottom="4"
        >
            <PlotContainer
                slot="inner"
                :showDownloadButton="true"
                :downloadButtonSize="12"
                :downloadButtonOffsetY="22"
                :downloadButtonOffsetX="20"
                :showResizeButton="true"
                :resizeButtonSize="12"
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
        </ResizablePlotContainer>

        <!-- Exposures -->
        <PlotContainer v-if="showSBS" :key="('sbs_dominant' + explorerMainKey)"
            :pWidth="(colWidth-150-5)"
            :pHeight="20"
            :pMarginTop="0"
            :pMarginLeft="150"
            :pMarginRight="5"
            :pMarginBottom="0"
        >
            <Axis 
                slot="axisLeft"
                variable="dominant_sig_sbs_meta"
                side="left"
                :disableBrushing="true"
                :getScale="getScale"
                :getStack="getStack"
            />
            <TrackPlot 
                slot="plot"
                data="dominant_sig_sbs"
                x="sample_id"
                c="sig_SBS"
                :getData="getData"
                :getScale="getScale"
                :clickHandler="sampleClickHandler"
            />
        </PlotContainer>
        <PlotInfo title="Mutation Signature Exposures per Sample">
            <p slot="info">
                This group of plots displays mutation signature exposures for each sample.<br>
                Exposures are stacked and colored by signature.<br>
                Plots are separated by mutation type.<br>
                Every other plot shows exposures after normalizing (to sum to 1).
            </p>
        </PlotInfo>
        <ResizablePlotContainer v-if="showSBS" :key="('sbs' + explorerMainKey)"
            plotCode="main_sbs"
            :pWidth="(colWidth-150-5)"
            :pHeight="200"
            :pMarginTop="3"
            :pMarginLeft="150"
            :pMarginRight="5"
            :pMarginBottom="4"
        >
            <PlotContainer
                slot="inner"
                :showDownloadButton="true"
                :downloadButtonSize="12"
                :downloadButtonOffsetY="22"
                :downloadButtonOffsetX="20"
                :showResizeButton="true"
                :resizeButtonSize="12"
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
        </ResizablePlotContainer>
        <ResizablePlotContainer v-if="showSBS && showNormalizedExposures" :key="('sbs_norm' + explorerMainKey)"
            plotCode="main_sbs_norm"
            :pWidth="(colWidth-150-5)"
            :pHeight="200"
            :pMarginTop="3"
            :pMarginLeft="150"
            :pMarginRight="5"
            :pMarginBottom="3"
        >
            <PlotContainer
                slot="inner"
                :showDownloadButton="true"
                :downloadButtonSize="12"
                :downloadButtonOffsetY="22"
                :downloadButtonOffsetX="20"
                :showResizeButton="true"
                :resizeButtonSize="12"
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
        </ResizablePlotContainer>
        <ResizablePlotContainer v-if="showSBS && showCosineSimilarity" :key="('sbs_cosine' + explorerMainKey)"
            plotCode="main_sbs_cosine"
            :pWidth="(colWidth-150-5)"
            :pHeight="100"
            :pMarginTop="5"
            :pMarginLeft="150"
            :pMarginRight="5"
            :pMarginBottom="5"
        >
            <PlotContainer
                slot="inner"
                :showDownloadButton="true"
                :downloadButtonSize="12"
                :downloadButtonOffsetY="22"
                :downloadButtonOffsetX="20"
                :showResizeButton="true"
                :resizeButtonSize="12"
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
        </ResizablePlotContainer>
        <PlotContainer v-if="showDBS" :key="('dbs_dominant' + explorerMainKey)"
            :pWidth="(colWidth-150-5)"
            :pHeight="20"
            :pMarginTop="0"
            :pMarginLeft="150"
            :pMarginRight="5"
            :pMarginBottom="0"
        >
            <Axis 
                slot="axisLeft"
                variable="dominant_sig_dbs_meta"
                side="left"
                :disableBrushing="true"
                :getScale="getScale"
                :getStack="getStack"
            />
            <TrackPlot 
                slot="plot"
                data="dominant_sig_dbs"
                x="sample_id"
                c="sig_DBS"
                :getData="getData"
                :getScale="getScale"
                :clickHandler="sampleClickHandler"
            />
        </PlotContainer>
        <ResizablePlotContainer v-if="showDBS" :key="('dbs' + explorerMainKey)"
            plotCode="main_dbs"
            :pWidth="(colWidth-150-5)"
            :pHeight="200"
            :pMarginTop="5"
            :pMarginLeft="150"
            :pMarginRight="5"
            :pMarginBottom="5"
        >
            <PlotContainer
                slot="inner"
                :showDownloadButton="true"
                :downloadButtonSize="12"
                :downloadButtonOffsetY="22"
                :downloadButtonOffsetX="20"
                :showResizeButton="true"
                :resizeButtonSize="12"
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
        </ResizablePlotContainer>
        <ResizablePlotContainer v-if="showDBS && showNormalizedExposures" :key="('dbs_norm' + explorerMainKey)"
            plotCode="main_dbs_norm"
            :pWidth="(colWidth-150-5)"
            :pHeight="200"
            :pMarginTop="5"
            :pMarginLeft="150"
            :pMarginRight="5"
            :pMarginBottom="5"
        >
            <PlotContainer
                slot="inner"
                :showDownloadButton="true"
                :downloadButtonSize="12"
                :downloadButtonOffsetY="22"
                :downloadButtonOffsetX="20"
                :showResizeButton="true"
                :resizeButtonSize="12"
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
        </ResizablePlotContainer>
        <ResizablePlotContainer v-if="showDBS && showCosineSimilarity" :key="('dbs_cosine' + explorerMainKey)"
            plotCode="main_dbs_cosine"
            :pWidth="(colWidth-150-5)"
            :pHeight="100"
            :pMarginTop="5"
            :pMarginLeft="150"
            :pMarginRight="5"
            :pMarginBottom="5"
        >
            <PlotContainer
                slot="inner"
                :showDownloadButton="true"
                :downloadButtonSize="12"
                :downloadButtonOffsetY="22"
                :downloadButtonOffsetX="20"
                :showResizeButton="true"
                :resizeButtonSize="12"
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
        </ResizablePlotContainer>
        <PlotContainer v-if="showINDEL" :key="('indel_dominant' + explorerMainKey)"
            :pWidth="(colWidth-150-5)"
            :pHeight="20"
            :pMarginTop="0"
            :pMarginLeft="150"
            :pMarginRight="5"
            :pMarginBottom="0"
        >
            <Axis 
                slot="axisLeft"
                variable="dominant_sig_indel_meta"
                side="left"
                :disableBrushing="true"
                :getScale="getScale"
                :getStack="getStack"
            />
            <TrackPlot 
                slot="plot"
                data="dominant_sig_indel"
                x="sample_id"
                c="sig_INDEL"
                :getData="getData"
                :getScale="getScale"
                :clickHandler="sampleClickHandler"
            />
        </PlotContainer>
        <ResizablePlotContainer v-if="showINDEL" :key="('indel' + explorerMainKey)"
            plotCode="main_indel"
            :pWidth="(colWidth-150-5)"
            :pHeight="200"
            :pMarginTop="5"
            :pMarginLeft="150"
            :pMarginRight="5"
            :pMarginBottom="5"
        >
            <PlotContainer
                slot="inner"
                :showDownloadButton="true"
                :downloadButtonSize="12"
                :downloadButtonOffsetY="22"
                :downloadButtonOffsetX="20"
                :showResizeButton="true"
                :resizeButtonSize="12"
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
        </ResizablePlotContainer>
        <ResizablePlotContainer v-if="showINDEL && showNormalizedExposures" :key="('indel_norm' + explorerMainKey)"
            plotCode="main_indel_norm"
            :pWidth="(colWidth-150-5)"
            :pHeight="200"
            :pMarginTop="5"
            :pMarginLeft="150"
            :pMarginRight="5"
            :pMarginBottom="5"
        >
            <PlotContainer
                slot="inner"
                :showDownloadButton="true"
                :downloadButtonSize="12"
                :downloadButtonOffsetY="22"
                :downloadButtonOffsetX="20"
                :showResizeButton="true"
                :resizeButtonSize="12"
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
        </ResizablePlotContainer>
        <ResizablePlotContainer v-if="showINDEL && showCosineSimilarity" :key="('indel_cosine' + explorerMainKey)"
            plotCode="main_indel_cosine"
            :pWidth="(colWidth-150-5)"
            :pHeight="100"
            :pMarginTop="5"
            :pMarginLeft="150"
            :pMarginRight="5"
            :pMarginBottom="5"
        >
            <PlotContainer
                slot="inner"
                :showDownloadButton="true"
                :downloadButtonSize="12"
                :downloadButtonOffsetY="22"
                :downloadButtonOffsetX="20"
                :showResizeButton="true"
                :resizeButtonSize="12"
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
        </ResizablePlotContainer>
        
        <!-- Toggle for normalized exposure plots -->
        <VisibilityButtons />

        <!-- Gene Alterations -->
        <GeneTracksContainer :sampleClickHandler="sampleClickHandler" />

        <!-- Clinical Variables -->
        <ClinicalTracks :sampleClickHandler="sampleClickHandler" />

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

        <PlotContainer v-if="showSBS"
            :pWidth="(colWidth-150-5)"
            :pHeight="(numSbs * 30)"
            :pMarginTop="0"
            :pMarginLeft="150"
            :pMarginRight="20"
            :pMarginBottom="5"

            :showDownloadButton="true"
            :downloadButtonSize="12"
            :downloadButtonOffsetY="22"
            :downloadButtonOffsetX="20"
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

        <PlotContainer v-if="showDBS"
            :pWidth="(colWidth-150-5)"
            :pHeight="(numDbs * 30)"
            :pMarginTop="0"
            :pMarginLeft="150"
            :pMarginRight="20"
            :pMarginBottom="5"

            :showDownloadButton="true"
            :downloadButtonSize="12"
            :downloadButtonOffsetY="22"
            :downloadButtonOffsetX="20"
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

        <PlotContainer v-if="showINDEL"
            :pWidth="(colWidth-150-5)"
            :pHeight="(numIndel * 30)"
            :pMarginTop="0"
            :pMarginLeft="150"
            :pMarginRight="20"
            :pMarginBottom="5"

            :showDownloadButton="true"
            :downloadButtonSize="12"
            :downloadButtonOffsetY="22"
            :downloadButtonOffsetX="20"
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

            :showDownloadButton="true"
            :downloadButtonSize="12"
            :downloadButtonOffsetY="22"
            :downloadButtonOffsetX="20"
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
import { HistoryEvent } from 'vueplotlib';

import PlotInfo from './PlotInfo.vue';
import ClinicalTracks from './ClinicalTracks.vue';
import GeneTracksContainer from './GeneTracksContainer.vue';
import VisibilityButtons from './VisibilityButtons.vue';
import NumSamples from './NumSamples.vue';
import ResizablePlotContainer from './ResizablePlotContainer.vue';

import { PLOT_GROUPS } from './../vdp/Visibility.js';
import { EVENT_TYPE_SAMPLES, EVENT_SUBTYPE_SAMPLES } from './../vdp/Samples.js';
import { EXPLORER_COLUMNS } from './../vdp/Sizes.js';


export default {
    name: 'ExplorerMain',
    components: {
        PlotInfo,
        ClinicalTracks,
        GeneTracksContainer,
        VisibilityButtons,
        NumSamples,
        ResizablePlotContainer
    },
    data() {
        return {
            explorerMainKey: 1,
            showSBS: false,
            showDBS: false,
            showINDEL: false
        };
    },
    created() {
        const mutTypeScale = this.getScale("mut_type");
        for(const mutType of mutTypeScale.domain) {
            const sigScale = this.getScale(`sig_${mutType}`);
            this[`show${mutType}`] = sigScale.domain.length > 0;
        }
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
            return this.windowWidth * this.getSizes().columns[EXPLORER_COLUMNS.MAIN] - 25;
        },
        showMeta() {
            return (this.isEmptySession || this.getConfig().selectedSamples.length > 1);
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
            'getSamples',
            'getSizes',
            'isEmptySession'
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

#counts-plot-background-container {
    position: relative;
    #counts-plot-background {
        position: absolute;
        margin-top: 29px;
    }
}
</style>
