<template>
    <div>
        <span class="explorer-control-title">Filtering</span>
        <button @click="showFilterModal">Filter Samples</button>

        <SampleFilter v-if="modalVisible" @closeSampleFilterModal="closeFilterModal" />
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

import SampleFilter from './SampleFilter.vue';

export default {
    name: 'FilterButtons',
    components: {
        SampleFilter
    },
    data() {
        return {
            modalVisible: false,
        };
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
        showFilterModal() {
            this.modalVisible = true;
        },
        closeFilterModal() {
            this.modalVisible = false;
        }
    }
}
</script>

<style scoped lang="scss">
@import './../style/variables.scss';


</style>
