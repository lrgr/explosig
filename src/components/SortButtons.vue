<template>
    <span>
        <button @click="showSortModal">Sort</button>

        <div class="modal" v-if="modalVisible">
            <div class="modal-inner">
                <span class="modal-close" @click="closeSortModal">Close</span>
                <div class="sort-options-wrapper">
                    <h3>Sorting options</h3>
                    <h4>Mutation Data</h4>
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
                    <h4>Exposures Data</h4>
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
                    <SortOptions v-if="showSbs"
                        variable="sample_id" 
                        data="dominant_sig_sbs" 
                        optionName="SBS Signature"
                        optionVariable="sig_SBS"
                        comparatorScale="sig_SBS"
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
                    <SortOptions v-if="showDbs"
                        variable="sample_id" 
                        data="dominant_sig_dbs" 
                        optionName="DBS Signature"
                        optionVariable="sig_DBS"
                        comparatorScale="sig_DBS"
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
                    <SortOptions v-if="showIndel"
                        variable="sample_id" 
                        data="dominant_sig_indel" 
                        optionName="INDEL Signature"
                        optionVariable="sig_INDEL"
                        comparatorScale="sig_INDEL"
                        :getScale="getScale" 
                        :getData="getData"
                        :getStack="getStack"
                        @sort="closeSortModal"
                    />
                    <div v-if="showClinical">
                        <h4>Clinical Data</h4>
                        <SortOptions v-for="clinicalVar in selectedClinicalVariables" :key="clinicalVar"
                            variable="sample_id" 
                            data="clinical_data" 
                            :optionName="clinicalVar"
                            :optionVariable="clinicalVar"
                            :comparatorScale="clinicalVar"
                            :getScale="getScale" 
                            :getData="getData"
                            :getStack="getStack"
                            @sort="closeSortModal"
                        />
                    </div>
                    <div v-if="showGenes">
                        <h4>Gene Mutation Data</h4>
                        <SortOptions v-for="geneId in selectedGenes" :key="geneId"
                            variable="sample_id" 
                            :data="('gene_mut_' + geneId)" 
                            optionName="Mutation Classification"
                            optionVariable="mut_class"
                            comparatorScale="mut_class"
                            :getScale="getScale" 
                            :getData="getData"
                            :getStack="getStack"
                            @sort="closeSortModal"
                        />
                        <h4>Gene Expression Data</h4>
                        <SortOptions v-for="geneId in selectedGenes" :key="geneId"
                            variable="sample_id" 
                            :data="('gene_exp_' + geneId)" 
                            optionName="Gene Expression"
                            optionVariable="gene_expression"
                            comparatorScale="gene_expression"
                            :getScale="getScale" 
                            :getData="getData"
                            :getStack="getStack"
                            @sort="closeSortModal"
                        />
                        <h4>Gene CNA Data</h4>
                        <SortOptions v-for="geneId in selectedGenes" :key="geneId"
                            variable="sample_id" 
                            :data="('gene_cna_' + geneId)" 
                            optionName="Copy Number"
                            optionVariable="copy_number"
                            comparatorScale="copy_number"
                            :getScale="getScale" 
                            :getData="getData"
                            :getStack="getStack"
                            @sort="closeSortModal"
                        />
                    </div>
                    <br/><br/>
                </div>
            </div>
        </div>
        <div class="modal-background" v-show="modalVisible" @click="closeSortModal"></div>
    </span>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    name: 'SortButtons',
    data() {
        return {
            modalVisible: false,
            selectedGenes: [],
            selectedClinicalVariables: [],
        };
    },
    mounted() {
        const cvScale = this.getScale("clinical_variable");
        this.selectedClinicalVariables = cvScale.domain;
        cvScale.onUpdate("sort_buttons", () => {
            this.selectedClinicalVariables = cvScale.domain;
        });

        const gScale = this.getScale("gene_mut");
        this.selectedGenes = gScale.domain;
        gScale.onUpdate("sort_buttons", () => {
            this.selectedGenes = gScale.domain;
        });
    },
    computed: {
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
            return (this.isEmptySession || this.getConfig().selectedGenes.length > 0);
        },
        showClinical() {
            return (this.isEmptySession || this.getConfig().selectedClinicalVariables.length > 0);
        },
        ...mapGetters([
            'getConfig',
            'getScale',
            'getData',
            'getStack',
            'isEmptySession'
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
    height: 80vh;
    overflow-y: scroll;
    box-sizing: border-box;
    h3 {
        margin-top: 0;
    }
}
</style>
