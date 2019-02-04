<template>
    <div>
        <CategoricalLegend
            variable="proj_id"
            lStyle="bar"
            :lWidth="colWidth"
            :getScale="getScale"
            :getStack="getStack"
        />
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
            :clickHandler="clickSignature"
        />
        <CategoricalLegend v-if="showDbs"
            variable="sig_DBS"
            lStyle="bar"
            :lWidth="colWidth"
            :getScale="getScale"
            :getStack="getStack"
            :clickHandler="clickSignature"
        />
        <CategoricalLegend v-if="showIndel"
            variable="sig_INDEL"
            lStyle="bar"
            :lWidth="colWidth"
            :getScale="getScale"
            :getStack="getStack"
            :clickHandler="clickSignature"
        />
        <CategoricalLegend v-if="showGenes"
            variable="mut_class"
            lStyle="bar"
            :lWidth="colWidth"
            :getScale="getScale"
            :getStack="getStack"
        />
        <!-- Clinical Variables -->
        <div v-if="showClinical">
            <div v-for="clinicalVar in selectedClinicalVariables" :key="clinicalVar">
                <CategoricalLegend v-if="!isContinuousClinicalVariable(clinicalVar)"
                    :variable="clinicalVar"
                    lStyle="bar"
                    :lWidth="colWidth"
                    :getScale="getScale"
                    :getStack="getStack"
                />
                <ContinuousLegend v-if="isContinuousClinicalVariable(clinicalVar)"
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

        <SignatureModal :clickedSignature="clickedSignature" @close-modal="unclickSignature" />
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
            clickedSignature: null
        }
    },
    computed: {
        colWidth() {
            return this.windowWidth * this.getSizes().columns[EXPLORER_COLUMNS.LEGEND] - 25;
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
        showGenes() {
            return (this.getConfig().selectedGenes.length > 0);
        },
        showClinical() {
            return (this.getConfig().selectedClinicalVariables.length > 0);
        },
        selectedClinicalVariables() {
            return (this.getConfig().selectedClinicalVariables);
        },
        ...mapGetters([
            'windowHeight', 
            'windowWidth',
            'continuousClinicalVariables',
            'getConfig',
            'getStack',
            'getData',
            'getScale',
            'getSizes'
        ])
    },
    methods: {
        isContinuousClinicalVariable(clinicalVar) {
            return this.continuousClinicalVariables.includes(clinicalVar);
        },
        clickSignature(sig) {
            this.clickedSignature = sig;
        },
        unclickSignature() {
            this.clickedSignature = null;
        }
    }
}
</script>

<style scoped lang="scss">
@import './../style/variables.scss';


</style>
