<template>
    <span>
        <button @click="showStratificationModal">Stratify</button>

        <div class="modal" v-if="modalVisible">
            <div class="modal-inner">
                <span class="modal-close" @click="closeStratificationModal">Close</span>
                <div class="stratification-options-wrapper">
                    <h3>Stratification options</h3>
                    <div v-if="showSbs">
                        <h4 v-if="selectedClinicalVariables.length > 0">SBS Exposures &amp; Clinical Data</h4>
                        <div v-for="clinicalVar in selectedClinicalVariables" :key="('strat_sbs_cv_' + clinicalVar)">
                            <StratificationOptions
                                data="exposure_sbs"
                                :variable="clinicalVar"
                                optionScale="sig_SBS"
                                o="sample_id"
                                y="exposure_sbs"
                                s="clinical_data"
                                :getScale="getScale"
                                :getData="getData"
                                :getStack="getStack"
                                :getStratification="getStratification"
                                @stratify="closeStratificationModal"
                            />
                        </div>
                        <h4 v-if="selectedGenes.length > 0">SBS Exposures &amp; Gene Mutation Data</h4>
                        <div v-for="geneId in selectedGenes" :key="('strat_sbs_gene_mut_' + geneId)">
                            <StratificationOptions
                                data="exposure_sbs"
                                variable="mut_class"
                                optionScale="sig_SBS"
                                o="sample_id"
                                y="exposure_sbs"
                                :s="('gene_mut_' + geneId)"
                                :getScale="getScale"
                                :getData="getData"
                                :getStack="getStack"
                                :getStratification="getStratification"
                                @stratify="closeStratificationModal"
                            />
                        </div>
                        <h4 v-if="selectedGenes.length > 0">SBS Exposures &amp; Gene Expression Data</h4>
                        <div v-for="geneId in selectedGenes" :key="('strat_sbs_gene_exp_' + geneId)">
                            <StratificationOptions
                                data="exposure_sbs"
                                variable="gene_expression"
                                optionScale="sig_SBS"
                                o="sample_id"
                                y="exposure_sbs"
                                :s="('gene_exp_' + geneId)"
                                :getScale="getScale"
                                :getData="getData"
                                :getStack="getStack"
                                :getStratification="getStratification"
                                @stratify="closeStratificationModal"
                            />
                        </div>
                        <h4 v-if="selectedGenes.length > 0">SBS Exposures &amp; Gene CNA Data</h4>
                        <div v-for="geneId in selectedGenes" :key="('strat_sbs_gene_cna_' + geneId)">
                            <StratificationOptions
                                data="exposure_sbs"
                                variable="copy_number"
                                optionScale="sig_SBS"
                                o="sample_id"
                                y="exposure_sbs"
                                :s="('gene_cna_' + geneId)"
                                :getScale="getScale"
                                :getData="getData"
                                :getStack="getStack"
                                :getStratification="getStratification"
                                @stratify="closeStratificationModal"
                            />
                        </div>
                    </div>
                    <div v-if="showDbs">
                        <h4 v-if="selectedClinicalVariables.length > 0">DBS Exposures &amp; Clinical Data</h4>
                        <div v-for="clinicalVar in selectedClinicalVariables" :key="('strat_dbs_cv_' + clinicalVar)">
                            <StratificationOptions
                                data="exposure_dbs"
                                :variable="clinicalVar"
                                optionScale="sig_DBS"
                                o="sample_id"
                                y="exposure_dbs"
                                s="clinical_data"
                                :getScale="getScale"
                                :getData="getData"
                                :getStack="getStack"
                                :getStratification="getStratification"
                                @stratify="closeStratificationModal"
                            />
                        </div>
                        <h4 v-if="selectedGenes.length > 0">DBS Exposures &amp; Gene Mutation Data</h4>
                        <div v-for="geneId in selectedGenes" :key="('strat_dbs_gene_mut_' + geneId)">
                            <StratificationOptions
                                data="exposure_dbs"
                                variable="mut_class"
                                optionScale="sig_DBS"
                                o="sample_id"
                                y="exposure_dbs"
                                :s="('gene_mut_' + geneId)"
                                :getScale="getScale"
                                :getData="getData"
                                :getStack="getStack"
                                :getStratification="getStratification"
                                @stratify="closeStratificationModal"
                            />
                        </div>
                        <h4 v-if="selectedGenes.length > 0">DBS Exposures &amp; Gene Expression Data</h4>
                        <div v-for="geneId in selectedGenes" :key="('strat_dbs_gene_exp_' + geneId)">
                            <StratificationOptions
                                data="exposure_dbs"
                                variable="gene_expression"
                                optionScale="sig_DBS"
                                o="sample_id"
                                y="exposure_dbs"
                                :s="('gene_exp_' + geneId)"
                                :getScale="getScale"
                                :getData="getData"
                                :getStack="getStack"
                                :getStratification="getStratification"
                                @stratify="closeStratificationModal"
                            />
                        </div>
                        <h4 v-if="selectedGenes.length > 0">DBS Exposures &amp; Gene CNA Data</h4>
                        <div v-for="geneId in selectedGenes" :key="('strat_dbs_gene_cna_' + geneId)">
                            <StratificationOptions
                                data="exposure_dbs"
                                variable="copy_number"
                                optionScale="sig_DBS"
                                o="sample_id"
                                y="exposure_dbs"
                                :s="('gene_cna_' + geneId)"
                                :getScale="getScale"
                                :getData="getData"
                                :getStack="getStack"
                                :getStratification="getStratification"
                                @stratify="closeStratificationModal"
                            />
                        </div>
                    </div>
                    <div v-if="showIndel">
                        <h4 v-if="selectedClinicalVariables.length > 0">INDEL Exposures &amp; Clinical Data</h4>
                        <div v-for="clinicalVar in selectedClinicalVariables" :key="('strat_indel_cv_' + clinicalVar)">
                            <StratificationOptions
                                data="exposure_indel"
                                :variable="clinicalVar"
                                optionScale="sig_INDEL"
                                o="sample_id"
                                y="exposure_indel"
                                s="clinical_data"
                                :getScale="getScale"
                                :getData="getData"
                                :getStack="getStack"
                                :getStratification="getStratification"
                                @stratify="closeStratificationModal"
                            />
                        </div>
                        <h4 v-if="selectedGenes.length > 0">INDEL Exposures &amp; Gene Mutation Data</h4>
                        <div v-for="geneId in selectedGenes" :key="('strat_indel_gene_mut_' + geneId)">
                            <StratificationOptions
                                data="exposure_indel"
                                variable="mut_class"
                                optionScale="sig_INDEL"
                                o="sample_id"
                                y="exposure_indel"
                                :s="('gene_mut_' + geneId)"
                                :getScale="getScale"
                                :getData="getData"
                                :getStack="getStack"
                                :getStratification="getStratification"
                                @stratify="closeStratificationModal"
                            />
                        </div>
                        <h4 v-if="selectedGenes.length > 0">INDEL Exposures &amp; Gene Expression Data</h4>
                        <div v-for="geneId in selectedGenes" :key="('strat_indel_gene_exp_' + geneId)">
                            <StratificationOptions
                                data="exposure_indel"
                                variable="gene_expression"
                                optionScale="sig_INDEL"
                                o="sample_id"
                                y="exposure_indel"
                                :s="('gene_exp_' + geneId)"
                                :getScale="getScale"
                                :getData="getData"
                                :getStack="getStack"
                                :getStratification="getStratification"
                                @stratify="closeStratificationModal"
                            />
                        </div>
                        <h4 v-if="selectedGenes.length > 0">INDEL Exposures &amp; Gene CNA Data</h4>
                        <div v-for="geneId in selectedGenes" :key="('strat_indel_gene_cna_' + geneId)">
                            <StratificationOptions
                                data="exposure_indel"
                                variable="copy_number"
                                optionScale="sig_INDEL"
                                o="sample_id"
                                y="exposure_indel"
                                :s="('gene_cna_' + geneId)"
                                :getScale="getScale"
                                :getData="getData"
                                :getStack="getStack"
                                :getStratification="getStratification"
                                @stratify="closeStratificationModal"
                            />
                        </div>
                    </div>
                    <br/><br/>
                </div>
            </div>
        </div>
        <div class="modal-background" v-show="modalVisible" @click="closeStratificationModal"></div>
    </span>
