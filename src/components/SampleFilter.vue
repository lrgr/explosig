<template>
    <div>
        <div class="modal">
            <div class="modal-inner">
                <span class="modal-close" @click="closeModal">Close</span>
                <div class="sample-filter-wrapper">
                    <h3>Filter samples by ID</h3>
                    <p>Explicitly exclude samples by ID. Separate sample IDs using semi-colons.</p>
                    <textarea id="sample-textarea" v-model="filterString"></textarea>
                    <div class="filter-submit-wrapper">
                        <VButton :btnSecondary="true" @click="filterSamples">Filter</VButton>
                    </div>
                    <br/><br/>
                </div>
            </div>
        </div>
        <div class="modal-background" @click="closeModal"></div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { HistoryEvent, EVENT_TYPES, EVENT_SUBTYPES } from 'vueplotlib';

import VButton from './VButton.vue';

export default {
    name: 'SampleFilter',
    components: {
        VButton,
    },
    data() {
        return {
            filterString: ""
        };
    },
    created() {
        const sampleScale = this.getScale("sample_id");
        const excludedSamples = sampleScale.domain.filter((d) => !sampleScale.domainFiltered.includes(d));
        this.filterString = excludedSamples.join('; ');
    },
    computed: {
        ...mapGetters([
            'getConfig',
            'getScale',
            'getData',
            'getStack'
        ])
    },
    methods: {
        closeModal() {
            this.$emit('closeSampleFilterModal');
        },
        filterSamples() {
            const stack = this.getStack();
            const sampleScale = this.getScale("sample_id");
            const sampleDomain = sampleScale.domain;

            let samplesToExclude = this.filterString.split(';').map((d) => d.trim());
            samplesToExclude = samplesToExclude.filter((d) => sampleDomain.includes(d));

            let samplesToInclude = sampleDomain.filter((d) => !samplesToExclude.includes(d));
            const sampleIndicesToInclude = samplesToInclude.map((d) => sampleDomain.indexOf(d));

            sampleScale.filter(sampleIndicesToInclude);
            stack.push(new HistoryEvent(
                EVENT_TYPES.SCALE, 
                EVENT_SUBTYPES.SCALE_DOMAIN_FILTER,
                sampleScale.id, 
                "filter", 
                [sampleIndicesToInclude]
            ));

            this.closeModal();
        }
    }
}
</script>

<style scoped lang="scss">
@import './../style/variables.scss';
@import './../style/modal.scss';

#sample-textarea {
    width: 100%;
    height: 58vh;
    box-sizing: border-box;
    resize: vertical;
    font-family: Courier, monospace;
    font-size: 12px;
    padding: 5px;
}
.sample-filter-wrapper {
    padding: 1rem;
    height: 80vh;
    overflow-y: scroll;
    box-sizing: border-box;
    h3 {
        margin-top: 0;
    }
}
.filter-submit-wrapper {
    width: 100%;
    text-align: right;
    margin-top: 10px;
}
</style>
