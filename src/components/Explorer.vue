<template>
    <div class="explorer" :style="{ 'height': (windowHeight-49) + 'px' }">
        <div class="explorer-main explorer-col">
            <div class="explorer-col-title">
                <h3>Main</h3>
            </div>
        </div>
        <div class="explorer-overview explorer-col">
            <div class="explorer-col-title">
                <h3>Overview</h3>
            </div>
        </div>
        <div class="explorer-legend explorer-col">
            <div class="explorer-col-title">
                <h3>Legend</h3>
            </div>
            <CategoricalLegend
                variable="signature_sbs"
                lStyle="bar"
                :lWidth="widthLegend"
                :getScale="getScale"
                :getStack="getStack"
            />
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'Explorer',
    computed: {
        widthMain() {
            return this.windowWidth * (5/10) - 25;
        },
        widthOverview() {
            return this.windowWidth * (3/10) - 25;
        },
        widthLegend() {
            return this.windowWidth * (2/10) - 25;
        },
        ...mapGetters([
            'windowHeight', 
            'windowWidth',
            'getStack',
            'getData',
            'getScale'
        ])
    },
    watch: {
        
    },
    methods: {
        
    }
}
</script>

<style scoped lang="scss">
@import './../style/variables.scss';
@import '~vue-declarative-plots/dist/vue-declarative-plots.css';

.explorer {
    display: flex;
    flex-direction: row;
    .explorer-col {
        overflow-y: scroll;
        .explorer-col-title {
            margin-left: 10px;
        }
    }
    .explorer-main {
        flex: 5;
    }
    .explorer-overview {
        flex: 3;
    }
    .explorer-legend {
        flex: 2;
        &>div {
            margin-left: 10px;
        }
    }
}
</style>