</template>

<script>
import { mapGetters } from 'vuex';

import StratificationOptions from './StratificationOptions.vue';

export default {
    name: 'StratificationButtons',
    components: {
        StratificationOptions,
    },
    data() {
        return {
            modalVisible: false,
        };
    },
    computed: {
        showSbs() {
            return (this.getConfig().selectedSignaturesSbs.length > 0);
        },
        showDbs() {
            return (this.getConfig().selectedSignaturesDbs.length > 0);
        },
        showIndel() {
            return (this.getConfig().selectedSignaturesIndel.length > 0);
        },
        showGenes() {
            return (this.getConfig().selectedGenes.length > 0);
        },
        showClinical() {
            return (this.getConfig().selectedClinicalVariables.length > 0);
        },
        selectedGenes() {
            return (this.getConfig().selectedGenes);
        },
        selectedClinicalVariables() {
            return (this.getConfig().selectedClinicalVariables);
        },
        ...mapGetters([
            'getConfig',
            'getScale',
            'getData',
            'getStack',
            'getStratification'
        ])
    },
    methods: {
        showStratificationModal() {
            this.modalVisible = true;
        },
        closeStratificationModal() {
            this.modalVisible = false;
        }
    }
}
</script>

<style scoped lang="scss">
@import './../style/variables.scss';
@import './../style/modal.scss';

.stratification-options-wrapper {
    padding: 1rem;
    height: 80vh;
    overflow-y: scroll;
    box-sizing: border-box;
    h3 {
        margin-top: 0;
    }
}
</style>
