<template>
    <div>
        <div class="plot-picker">
            <h2>+ Plot</h2>
            <ul>
                <li v-for="plotType in this.plotTypes" :key="plotType.type" @click="addPlot(plotType.type, plotType.title)">{{ plotType.title }}</li>
            </ul>
        </div>
        <h4>Coming Soon:</h4>
        <ul>
            <li>Signatures</li>
            <li>Manhattan Plot with Mutation Contexts</li>
            <li>Manhattan Plot with Mutation Types</li>
            <li>Signature Exposure Box Plots per Cancer Type</li>
        </ul>
    </div>
</template>

<script>
import { globalPlotList } from './../buses.js';

// child components
import Spinner from './Spinner.vue'

export default {
    name: 'PlotPicker',
    components: {
        Spinner
    },
    data: function() {
        return {
            plotTypes: [{
                type: 'ExposuresPlot',
                title: 'Signature Exposures with Clinical Data'
            }, {
                type: 'SignatureGenomeBinsPlot',
                title: 'Manhattan Plot with Signatures'
            }, {
                type: 'KataegisPlot',
                title: 'Kataegis'
            }],
            selectedPlots: globalPlotList
        };
    },
    methods: {
        addPlot: function(plotType, plotTitle, plotOptions = {}) {
            this.selectedPlots.push({
                type: plotType,
                options: plotOptions
            });
            this.$emit('closePlotPicker');
        }
    }
    
}
</script>

<style scoped lang="scss">

@import './../variables.scss';

.plot-picker {
    height: 100%;
    width: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    padding: 1rem;
    overflow-y: auto;
    h2 {
        flex-shrink: 0;
        margin: 0.3rem;
        display: inline-block;
    }
    ul {
        box-sizing: border-box;
        flex-grow: 1;
        list-style-type: none;
        padding-left:0;
        list-style: none;
        li {
            &:hover {
                color: $color-gray;
            }
            cursor: pointer;
            margin: 1rem;
        }
        
        
    }
}
h4 {
    margin-left: 1rem;
    margin-bottom: 0;
}

</style>
