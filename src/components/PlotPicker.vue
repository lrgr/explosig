<template>
    <div class="plot-picker">
        <h2>+ Plot</h2>
        <ul>
            <li>Signatures</li>
            <li>Signatures per Cancer Type</li>
            <li>Manhattan Plot with Signatures</li>
            <li>Manhattan Plot with Mutation Contexts</li>
            <li>Manhattan Plot with Mutation Types</li>
            <li>Kataegis</li>
            <li>Signature Exposures with Clinical Data</li>
            <li>Signature Exposure Box Plots per Cancer Type</li>
        </ul>
        <Spinner v-if="loading"></Spinner>
    </div>
</template>

<script>
import Spinner from './Spinner.vue'

export default {
    name: 'PlotPicker',
    components: {
        Spinner
    },
    data: function() {
        return {
            loading: false
        };
    }
    
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

@import './../variables.scss';

.plot-picker {
    height: 100%;
    width: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    padding: 1rem;
    overflow-y: scroll;
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

</style>
