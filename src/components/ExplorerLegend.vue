<template>
    <div class="explosig-col-container-immediate">
        <button class="download-all" @click="downloadAll">Download All Legends</button>
        <CategoricalLegend
            variable="proj_id"
            lStyle="bar"
            :lWidth="colWidth"
            :getScale="getScale"
            :getStack="getStack"
            :showDownloadButton="true"
            downloadName="explosig_legend_proj_id"
            ref="legend_0000"
        />
        
        <!-- make a fake legend for whether or not to do trinucleotide normalization -->
        <div class="tricounts-method-legend">
            <span class="tricounts-method-legend-title">Trinucleotide Normalization</span>
            <div>
                <span class="tricounts-method-legend-item-left">
                    <input type="checkbox" :checked="selectedTricountsMethod === 'By Study'" disabled="true" />
                </span>
                <span class="tricounts-method-legend-item-right" title="Whether or not to normalize trinucleotides by frequency based on sequencing strategy of each cohort">
                    By Study
                </span>
            </div>
        </div>

        <CategoricalLegend
            variable="mut_type"
            lStyle="bar"
            :lWidth="colWidth"
            :getScale="getScale"
            :getStack="getStack"
            :showDownloadButton="true"
            downloadName="explosig_legend_mut_type"
            ref="legend_0010"
        />
        <CategoricalLegend v-if="showSbs"
            variable="sig_SBS"
            lStyle="bar"
            :lWidth="colWidth"
            :getScale="getScale"
            :getStack="getStack"
            :clickHandler="(sigName) => clickSignature(sigName, 'SBS')"
            :showDownloadButton="true"
            downloadName="explosig_legend_sig_SBS"
            ref="legend_0020"
        />
        <CategoricalLegend v-if="showDbs"
            variable="sig_DBS"
            lStyle="bar"
            :lWidth="colWidth"
            :getScale="getScale"
            :getStack="getStack"
            :clickHandler="(sigName) => clickSignature(sigName, 'DBS')"
            :showDownloadButton="true"
            downloadName="explosig_legend_sig_DBS"
            ref="legend_0030"
        />
        <CategoricalLegend v-if="showIndel"
            variable="sig_INDEL"
            lStyle="bar"
            :lWidth="colWidth"
            :getScale="getScale"
            :getStack="getStack"
            :clickHandler="(sigName) => clickSignature(sigName, 'INDEL')"
            :showDownloadButton="true"
            downloadName="explosig_legend_sig_INDEL"
            ref="legend_0040"
        />
        <CategoricalLegend v-if="showGenes"
            variable="mut_class"
            lStyle="bar"
            :lWidth="colWidth"
            :getScale="getScale"
            :getStack="getStack"
            :showDownloadButton="true"
            downloadName="explosig_legend_mut_class"
            ref="legend_0050"
        />
        <CategoricalLegend v-if="showGenes"
            variable="gene_expression"
            lStyle="bar"
            :lWidth="colWidth"
            :getScale="getScale"
            :getStack="getStack"
            :showDownloadButton="true"
            downloadName="explosig_legend_gene_expression"
            ref="legend_0060"
        />
        <CategoricalLegend v-if="showGenes"
            variable="copy_number"
            lStyle="bar"
            :lWidth="colWidth"
            :getScale="getScale"
            :getStack="getStack"
            :showDownloadButton="true"
            downloadName="explosig_legend_copy_number"
            ref="legend_0070"
        />
        <!-- Clinical Variables -->
        <div v-if="showClinical">
            <div v-for="(clinicalVar, index) in selectedClinicalVariables" :key="clinicalVar">
                <Legend
                    :variable="clinicalVar"
                    lStyle="bar"
                    :lWidth="colWidth"
                    :getScale="getScale"
                    :getStack="getStack"
                    :showDownloadButton="true"
                    :downloadName="('explosig_legend_clinical_' + clinicalVar)"
                    :ref="('legend_0080_' + index)"
                />
            </div>
        </div>

        <ContinuousLegend v-if="showSbs"
            variable="exposure_sbs_normalized"
            lStyle="bar"
            :lWidth="colWidth"
            :getScale="getScale"
            :getStack="getStack"
            :showDownloadButton="true"
            downloadName="explosig_legend_exposure_normalized_SBS"
            ref="legend_0090"
        />
        <ContinuousLegend v-if="showDbs"
            variable="exposure_dbs_normalized"
            lStyle="bar"
            :lWidth="colWidth"
            :getScale="getScale"
            :getStack="getStack"
            :showDownloadButton="true"
            downloadName="explosig_legend_exposure_normalized_DBS"
            ref="legend_0100"
        />
        <ContinuousLegend v-if="showIndel"
            variable="exposure_indel_normalized"
            lStyle="bar"
            :lWidth="colWidth"
            :getScale="getScale"
            :getStack="getStack"
            :showDownloadButton="true"
            downloadName="explosig_legend_exposure_normalized_INDEL"
            ref="legend_0110"
        />

        <SignatureModal :clickedSignature="clickedSignature" :clickedMutType="clickedMutType" @close-modal="unclickSignature" />
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

