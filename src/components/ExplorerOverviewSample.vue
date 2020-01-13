<template>
    <div @mouseover="highlightSample" @mouseleave="unhighlightSample">
        <h3 class="sample-title">Sample {{ sampleId }}</h3>

        <!-- Exposures -->
        <PlotInfo title="Exposures" :showTitle="true">
            <p slot="info">
                These plots display exposures to the selected signatures for sample {{ sampleId }}.
            </p>
        </PlotInfo>
        <div v-if="showSbs">
            <PlotContainer
                :pWidth="(colWidth-120-5)"
                :pHeight="200"
                :pMarginTop="10"
                :pMarginLeft="120"
                :pMarginRight="5"
                :pMarginBottom="110"

                :showDownloadButton="true"
                :downloadButtonSize="12"
                :downloadButtonOffsetY="22"
                :downloadButtonOffsetX="20"
                :showResizeButton="true"
                :resizeButtonSize="12"
                :downloadName="('explosig_sample_exposures_SBS_' + sampleId)"
            >
                <Axis 
                    slot="axisLeft"
                    :variable="('exp_SBS_' + sampleId)"
                    side="left"
                    :getScale="getScale"
                    :getStack="getStack"
                />
                <BarPlot 
                    slot="plot"
                    :data="('exp_SBS_' + sampleId)"
                    x="sig_SBS"
                    :y="('exp_SBS_' + sampleId)"
                    :getData="getData"
                    :getScale="getScale"
                />
                <Axis 
                    slot="axisBottom"
                    variable="sig_SBS"
                    side="bottom"
                    :tickRotation="-65"
                    :disableBrushing="true"
                    :getScale="getScale"
                    :getStack="getStack"
                />
            </PlotContainer>
        </div>
        <div v-if="showDbs">
            <PlotContainer
                :pWidth="(colWidth-120-5)"
                :pHeight="200"
                :pMarginTop="10"
                :pMarginLeft="120"
                :pMarginRight="5"
                :pMarginBottom="110"

                :showDownloadButton="true"
                :downloadButtonSize="12"
                :downloadButtonOffsetY="22"
                :downloadButtonOffsetX="20"
                :showResizeButton="true"
                :resizeButtonSize="12"
                :downloadName="('explosig_sample_exposures_DBS_' + sampleId)"
            >
                <Axis 
                    slot="axisLeft"
                    :variable="('exp_DBS_' + sampleId)"
                    side="left"
                    :getScale="getScale"
                    :getStack="getStack"
                />
                <BarPlot 
                    slot="plot"
                    :data="('exp_DBS_' + sampleId)"
                    x="sig_DBS"
                    :y="('exp_DBS_' + sampleId)"
                    :getData="getData"
                    :getScale="getScale"
                />
                <Axis 
                    slot="axisBottom"
                    variable="sig_DBS"
                    side="bottom"
                    :tickRotation="-65"
                    :disableBrushing="true"
                    :getScale="getScale"
                    :getStack="getStack"
                />
            </PlotContainer>
        </div>
        <div v-if="showIndel">
            <PlotContainer
                :pWidth="(colWidth-120-5)"
                :pHeight="200"
                :pMarginTop="10"
                :pMarginLeft="120"
                :pMarginRight="5"
                :pMarginBottom="110"

                :showDownloadButton="true"
                :downloadButtonSize="12"
                :downloadButtonOffsetY="22"
                :downloadButtonOffsetX="20"
                :showResizeButton="true"
                :resizeButtonSize="12"
                :downloadName="('explosig_sample_exposures_INDEL_' + sampleId)"
            >
                <Axis 
                    slot="axisLeft"
                    :variable="('exp_INDEL_' + sampleId)"
                    side="left"
                    :getScale="getScale"
                    :getStack="getStack"
                />
                <BarPlot 
                    slot="plot"
                    :data="('exp_INDEL_' + sampleId)"
                    x="sig_INDEL"
                    :y="('exp_INDEL_' + sampleId)"
                    :getData="getData"
                    :getScale="getScale"
                />
                <Axis 
                    slot="axisBottom"
                    variable="sig_INDEL"
                    side="bottom"
                    :tickRotation="-65"
                    :disableBrushing="true"
                    :getScale="getScale"
                    :getStack="getStack"
                />
            </PlotContainer>
        </div>

        <!-- Genes -->
        <PlotInfo title="Genes" :showTitle="true" v-if="selectedGenes.length > 0">
            <p slot="info">
                These plots display mutation classifications of the selected genes for sample {{ sampleId }}.
            </p>
        </PlotInfo>
        <!-- Gene Mutation -->
        <PlotContainer v-if="selectedGenes.length > 0"
            :pWidth="(colWidth-180-5)"
            :pHeight="(numGenes * 25)"
            :pMarginTop="0"
            :pMarginLeft="180"
            :pMarginRight="0"
            :pMarginBottom="0"

            :showDownloadButton="true"
            :downloadButtonSize="12"
            :downloadButtonOffsetY="22"
            :downloadButtonOffsetX="20"
            :showResizeButton="true"
            :resizeButtonSize="12"
            :downloadName="('explosig_sample_gene_mutation_' + sampleId)"
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
            <MultiDataRectPlot 
                slot="plot"
                :dataArray="selectedGenesMutData"
                :cArray="selectedGenesMutScales"
                :rectSize="25"
                :disableText="false"
                z="sample_id"
                :o="sampleId"
                :getData="getData"
                :getScale="getScale"
                :disableTooltip="true"
            />
        </PlotContainer>
        <div class="gene-data-type-divider"></div>

        <!-- Gene Expression -->
        <PlotContainer v-if="selectedGenes.length > 0"
            :pWidth="(colWidth-180-5)"
            :pHeight="(numGenes * 25)"
            :pMarginTop="0"
            :pMarginLeft="180"
            :pMarginRight="0"
            :pMarginBottom="0"

            :showDownloadButton="true"
            :downloadButtonSize="12"
            :downloadButtonOffsetY="22"
            :downloadButtonOffsetX="20"
            :showResizeButton="true"
            :resizeButtonSize="12"
            :downloadName="('explosig_sample_gene_expression_' + sampleId)"
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
            <MultiDataRectPlot 
                slot="plot"
                :dataArray="selectedGenesExpData"
                :cArray="selectedGenesExpScales"
                :rectSize="25"
                :disableText="false"
                z="sample_id"
                :o="sampleId"
                :getData="getData"
                :getScale="getScale"
                :disableTooltip="true"
            />
        </PlotContainer>
        <div class="gene-data-type-divider"></div>

        <!-- Gene CNA -->
        <PlotContainer v-if="selectedGenes.length > 0"
            :pWidth="(colWidth-180-5)"
            :pHeight="(numGenes * 25)"
            :pMarginTop="0"
            :pMarginLeft="180"
            :pMarginRight="0"
            :pMarginBottom="0"

            :showDownloadButton="true"
            :downloadButtonSize="12"
            :downloadButtonOffsetY="22"
            :downloadButtonOffsetX="20"
            :showResizeButton="true"
            :resizeButtonSize="12"
            :downloadName="('explosig_sample_gene_CNA_' + sampleId)"
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
            <MultiDataRectPlot 
                slot="plot"
                :dataArray="selectedGenesCNAData"
                :cArray="selectedGenesCNAScales"
                :rectSize="25"
                :disableText="false"
                z="sample_id"
                :o="sampleId"
                :getData="getData"
                :getScale="getScale"
                :disableTooltip="true"
            />
        </PlotContainer>

        <!-- Clinical -->
        <PlotInfo title="Clinical Variables" :showTitle="true" v-if="selectedClinicalVariables.length > 0">
            <p slot="info">
                This plot displays values of the selected clinical variables for sample {{ sampleId }}.
            </p>
        </PlotInfo>
        <PlotContainer v-if="selectedClinicalVariables.length > 0"
            :pWidth="(colWidth-180-5)"
            :pHeight="(numClinicalVariables * 25)"
            :pMarginTop="0"
            :pMarginLeft="180"
            :pMarginRight="0"
            :pMarginBottom="20"

            :showDownloadButton="true"
            :downloadButtonSize="12"
            :downloadButtonOffsetY="22"
            :downloadButtonOffsetX="20"
            :showResizeButton="true"
            :resizeButtonSize="12"
            :downloadName="('explosig_sample_clinical_data_' + sampleId)"
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
            <MultiDataRectPlot 
                slot="plot"
                :dataArray="selectedClinicalData"
                :cArray="selectedClinicalVariables"
                :rectSize="25"
                :disableText="false"
                z="sample_id"
                :o="sampleId"
                :getData="getData"
                :getScale="getScale"
                :disableTooltip="true"
            />
        </PlotContainer>

        <!-- Reconstruction -->
        <PlotInfo title="Reconstruction of Mutation Profile" :showTitle="true">
            <p slot="info">
                This plot displays the mutation counts and the reconstruction using signatures with the error for each category.
            </p>
        </PlotInfo>
        <div v-if="showSbs">
            <p class="sample-cosine-similarity">SBS Reconstruction Cosine Similarity: {{ cosineSimilaritySbs }}</p>
            <PlotContainer
                :pWidth="(colWidth-130-5)"
                :pHeight="200"
                :pMarginTop="10"
                :pMarginLeft="130"
                :pMarginRight="5"
                :pMarginBottom="5"

                :showDownloadButton="true"
                :downloadButtonSize="12"
                :downloadButtonOffsetY="22"
                :downloadButtonOffsetX="20"
                :showResizeButton="true"
                :resizeButtonSize="12"
                :downloadName="('explosig_sample_mutation_profile_true_SBS_' + sampleId)"
            >
                <Axis 
                    slot="axisLeft"
                    :variable="('count_SBS_' + sampleId)"
                    side="left"

                    :getScale="getScale"
                    :getStack="getStack"
                />
                <BarPlot 
                    slot="plot"
                    :data="('count_SBS_' + sampleId)"
                    x="cat_SBS"
                    :y="('count_SBS_' + sampleId)"
                    :getData="getData"
                    :getScale="getScale"
                />
            </PlotContainer>

            <PlotContainer
                :pWidth="(colWidth-130-5)"
                :pHeight="200"
                :pMarginTop="10"
                :pMarginLeft="130"
                :pMarginRight="5"
                :pMarginBottom="5"

                :showDownloadButton="true"
                :downloadButtonSize="12"
                :downloadButtonOffsetY="22"
                :downloadButtonOffsetX="20"
                :showResizeButton="true"
                :resizeButtonSize="12"
                :downloadName="('explosig_sample_mutation_profile_reconstruction_SBS_' + sampleId)"
            >
                <Axis 
                    slot="axisLeft"
                    :variable="('reconstruction_SBS_' + sampleId)"
                    side="left"

                    :getScale="getScale"
                    :getStack="getStack"
                />
                <BarPlot 
                    slot="plot"
                    :data="('reconstruction_SBS_' + sampleId)"
                    x="cat_SBS"
                    :y="('reconstruction_SBS_' + sampleId)"
                    :getData="getData"
                    :getScale="getScale"
                />
            </PlotContainer>

            <PlotContainer
                :pWidth="(colWidth-130-5)"
                :pHeight="200"
                :pMarginTop="10"
                :pMarginLeft="130"
                :pMarginRight="5"
                :pMarginBottom="5"

                :showDownloadButton="true"
                :downloadButtonSize="12"
                :downloadButtonOffsetY="22"
                :downloadButtonOffsetX="20"
                :showResizeButton="true"
                :resizeButtonSize="12"
                :downloadName="('explosig_sample_mutation_profile_reconstruction_error_SBS_' + sampleId)"
            >
                <Axis 
                    slot="axisLeft"
                    :variable="('error_SBS_' + sampleId)"
                    side="left"

                    :getScale="getScale"
                    :getStack="getStack"
                />
                <BarPlot 
                    slot="plot"
                    :data="('error_SBS_' + sampleId)"
                    x="cat_SBS"
                    :y="('error_SBS_' + sampleId)"
                    :getData="getData"
                    :getScale="getScale"
                />
            </PlotContainer>

            <PlotContainer
                :pWidth="(colWidth-130-5)"
                :pHeight="0"
                :pMarginTop="0"
                :pMarginLeft="130"
                :pMarginRight="5"
                :pMarginBottom="200"

                :showDownloadButton="true"
                :downloadButtonSize="12"
                :downloadButtonOffsetY="22"
                :downloadButtonOffsetX="20"
                downloadName="explosig_sample_mutation_profile_categories_SBS"
            >
                <Axis 
                    slot="axisBottom"
                    variable="cat_SBS"
                    side="bottom"
                    :tickRotation="-65"
                    :disableBrushing="true"
                    :getScale="getScale"
                    :getStack="getStack"
                    :autoRemoveTicks="false"
                />
            </PlotContainer>
        </div>

        <div v-if="showDbs">
            <p class="sample-cosine-similarity">DBS Reconstruction Cosine Similarity: {{ cosineSimilarityDbs }}</p>
            <PlotContainer
                :pWidth="(colWidth-130-5)"
                :pHeight="200"
                :pMarginTop="10"
                :pMarginLeft="130"
                :pMarginRight="5"
                :pMarginBottom="5"

                :showDownloadButton="true"
                :downloadButtonSize="12"
                :downloadButtonOffsetY="22"
                :downloadButtonOffsetX="20"
                :showResizeButton="true"
                :resizeButtonSize="12"
                :downloadName="('explosig_sample_mutation_profile_true_DBS_' + sampleId)"
            >
                <Axis 
                    slot="axisLeft"
                    :variable="('count_DBS_' + sampleId)"
                    side="left"

                    :getScale="getScale"
                    :getStack="getStack"
                />
                <BarPlot 
                    slot="plot"
                    :data="('count_DBS_' + sampleId)"
                    x="cat_DBS"
                    :y="('count_DBS_' + sampleId)"
                    :getData="getData"
                    :getScale="getScale"
                />
            </PlotContainer>

            <PlotContainer
                :pWidth="(colWidth-130-5)"
                :pHeight="200"
                :pMarginTop="10"
                :pMarginLeft="130"
                :pMarginRight="5"
                :pMarginBottom="5"

                :showDownloadButton="true"
                :downloadButtonSize="12"
                :downloadButtonOffsetY="22"
                :downloadButtonOffsetX="20"
                :showResizeButton="true"
                :resizeButtonSize="12"
                :downloadName="('explosig_sample_mutation_profile_reconstruction_DBS_' + sampleId)"
            >
                <Axis 
                    slot="axisLeft"
                    :variable="('reconstruction_DBS_' + sampleId)"
                    side="left"

                    :getScale="getScale"
                    :getStack="getStack"
                />
                <BarPlot 
                    slot="plot"
                    :data="('reconstruction_DBS_' + sampleId)"
                    x="cat_DBS"
                    :y="('reconstruction_DBS_' + sampleId)"
                    :getData="getData"
                    :getScale="getScale"
                />
            </PlotContainer>

            <PlotContainer
                :pWidth="(colWidth-130-5)"
                :pHeight="200"
                :pMarginTop="10"
                :pMarginLeft="130"
                :pMarginRight="5"
                :pMarginBottom="5"

                :showDownloadButton="true"
                :downloadButtonSize="12"
                :downloadButtonOffsetY="22"
                :downloadButtonOffsetX="20"
                :showResizeButton="true"
                :resizeButtonSize="12"
                :downloadName="('explosig_sample_mutation_profile_reconstruction_error_DBS_' + sampleId)"
            >
                <Axis 
                    slot="axisLeft"
                    :variable="('error_DBS_' + sampleId)"
                    side="left"

                    :getScale="getScale"
                    :getStack="getStack"
                />
                <BarPlot 
                    slot="plot"
                    :data="('error_DBS_' + sampleId)"
                    x="cat_DBS"
                    :y="('error_DBS_' + sampleId)"
                    :getData="getData"
                    :getScale="getScale"
                />
            </PlotContainer>

            <PlotContainer
                :pWidth="(colWidth-130-5)"
                :pHeight="0"
                :pMarginTop="0"
                :pMarginLeft="130"
                :pMarginRight="5"
                :pMarginBottom="200"

                :showDownloadButton="true"
                :downloadButtonSize="12"
                :downloadButtonOffsetY="22"
                :downloadButtonOffsetX="20"
                downloadName="explosig_sample_mutation_profile_categories_DBS"
            >
                <Axis 
                    slot="axisBottom"
                    variable="cat_DBS"
                    side="bottom"
                    :tickRotation="-65"
                    :disableBrushing="true"
                    :getScale="getScale"
                    :getStack="getStack"
                    :autoRemoveTicks="false"
                />
            </PlotContainer>
        </div>

        <div v-if="showIndel">
            <p class="sample-cosine-similarity">INDEL Reconstruction Cosine Similarity: {{ cosineSimilarityIndel }}</p>
            <PlotContainer
                :pWidth="(colWidth-130-5)"
                :pHeight="200"
                :pMarginTop="10"
                :pMarginLeft="130"
                :pMarginRight="5"
                :pMarginBottom="5"

                :showDownloadButton="true"
                :downloadButtonSize="12"
                :downloadButtonOffsetY="22"
                :downloadButtonOffsetX="20"
                :showResizeButton="true"
                :resizeButtonSize="12"
                :downloadName="('explosig_sample_mutation_profile_true_INDEL_' + sampleId)"
            >
                <Axis 
                    slot="axisLeft"
                    :variable="('count_INDEL_' + sampleId)"
                    side="left"

                    :getScale="getScale"
                    :getStack="getStack"
                />
                <BarPlot 
                    slot="plot"
                    :data="('count_INDEL_' + sampleId)"
                    x="cat_INDEL"
                    :y="('count_INDEL_' + sampleId)"
                    :getData="getData"
                    :getScale="getScale"
                />
            </PlotContainer>

            <PlotContainer
                :pWidth="(colWidth-130-5)"
                :pHeight="200"
                :pMarginTop="10"
                :pMarginLeft="130"
                :pMarginRight="5"
                :pMarginBottom="5"

                :showDownloadButton="true"
                :downloadButtonSize="12"
                :downloadButtonOffsetY="22"
                :downloadButtonOffsetX="20"
                :showResizeButton="true"
                :resizeButtonSize="12"
                :downloadName="('explosig_sample_mutation_profile_reconstruction_INDEL_' + sampleId)"
            >
                <Axis 
                    slot="axisLeft"
                    :variable="('reconstruction_INDEL_' + sampleId)"
                    side="left"

                    :getScale="getScale"
                    :getStack="getStack"
                />
                <BarPlot 
                    slot="plot"
                    :data="('reconstruction_INDEL_' + sampleId)"
                    x="cat_INDEL"
                    :y="('reconstruction_INDEL_' + sampleId)"
                    :getData="getData"
                    :getScale="getScale"
                />
            </PlotContainer>

            <PlotContainer
                :pWidth="(colWidth-130-5)"
                :pHeight="200"
                :pMarginTop="10"
                :pMarginLeft="130"
                :pMarginRight="5"
                :pMarginBottom="5"

                :showDownloadButton="true"
                :downloadButtonSize="12"
                :downloadButtonOffsetY="22"
                :downloadButtonOffsetX="20"
                :showResizeButton="true"
                :resizeButtonSize="12"
                :downloadName="('explosig_sample_mutation_profile_reconstruction_error_INDEL_' + sampleId)"
            >
                <Axis 
                    slot="axisLeft"
                    :variable="('error_INDEL_' + sampleId)"
                    side="left"

                    :getScale="getScale"
                    :getStack="getStack"
                />
                <BarPlot 
                    slot="plot"
                    :data="('error_INDEL_' + sampleId)"
                    x="cat_INDEL"
                    :y="('error_INDEL_' + sampleId)"
                    :getData="getData"
                    :getScale="getScale"
                />
            </PlotContainer>

            <PlotContainer
                :pWidth="(colWidth-130-5)"
                :pHeight="0"
                :pMarginTop="0"
                :pMarginLeft="130"
                :pMarginRight="5"
                :pMarginBottom="200"

                :showDownloadButton="true"
                :downloadButtonSize="12"
                :downloadButtonOffsetY="22"
                :downloadButtonOffsetX="20"
                downloadName="explosig_sample_mutation_profile_categories_INDEL"
            >
                <Axis 
                    slot="axisBottom"
                    variable="cat_INDEL"
                    side="bottom"
                    :tickRotation="-65"
                    :disableBrushing="true"
                    :getScale="getScale"
                    :getStack="getStack"
                    :autoRemoveTicks="false"
                />
            </PlotContainer>
        </div>
 
    </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import { min as d3_min, max as d3_max, sum as d3_sum } from 'd3-array';
