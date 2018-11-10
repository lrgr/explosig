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
            variable="sig_sbs"
            lStyle="bar"
            :lWidth="colWidth"
            :getScale="getScale"
            :getStack="getStack"
        />
        <CategoricalLegend v-if="showDbs"
            variable="sig_dbs"
            lStyle="bar"
            :lWidth="colWidth"
            :getScale="getScale"
            :getStack="getStack"
        />
        <CategoricalLegend v-if="showIndel"
            variable="sig_indel"
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
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

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
