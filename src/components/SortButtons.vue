<template>
    <div>
        <span class="explorer-control-title">Sorting</span>
        <button @click="showSortModal">Sort Options</button>

        <div class="modal" v-if="modalVisible">
            <div class="modal-inner">
                <span class="modal-close" @click="closeSortModal">Close</span>
                <div class="sort-options-wrapper">
                    <h3>Sort options</h3>
                    <SortOptions 
                        variable="sample_id" 
                        data="mut_count" 
                        optionScale="mut_type"
                        comparatorScale="mut_count"
                        :getScale="getScale" 
                        :getData="getData"
                        :getStack="getStack"
                        @sort="closeSortModal"
                    />
                    <SortOptions v-if="showSbs"
                        variable="sample_id" 
                        data="exposure_sbs" 
                        optionScale="sig_SBS"
                        comparatorScale="exposure_sbs"
                        :getScale="getScale" 
                        :getData="getData"
                        :getStack="getStack"
                        @sort="closeSortModal"
                    />
                    <SortOptions v-if="showSbs"
                        variable="sample_id" 
                        data="exposure_sbs_normalized" 
                        optionScale="sig_SBS"
                        comparatorScale="exposure_sbs_normalized"
                        :getScale="getScale" 
                        :getData="getData"
                        :getStack="getStack"
                        @sort="closeSortModal"
                    />
                    <SortOptions v-if="showDbs"
                        variable="sample_id" 
                        data="exposure_dbs" 
                        optionScale="sig_DBS"
                        comparatorScale="exposure_dbs"
                        :getScale="getScale" 
                        :getData="getData"
                        :getStack="getStack"
                        @sort="closeSortModal"
                    />
                    <SortOptions v-if="showDbs"
                        variable="sample_id" 
                        data="exposure_dbs_normalized" 
                        optionScale="sig_DBS"
                        comparatorScale="exposure_dbs_normalized"
                        :getScale="getScale" 
                        :getData="getData"
                        :getStack="getStack"
                        @sort="closeSortModal"
                    />
                     <SortOptions v-if="showIndel"
                        variable="sample_id" 
                        data="exposure_indel" 
                        optionScale="sig_INDEL"
                        comparatorScale="exposure_indel"
                        :getScale="getScale" 
                        :getData="getData"
                        :getStack="getStack"
                        @sort="closeSortModal"
                    />
                    <SortOptions v-if="showIndel"
                        variable="sample_id" 
                        data="exposure_indel_normalized" 
                        optionScale="sig_INDEL"
                        comparatorScale="exposure_indel_normalized"
                        :getScale="getScale" 
                        :getData="getData"
                        :getStack="getStack"
                        @sort="closeSortModal"
                    />
                    <div v-if="showGenes">
                        <SortOptions v-for="geneId in selectedGenes" :key="geneId"
                            variable="sample_id" 
                            :data="('gene_' + geneId)" 
                            optionName="Mutation Classification"
                            optionVariable="mut_class"
                            comparatorScale="mut_class"
                            :getScale="getScale" 
                            :getData="getData"
                            :getStack="getStack"
                            @sort="closeSortModal"
                        />
                    </div>
                    <div v-if="showClinical">
                        <SortOptions v-for="clinicalVar in selectedClinicalVariables" :key="clinicalVar"
                            variable="sample_id" 
                            :data="('cv_' + clinicalVar)" 
                            :optionName="clinicalVar"
                            :optionVariable="('cv_' + clinicalVar)"
                            :comparatorScale="('cv_' + clinicalVar)"
                            :getScale="getScale" 
                            :getData="getData"
                            :getStack="getStack"
                            @sort="closeSortModal"
                        />
                    </div>
                </div>
            </div>
        </div>
        <div class="modal-background" v-show="modalVisible" @click="closeSortModal"></div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    name: 'SortButtons',
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
            'getStack'
        ])
    },
    methods: {
        showSortModal() {
            this.modalVisible = true;
        },
        closeSortModal() {
            this.modalVisible = false;
        }
    }
}
</script>

<style scoped lang="scss">
@import './../style/variables.scss';
@import './../style/modal.scss';

.sort-options-wrapper {
    padding: 1rem;
    h3 {
        margin-top: 0;
    }
}
</style>
