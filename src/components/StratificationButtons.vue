<template>
    <div>
        <span class="explorer-control-title">Stratify</span>
        <button @click="showStratificationModal">Stratification Options</button>

        <div class="modal" v-if="modalVisible">
            <div class="modal-inner">
                <span class="modal-close" @click="closeStratificationModal">Close</span>
                <div class="stratification-options-wrapper">
                    <h3>Stratification options</h3>
                    <div v-if="showSbs">
                        <div v-for="clinicalVar in selectedClinicalVariables" :key="clinicalVar">
                            <StratificationOptions v-if="!isContinuousClinicalVariable(clinicalVar)"
                                data="exposure_sbs"
                                :variable="('cv_' + clinicalVar)"
                                optionScale="sig_SBS"
                                o="sample_id"
                                y="exposure_sbs"
                                :s="('cv_' + clinicalVar)"
                                :getScale="getScale"
                                :getData="getData"
                                :getStack="getStack"
                                :getStratification="getStratification"
                                @stratify="closeStratificationModal"
                            />
                        </div>
                        <div v-for="geneId in selectedGenes" :key="geneId">
                            <StratificationOptions
                                data="exposure_sbs"
                                variable="mut_class"
                                optionScale="sig_SBS"
                                o="sample_id"
                                y="exposure_sbs"
                                :s="('gene_' + geneId)"
                                :getScale="getScale"
                                :getData="getData"
                                :getStack="getStack"
                                :getStratification="getStratification"
                                @stratify="closeStratificationModal"
                            />
                        </div>
                    </div>
                    <div v-if="showDbs">
                        <div v-for="clinicalVar in selectedClinicalVariables" :key="clinicalVar">
                            <StratificationOptions v-if="!isContinuousClinicalVariable(clinicalVar)"
                                data="exposure_dbs"
                                :variable="('cv_' + clinicalVar)"
                                optionScale="sig_DBS"
                                o="sample_id"
                                y="exposure_dbs"
                                :s="('cv_' + clinicalVar)"
                                :getScale="getScale"
                                :getData="getData"
                                :getStack="getStack"
                                :getStratification="getStratification"
                                @stratify="closeStratificationModal"
                            />
                        </div>
                        <div v-for="geneId in selectedGenes" :key="geneId">
                            <StratificationOptions
                                data="exposure_dbs"
                                variable="mut_class"
                                optionScale="sig_DBS"
                                o="sample_id"
                                y="exposure_dbs"
                                :s="('gene_' + geneId)"
                                :getScale="getScale"
                                :getData="getData"
                                :getStack="getStack"
                                :getStratification="getStratification"
                                @stratify="closeStratificationModal"
                            />
                        </div>
                    </div>
                    <div v-if="showIndel">
                        <div v-for="clinicalVar in selectedClinicalVariables" :key="clinicalVar">
                            <StratificationOptions v-if="!isContinuousClinicalVariable(clinicalVar)"
                                data="exposure_indel"
                                :variable="('cv_' + clinicalVar)"
                                optionScale="sig_INDEL"
                                o="sample_id"
                                y="exposure_indel"
                                :s="('cv_' + clinicalVar)"
                                :getScale="getScale"
                                :getData="getData"
                                :getStack="getStack"
                                :getStratification="getStratification"
                                @stratify="closeStratificationModal"
                            />
                        </div>
                        <div v-for="geneId in selectedGenes" :key="geneId">
                            <StratificationOptions
                                data="exposure_indel"
                                variable="mut_class"
                                optionScale="sig_INDEL"
                                o="sample_id"
                                y="exposure_indel"
                                :s="('gene_' + geneId)"
                                :getScale="getScale"
                                :getData="getData"
                                :getStack="getStack"
                                :getStratification="getStratification"
                                @stratify="closeStratificationModal"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal-background" v-show="modalVisible" @click="closeStratificationModal"></div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

import StratificationOptions from './StratificationOptions.vue';

import { CONTINUOUS_CLINICAL_VARS } from './../constants.js';

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
        },
        isContinuousClinicalVariable(clinicalVar) {
            return CONTINUOUS_CLINICAL_VARS.includes(clinicalVar);
        }
    }
}
</script>

<style scoped lang="scss">
@import './../style/variables.scss';
@import './../style/modal.scss';

.stratification-options-wrapper {
    padding: 1rem;
    h3 {
        margin-top: 0;
    }
}
</style>
