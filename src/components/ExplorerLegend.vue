<template>
    <div>
        <CategoricalLegend
            variable="proj_id"
            lStyle="bar"
            :lWidth="colWidth"
            :getScale="getScale"
            :getStack="getStack"
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
        />
        <CategoricalLegend v-if="showSbs"
            variable="sig_SBS"
            lStyle="bar"
            :lWidth="colWidth"
            :getScale="getScale"
            :getStack="getStack"
            :clickHandler="(sigName) => clickSignature(sigName, 'SBS')"
        />
        <CategoricalLegend v-if="showDbs"
            variable="sig_DBS"
            lStyle="bar"
            :lWidth="colWidth"
            :getScale="getScale"
            :getStack="getStack"
            :clickHandler="(sigName) => clickSignature(sigName, 'DBS')"
        />
        <CategoricalLegend v-if="showIndel"
            variable="sig_INDEL"
            lStyle="bar"
            :lWidth="colWidth"
            :getScale="getScale"
            :getStack="getStack"
            :clickHandler="(sigName) => clickSignature(sigName, 'INDEL')"
        />
        <CategoricalLegend v-if="showGenes"
            variable="mut_class"
            lStyle="bar"
            :lWidth="colWidth"
            :getScale="getScale"
            :getStack="getStack"
        />
        <CategoricalLegend v-if="showGenes"
            variable="gene_expression"
            lStyle="bar"
            :lWidth="colWidth"
            :getScale="getScale"
            :getStack="getStack"
        />
        <CategoricalLegend v-if="showGenes"
            variable="copy_number"
            lStyle="bar"
            :lWidth="colWidth"
            :getScale="getScale"
            :getStack="getStack"
        />
        <!-- Clinical Variables -->
        <div v-if="showClinical">
            <div v-for="clinicalVar in selectedClinicalVariables" :key="clinicalVar">
                <Legend
                    :variable="clinicalVar"
                    lStyle="bar"
                    :lWidth="colWidth"
                    :getScale="getScale"
                    :getStack="getStack"
                />
            </div>
        </div>

        <ContinuousLegend v-if="showSbs"
            variable="exposure_sbs_normalized"
            lStyle="bar"
            :lWidth="colWidth"
            :getScale="getScale"
            :getStack="getStack"
        />
        <ContinuousLegend v-if="showDbs"
            variable="exposure_dbs_normalized"
            lStyle="bar"
            :lWidth="colWidth"
            :getScale="getScale"
            :getStack="getStack"
        />
        <ContinuousLegend v-if="showIndel"
            variable="exposure_indel_normalized"
            lStyle="bar"
            :lWidth="colWidth"
            :getScale="getScale"
            :getStack="getStack"
        />

        <SignatureModal :clickedSignature="clickedSignature" :clickedMutType="clickedMutType" @close-modal="unclickSignature" />
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

import { EXPLORER_COLUMNS } from './../vdp/Sizes.js';

import SignatureModal from './SignatureModal.vue';


export default {
    name: 'ExplorerLegend',
    components: {
        SignatureModal
    },
    data() {
        return {
            selectedClinicalVariables: [],
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
            return (this.getConfig().selectedGenes.length > 0);
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
</style>
