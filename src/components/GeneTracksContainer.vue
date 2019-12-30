<template>
    <div>
        <GeneTracks :key="('GeneTracks' + componentKey)" :sampleClickHandler="sampleClickHandler" />
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import GeneTracks from './GeneTracks.vue';



export default {
    name: 'GeneTracksContainer',
    props: {
        'sampleClickHandler': {
            type: Function
        }
    },
    components: {
        GeneTracks
    },
    data() {
        return {
            componentKey: 1
        };
    },
    created() {
        this.getScale("gene_mut").onUpdate(this.name, this.rerender);
        this.getScale("gene_exp").onUpdate(this.name, this.rerender);
        this.getScale("gene_cna").onUpdate(this.name, this.rerender);
    },
    methods: {
        rerender() {
            this.componentKey++;
        }
    },
    computed: {
        ...mapGetters([
            'getScale'
        ])
    }
}
</script>

<style scoped lang="scss">
@import './../style/variables.scss';


</style>