import { EXPLORER_COLUMNS } from './../vdp/Sizes.js';

import SignatureModal from './SignatureModal.vue';

import { create as d3_create } from 'd3';
import { downloadSvg } from 'vueplotlib';

export default {
    name: 'ExplorerLegend',
    components: {
        SignatureModal
    },
    data() {
        return {
            selectedClinicalVariables: [],
            selectedGenes: [],
            clickedSignature: null,
            clickedMutType: null,
        }
    },
    mounted() {
        const cvScale = this.getScale("clinical_variable");
        this.selectedClinicalVariables = cvScale.domain;
        cvScale.onUpdate("explorer_legend", () => {
            this.selectedClinicalVariables = cvScale.domain;
        });

        const gScale = this.getScale("gene_mut");
        this.selectedGenes = gScale.domain;
        gScale.onUpdate("gene_tracks", () => {
            this.selectedGenes = gScale.domain;
        });
    },
    computed: {
        colWidth() {
            return this.windowWidth * this.getSizes().columns[EXPLORER_COLUMNS.LEGEND] - 25;
        },
        showSbs() {
            return (this.isEmptySession || this.getConfig().selectedSignaturesSbs.length > 0);
        },
        showDbs() {
            return (this.isEmptySession || this.getConfig().selectedSignaturesDbs.length > 0);
        },
        showIndel() {
            return (this.isEmptySession || this.getConfig().selectedSignaturesIndel.length > 0);
        },
        showGenes() {
            return (this.selectedGenes.length > 0);
        },
        showClinical() {
            return (this.selectedClinicalVariables.length > 0);
        },
        selectedTricountsMethod() {
            return (this.getConfig().selectedTricountsMethod);
        },
        ...mapGetters([
            'windowHeight', 
            'windowWidth',
            'continuousClinicalVariables',
            'getConfig',
            'getStack',
            'getData',
            'getScale',
            'getSizes',
            'isEmptySession'
        ])
    },
    methods: {
        isContinuousClinicalVariable(clinicalVar) {
            return this.continuousClinicalVariables.includes(clinicalVar);
        },
        clickSignature(sig, mutType) {
            this.clickedSignature = sig;
            this.clickedMutType = mutType;
        },
        unclickSignature() {
            this.clickedSignature = null;
            this.clickedMutType = null;
        },
        downloadAll() {
            const legends = Object.entries(this.$refs).sort((a, b) => a[0].localeCompare(b[0])).map(o => o[1]);

            const svg = d3_create("svg");

            let x = 0;
            for(let legend of legends) {
                let legendSvg;
                try {
                    legendSvg = legend.download();
                } catch(e) {
                    legendSvg = legend[0].$children[0].download();
                }
                const width = this.colWidth;
                
                const legendG = svg.append("g")
                    .attr("width", width)
                    .attr("transform", `translate(${x},${0})`);
                
                legendG.html(legendSvg.node().innerHTML);

                x += width;
            }
            
            svg
                .attr("width", x);
            
            downloadSvg(svg, "explosig_view_legends");
        }
    }
}
</script>

<style scoped lang="scss">
@import './../style/variables.scss';

.tricounts-method-legend {
    margin-top: 8px;
    .tricounts-method-legend-title {
        color: black;
    }
    .tricounts-method-legend-item-left {
        margin-left: 4px;
        width: 26px;
        margin-top: 2px;
        height: 16px;
    }
    .tricounts-method-legend-item-right {
        font-size: 13px;
        color: black;
    }
}

.download-all {
    position: absolute;
    right: 45px;
    top: -31px;
}
.explosig-col-container-immediate {
    position: relative;
}
</style>