import PlotInfo from './PlotInfo.vue';
import API from './../api.js';

import { CategoricalScale, ContinuousScale, GenomeScale, DataContainer } from 'vueplotlib';
import { EXPLORER_COLUMNS } from '../vdp/Sizes';

export default {
    name: 'ExplorerOverviewSample',
    components: {
        PlotInfo
    },
    data() {
        return {
            sampleId: "",
            cosineSimilaritySbs: "Loading...",
            cosineSimilarityDbs: "Loading...",
            cosineSimilarityIndel: "Loading...",
            genes: {},
            clinical: {}
        };
    },
    created() {
        this.sampleId = this.getSamples().activeSample;
        this.initScalesAndData();
        this.initGeneAndClinicalValues();
    },
    methods: {
        unhighlightSample() {
            this.getScale("sample_id").emitHighlightDestroy();
        },
        highlightSample() {
            this.getScale("sample_id").emitHighlight(this.sampleId);
        },
        initGeneAndClinicalValues() {
            for(const geneId of this.getConfig().selectedGenes) {
                const geneMutValue = this.getData(("gene_mut_" + geneId)).dataCopy.find(el => el["sample_id"] === this.sampleId)["mut_class"];
                this.genes[("gene_mut_" + geneId)] = this.getScale("mut_class").toHuman(geneMutValue);

                const geneExpValue = this.getData(("gene_exp_" + geneId)).dataCopy.find(el => el["sample_id"] === this.sampleId)["gene_expression"];
                this.genes[("gene_exp_" + geneId)] = this.getScale("gene_expression").toHuman(geneExpValue);

                const geneCNAValue = this.getData(("gene_cna_" + geneId)).dataCopy.find(el => el["sample_id"] === this.sampleId)["copy_number"];
                this.genes[("gene_cna_" + geneId)] = this.getScale("copy_number").toHuman(geneCNAValue);
            }

            for(const clinicalVar of this.getConfig().selectedClinicalVariables) {
                const clinicalValue = this.getData("clinical_data").dataCopy.find(el => el["sample_id"] === this.sampleId)[clinicalVar];
                this.clinical[clinicalVar] = this.getScale(clinicalVar).toHuman(clinicalValue);
            }
        },
        initScalesAndData() {
            /*
                SBS
            */
            if(this.showSbs) {
                API.fetchPlotReconstructionCosineSimilaritySingleSample({
                    "projects": this.getConfig().selectedSamples,
                    "signatures": this.getConfig().selectedSignaturesSbs,
                    "mut_type": "SBS",
                    "sample_id": this.sampleId,
                    "tricounts_method": this.getConfig().selectedTricountsMethod
                }).then((data) => {
                    this.cosineSimilaritySbs = data["cosine_similarity_SBS"];
                });

                // EXPOSURES
                if(this.getData("exp_SBS_" + this.sampleId) === undefined) {
                    const expsSbsData = new DataContainer("exp_SBS_" + this.sampleId, "SBS Exposures for " + this.sampleId, API.fetchPlotExposuresSingleSample({
                        "projects": this.getConfig().selectedSamples,
                        "signatures": this.getConfig().selectedSignaturesSbs,
                        "mut_type": "SBS",
                        "sample_id": this.sampleId,
                        "tricounts_method": this.getConfig().selectedTricountsMethod
                    }));
                    this.setData({key: "exp_SBS_" + this.sampleId, data: expsSbsData});
                }
                if(this.getScale("exp_SBS_" + this.sampleId) === undefined) {
                    const expsSbsScale = new ContinuousScale("exp_SBS_" + this.sampleId, "SBS Exposure", API.fetchPlotExposuresSingleSample({
                        "projects": this.getConfig().selectedSamples,
                        "signatures": this.getConfig().selectedSignaturesSbs,
                        "mut_type": "SBS",
                        "sample_id": this.sampleId,
                        "tricounts_method": this.getConfig().selectedTricountsMethod
                    }).then((data) => {
                        return [0, d3_max(data.map(d => d["exp_SBS_" + this.sampleId]))];
                    }));
                    this.setScale({key: "exp_SBS_" + this.sampleId, scale: expsSbsScale});
                }


                // COUNTS
                if(this.getData("count_SBS_" + this.sampleId) === undefined) {
                    const countsSbsData = new DataContainer("count_SBS_" + this.sampleId, "SBS Counts for " + this.sampleId, API.fetchPlotCountsPerCategorySingleSample({
                        "projects": this.getConfig().selectedSamples,
                        "signatures": this.getConfig().selectedSignaturesSbs,
                        "mut_type": "SBS",
                        "sample_id": this.sampleId,
                        "tricounts_method": this.getConfig().selectedTricountsMethod
                    }));
                    this.setData({key: "count_SBS_" + this.sampleId, data: countsSbsData});
                }
                if(this.getScale("count_SBS_" + this.sampleId) === undefined) {
                    const countsSbsScale = new ContinuousScale("count_SBS_" + this.sampleId, "SBS Category Count", API.fetchPlotCountsPerCategorySingleSample({
                        "projects": this.getConfig().selectedSamples,
                        "signatures": this.getConfig().selectedSignaturesSbs,
                        "mut_type": "SBS",
                        "sample_id": this.sampleId,
                        "tricounts_method": this.getConfig().selectedTricountsMethod
                    }).then((data) => {
                        return [0, d3_max(data.map(d => d["count_SBS_" + this.sampleId]))];
                    }));
                    this.setScale({key: "count_SBS_" + this.sampleId, scale: countsSbsScale});
                }

                // RECONSTRUCTION
                if(this.getData("reconstruction_SBS_" + this.sampleId) === undefined) {
                    const reconstructionSbsData = new DataContainer("reconstruction_SBS_" + this.sampleId, "SBS Reconstruction for " + this.sampleId, API.fetchPlotReconstructionSingleSample({
                        "projects": this.getConfig().selectedSamples,
                        "signatures": this.getConfig().selectedSignaturesSbs,
                        "mut_type": "SBS",
                        "sample_id": this.sampleId,
                        "tricounts_method": this.getConfig().selectedTricountsMethod
                    }));
                    this.setData({key: "reconstruction_SBS_" + this.sampleId, data: reconstructionSbsData});
                }

                if(this.getScale("reconstruction_SBS_" + this.sampleId) === undefined) {
                    const reconstructionSbsScale = new ContinuousScale("reconstruction_SBS_" + this.sampleId, "SBS Category Reconstruction", API.fetchPlotReconstructionSingleSample({
                        "projects": this.getConfig().selectedSamples,
                        "signatures": this.getConfig().selectedSignaturesSbs,
                        "mut_type": "SBS",
                        "sample_id": this.sampleId,
                        "tricounts_method": this.getConfig().selectedTricountsMethod
                    }).then((data) => {
                        return [0, d3_max(data.map(d => d["reconstruction_SBS_" + this.sampleId]))];
                    }));
                    this.setScale({key: "reconstruction_SBS_" + this.sampleId, scale: reconstructionSbsScale});
                }

                // RECONSTRUCTION ERROR
                if(this.getData("error_SBS_" + this.sampleId) === undefined) {
                    const errorSbsData = new DataContainer("error_SBS_" + this.sampleId, "SBS Reconstruction Error for " + this.sampleId, API.fetchPlotReconstructionErrorSingleSample({
                        "projects": this.getConfig().selectedSamples,
                        "signatures": this.getConfig().selectedSignaturesSbs,
                        "mut_type": "SBS",
                        "sample_id": this.sampleId,
                        "tricounts_method": this.getConfig().selectedTricountsMethod
                    }));
                    this.setData({key: "error_SBS_" + this.sampleId, data: errorSbsData});
                }

                if(this.getScale("error_SBS_" + this.sampleId) === undefined) {
                    const errorSbsScale = new ContinuousScale("error_SBS_" + this.sampleId, "SBS Error", API.fetchPlotReconstructionErrorSingleSample({
                        "projects": this.getConfig().selectedSamples,
                        "signatures": this.getConfig().selectedSignaturesSbs,
                        "mut_type": "SBS",
                        "sample_id": this.sampleId,
                        "tricounts_method": this.getConfig().selectedTricountsMethod
                    }).then((data) => {
                        return [
                            d3_min(data.map(d => d["error_SBS_" + this.sampleId])), 
                            d3_max(data.map(d => d["error_SBS_" + this.sampleId]))
                        ];
                    }));
                    this.setScale({key: "error_SBS_" + this.sampleId, scale: errorSbsScale});
                }
            }

            /*
                DBS
            */
            if(this.showDbs) {
                API.fetchPlotReconstructionCosineSimilaritySingleSample({
                    "projects": this.getConfig().selectedSamples,
                    "signatures": this.getConfig().selectedSignaturesDbs,
                    "mut_type": "DBS",
                    "sample_id": this.sampleId,
                    "tricounts_method": this.getConfig().selectedTricountsMethod
                }).then((data) => {
                    this.cosineSimilarityDbs = data["cosine_similarity_DBS"];
                });

                // EXPOSURES
                if(this.getData("exp_DBS_" + this.sampleId) === undefined) {
                    const expsDbsData = new DataContainer("exp_DBS_" + this.sampleId, "DBS Exposures for " + this.sampleId, API.fetchPlotExposuresSingleSample({
                        "projects": this.getConfig().selectedSamples,
                        "signatures": this.getConfig().selectedSignaturesDbs,
                        "mut_type": "DBS",
                        "sample_id": this.sampleId,
                        "tricounts_method": this.getConfig().selectedTricountsMethod
                    }));
                    this.setData({key: "exp_DBS_" + this.sampleId, data: expsDbsData});
                }
                if(this.getScale("exp_DBS_" + this.sampleId) === undefined) {
                    const expsDbsScale = new ContinuousScale("exp_DBS_" + this.sampleId, "DBS Exposure", API.fetchPlotExposuresSingleSample({
                        "projects": this.getConfig().selectedSamples,
                        "signatures": this.getConfig().selectedSignaturesDbs,
                        "mut_type": "DBS",
                        "sample_id": this.sampleId,
                        "tricounts_method": this.getConfig().selectedTricountsMethod
                    }).then((data) => {
                        return [0, d3_max(data.map(d => d["exp_DBS_" + this.sampleId]))];
                    }));
                    this.setScale({key: "exp_DBS_" + this.sampleId, scale: expsDbsScale});
                }

                // COUNTS
                if(this.getData("count_DBS_" + this.sampleId) === undefined) {
                    const countsDbsData = new DataContainer("count_DBS_" + this.sampleId, "DBS Counts for " + this.sampleId, API.fetchPlotCountsPerCategorySingleSample({
                        "projects": this.getConfig().selectedSamples,
                        "signatures": this.getConfig().selectedSignaturesDbs,
                        "mut_type": "DBS",
                        "sample_id": this.sampleId,
                        "tricounts_method": this.getConfig().selectedTricountsMethod
                    }));
                    this.setData({key: "count_DBS_" + this.sampleId, data: countsDbsData});
                }
                if(this.getScale("count_DBS_" + this.sampleId) === undefined) {
                    const countsDbsScale = new ContinuousScale("count_DBS_" + this.sampleId, "DBS Category Count", API.fetchPlotCountsPerCategorySingleSample({
                        "projects": this.getConfig().selectedSamples,
                        "signatures": this.getConfig().selectedSignaturesDbs,
                        "mut_type": "DBS",
                        "sample_id": this.sampleId,
                        "tricounts_method": this.getConfig().selectedTricountsMethod
                    }).then((data) => {
                        return [0, d3_max(data.map(d => d["count_DBS_" + this.sampleId]))];
                    }));
                    this.setScale({key: "count_DBS_" + this.sampleId, scale: countsDbsScale});
                }

                // RECONSTRUCTION
                if(this.getData("reconstruction_DBS_" + this.sampleId) === undefined) {
                    const reconstructionDbsData = new DataContainer("reconstruction_DBS_" + this.sampleId, "DBS Reconstruction for " + this.sampleId, API.fetchPlotReconstructionSingleSample({
                        "projects": this.getConfig().selectedSamples,
                        "signatures": this.getConfig().selectedSignaturesDbs,
                        "mut_type": "DBS",
                        "sample_id": this.sampleId,
                        "tricounts_method": this.getConfig().selectedTricountsMethod
                    }));
                    this.setData({key: "reconstruction_DBS_" + this.sampleId, data: reconstructionDbsData});
                }

                if(this.getScale("reconstruction_DBS_" + this.sampleId) === undefined) {
                    const reconstructionDbsScale = new ContinuousScale("reconstruction_DBS_" + this.sampleId, "DBS Category Reconstruction", API.fetchPlotReconstructionSingleSample({
                        "projects": this.getConfig().selectedSamples,
                        "signatures": this.getConfig().selectedSignaturesDbs,
                        "mut_type": "DBS",
                        "sample_id": this.sampleId,
                        "tricounts_method": this.getConfig().selectedTricountsMethod
                    }).then((data) => {
                        return [0, d3_max(data.map(d => d["reconstruction_DBS_" + this.sampleId]))];
                    }));
                    this.setScale({key: "reconstruction_DBS_" + this.sampleId, scale: reconstructionDbsScale});
                }

                // RECONSTRUCTION ERROR
                if(this.getData("error_DBS_" + this.sampleId) === undefined) {
                    const errorDbsData = new DataContainer("error_DBS_" + this.sampleId, "DBS Reconstruction Error for " + this.sampleId, API.fetchPlotReconstructionErrorSingleSample({
                        "projects": this.getConfig().selectedSamples,
                        "signatures": this.getConfig().selectedSignaturesDbs,
                        "mut_type": "DBS",
                        "sample_id": this.sampleId,
                        "tricounts_method": this.getConfig().selectedTricountsMethod
                    }));
                    this.setData({key: "error_DBS_" + this.sampleId, data: errorDbsData});
                }

                if(this.getScale("error_DBS_" + this.sampleId) === undefined) {
                    const errorDbsScale = new ContinuousScale("error_DBS_" + this.sampleId, "DBS Error", API.fetchPlotReconstructionErrorSingleSample({
                        "projects": this.getConfig().selectedSamples,
                        "signatures": this.getConfig().selectedSignaturesDbs,
                        "mut_type": "DBS",
                        "sample_id": this.sampleId,
                        "tricounts_method": this.getConfig().selectedTricountsMethod
                    }).then((data) => {
                        return [
                            d3_min(data.map(d => d["error_DBS_" + this.sampleId])), 
                            d3_max(data.map(d => d["error_DBS_" + this.sampleId]))
                        ];
                    }));
                    this.setScale({key: "error_DBS_" + this.sampleId, scale: errorDbsScale});
                }
            }

            /*
                INDEL
            */
            if(this.showIndel) {
                API.fetchPlotReconstructionCosineSimilaritySingleSample({
                    "projects": this.getConfig().selectedSamples,
                    "signatures": this.getConfig().selectedSignaturesIndel,
                    "mut_type": "INDEL",
                    "sample_id": this.sampleId,
                    "tricounts_method": this.getConfig().selectedTricountsMethod
                }).then((data) => {
                    this.cosineSimilarityIndel = data["cosine_similarity_INDEL"];
                });

                // EXPOSURES
                if(this.getData("exp_INDEL_" + this.sampleId) === undefined) {
                    const expsIndelData = new DataContainer("exp_INDEL_" + this.sampleId, "INDEL Exposures for " + this.sampleId, API.fetchPlotExposuresSingleSample({
                        "projects": this.getConfig().selectedSamples,
                        "signatures": this.getConfig().selectedSignaturesIndel,
                        "mut_type": "INDEL",
                        "sample_id": this.sampleId,
                        "tricounts_method": this.getConfig().selectedTricountsMethod
                    }));
                    this.setData({key: "exp_INDEL_" + this.sampleId, data: expsIndelData});
                }
                if(this.getScale("exp_INDEL_" + this.sampleId) === undefined) {
                    const expsIndelScale = new ContinuousScale("exp_INDEL_" + this.sampleId, "INDEL Exposure", API.fetchPlotExposuresSingleSample({
                        "projects": this.getConfig().selectedSamples,
                        "signatures": this.getConfig().selectedSignaturesIndel,
                        "mut_type": "INDEL",
                        "sample_id": this.sampleId,
                        "tricounts_method": this.getConfig().selectedTricountsMethod
                    }).then((data) => {
                        return [0, d3_max(data.map(d => d["exp_INDEL_" + this.sampleId]))];
                    }));
                    this.setScale({key: "exp_INDEL_" + this.sampleId, scale: expsIndelScale});
                }


                // COUNTS
                if(this.getData("count_INDEL_" + this.sampleId) === undefined) {
                    const countsIndelData = new DataContainer("count_INDEL_" + this.sampleId, "INDEL Counts for " + this.sampleId, API.fetchPlotCountsPerCategorySingleSample({
                        "projects": this.getConfig().selectedSamples,
                        "signatures": this.getConfig().selectedSignaturesIndel,
                        "mut_type": "INDEL",
                        "sample_id": this.sampleId,
                        "tricounts_method": this.getConfig().selectedTricountsMethod
                    }));
                    this.setData({key: "count_INDEL_" + this.sampleId, data: countsIndelData});
                }
                if(this.getScale("count_INDEL_" + this.sampleId) === undefined) {
                    const countsIndelScale = new ContinuousScale("count_INDEL_" + this.sampleId, "INDEL Category Count", API.fetchPlotCountsPerCategorySingleSample({
                        "projects": this.getConfig().selectedSamples,
                        "signatures": this.getConfig().selectedSignaturesIndel,
                        "mut_type": "INDEL",
                        "sample_id": this.sampleId,
                        "tricounts_method": this.getConfig().selectedTricountsMethod
                    }).then((data) => {
                        return [0, d3_max(data.map(d => d["count_INDEL_" + this.sampleId]))];
                    }));
                    this.setScale({key: "count_INDEL_" + this.sampleId, scale: countsIndelScale});
                }

                // RECONSTRUCTION
                if(this.getData("reconstruction_INDEL_" + this.sampleId) === undefined) {
                    const reconstructionIndelData = new DataContainer("reconstruction_INDEL_" + this.sampleId, "INDEL Reconstruction for " + this.sampleId, API.fetchPlotReconstructionSingleSample({
                        "projects": this.getConfig().selectedSamples,
                        "signatures": this.getConfig().selectedSignaturesIndel,
                        "mut_type": "INDEL",
                        "sample_id": this.sampleId,
                        "tricounts_method": this.getConfig().selectedTricountsMethod
                    }));
                    this.setData({key: "reconstruction_INDEL_" + this.sampleId, data: reconstructionIndelData});
                }

                if(this.getScale("reconstruction_INDEL_" + this.sampleId) === undefined) {
                    const reconstructionIndelScale = new ContinuousScale("reconstruction_INDEL_" + this.sampleId, "INDEL Category Reconstruction", API.fetchPlotReconstructionSingleSample({
                        "projects": this.getConfig().selectedSamples,
                        "signatures": this.getConfig().selectedSignaturesIndel,
                        "mut_type": "INDEL",
                        "sample_id": this.sampleId,
                        "tricounts_method": this.getConfig().selectedTricountsMethod
                    }).then((data) => {
                        return [0, d3_max(data.map(d => d["reconstruction_INDEL_" + this.sampleId]))];
                    }));
                    this.setScale({key: "reconstruction_INDEL_" + this.sampleId, scale: reconstructionIndelScale});
                }

                // RECONSTRUCTION ERROR
                if(this.getData("error_INDEL_" + this.sampleId) === undefined) {
                    const errorIndelData = new DataContainer("error_INDEL_" + this.sampleId, "INDEL Reconstruction Error for " + this.sampleId, API.fetchPlotReconstructionErrorSingleSample({
                        "projects": this.getConfig().selectedSamples,
                        "signatures": this.getConfig().selectedSignaturesIndel,
                        "mut_type": "INDEL",
                        "sample_id": this.sampleId,
                        "tricounts_method": this.getConfig().selectedTricountsMethod
                    }));
                    this.setData({key: "error_INDEL_" + this.sampleId, data: errorIndelData});
                }

                if(this.getScale("error_INDEL_" + this.sampleId) === undefined) {
                    const errorIndelScale = new ContinuousScale("error_INDEL_" + this.sampleId, "INDEL Error", API.fetchPlotReconstructionErrorSingleSample({
                        "projects": this.getConfig().selectedSamples,
                        "signatures": this.getConfig().selectedSignaturesIndel,
                        "mut_type": "INDEL",
                        "sample_id": this.sampleId,
                        "tricounts_method": this.getConfig().selectedTricountsMethod
                    }).then((data) => {
                        return [
                            d3_min(data.map(d => d["error_INDEL_" + this.sampleId])), 
                            d3_max(data.map(d => d["error_INDEL_" + this.sampleId]))
                        ];
                    }));
                    this.setScale({key: "error_INDEL_" + this.sampleId, scale: errorIndelScale});
                }
            }


        },
        ...mapMutations([
            'setData',
            'setScale',
            'setSamples'
        ])
    },
    computed: {
        colWidth() {
            return this.windowWidth * this.getSizes().columns[EXPLORER_COLUMNS.OVERVIEW] - 25;
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
        numClinicalVariables() {
            return (this.getConfig().selectedClinicalVariables.length);
        },
        selectedClinicalVariables() {
            return (this.getConfig().selectedClinicalVariables);
        },
        selectedClinicalData() {
            return Array.from(new Array(this.getConfig().selectedClinicalVariables.length), () => "clinical_data");
        },
        selectedGenesMutData() {
            return this.getConfig().selectedGenes.map(g => `gene_mut_${g}`);
        },
        selectedGenesMutScales() {
            return Array.from(new Array(this.getConfig().selectedGenes.length), () => "mut_class");
        },
        selectedGenesExpData() {
            return this.getConfig().selectedGenes.map(g => `gene_exp_${g}`);
        },
        selectedGenesExpScales() {
            return Array.from(new Array(this.getConfig().selectedGenes.length), () => "gene_expression");
        },
        selectedGenesCNAData() {
            return this.getConfig().selectedGenes.map(g => `gene_cna_${g}`);
        },
        selectedGenesCNAScales() {
            return Array.from(new Array(this.getConfig().selectedGenes.length), () => "copy_number");
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
            'getSamples',
            'getSizes'
        ])
    }
}
</script>

<style scoped lang="scss">
@import './../style/variables.scss';

.sample-title {
    text-align: center;
}
.sample-cosine-similarity {
    width: 100%;
    text-align: center;
}

.gene-rects-wrapper, .clinical-rects-wrapper {
    position: relative;
}

.gene-axis-wrapper, .clinical-axis-wrapper {
    position: absolute;
    margin-top: -2.5px;
}

.gene-value, .clinical-value {
    height: 25px;
    font-size: 13px;
    line-height: 25px;
    margin-left: 5px;
}

.gene-data-type-divider {
    width: 100%;
    height: 10px;
}

</style>
