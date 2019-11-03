<template>
    <ExplorerMain :key="('ExplorerMainContainer' + componentKey)" />
</template>

<script>
import { mapGetters } from 'vuex';
import ExplorerMain from './ExplorerMain.vue';



export default {
    name: 'ExplorerMainContainer',
    components: {
        ExplorerMain
    },
    data() {
        return {
            componentKey: 1
        };
    },
    created() {
        const mutTypeScale = this.getScale("mut_type");
        console.log(mutTypeScale.domain.slice())
        for(const mutType of mutTypeScale.domain) {
            this.getScale(`sig_${mutType}`).onUpdate(this.name, this.rerender);
        }
    },
    methods: {
        rerender() {
            console.log("maincontainer_rerender");
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
