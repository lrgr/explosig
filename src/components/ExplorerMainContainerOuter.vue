<template>
    <ExplorerMainContainer :key="('ExplorerMainContainerOuter' + componentKey)" />
</template>

<script>
import { mapGetters } from 'vuex';
import ExplorerMainContainer from './ExplorerMainContainer.vue';



export default {
    name: 'ExplorerMainContainerOuter',
    components: {
        ExplorerMainContainer
    },
    data() {
        return {
            componentKey: 1
        };
    },
    mounted() {
        this.getScale("mut_type").onUpdate(this.name, this.rerender);
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
