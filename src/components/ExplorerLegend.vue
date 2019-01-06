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
        />
        <CategoricalLegend v-if="showDbs"
            variable="sig_DBS"
            lStyle="bar"
            :lWidth="colWidth"
            :getScale="getScale"
            :getStack="getStack"
        />
        <CategoricalLegend v-if="showIndel"
            variable="sig_INDEL"
            lStyle="bar"
            :lWidth="colWidth"
            :getScale="getScale"
            :getStack="getStack"
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
                    :variable="('cv_' + clinicalVar)"
                    lStyle="bar"
                    :lWidth="colWidth"
                    :getScale="getScale"
                    :getStack="getStack"
                />
                <ContinuousLegend v-if="isContinuousClinicalVariable(clinicalVar)"
                    :variable="('cv_' + clinicalVar)"
                    lStyle="bar"
                    :lWidth="colWidth"
                    :getScale="getScale"
                    :getStack="getStack"
                />
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { CONTINUOUS_CLINICAL_VARS } from './../constants.js';


export default {
    name: 'ExplorerLegend',
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
            'getConfig',
            'getStack',
            'getData',
            'getScale'
        ])
    },
    methods: {
        isContinuousClinicalVariable(clinicalVar) {
            return CONTINUOUS_CLINICAL_VARS.includes(clinicalVar);
        }
    }
}
</script>

<style scoped lang="scss">
@import './../style/variables.scss';
@import '~vue-declarative-plots/dist/vue-declarative-plots.css';


</style>
