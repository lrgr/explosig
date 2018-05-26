<template>
    <div class="plot-options">
        <div class="main-options">
            <h2>+ Plot</h2>
            <ul>
                <li v-for="plotType in this.plotTypes" :key="plotType.type">
                    <input type="checkbox" :value="plotType" :id="plotType.type" name="plot" v-model="plotsToAdd" />
                    <label :for="plotType.type">{{ plotType.title }}</label>
                </li>
                <li>
                    <input type="checkbox" disabled/>
                    <label class="coming-soon">Manhattan Plot with Mutation Categories (Coming Soon)</label>
                </li>
                <li>
                    <input type="checkbox" disabled/>
                    <label class="coming-soon">Mutation Prevalence per Cancer Type (Coming Soon)</label>
                </li>
                <li>
                    <input type="checkbox" disabled/>
                    <label class="coming-soon">Signature Exposures per Cancer Type (Coming Soon)</label>
                </li>
                <li>
                    <input type="checkbox" disabled/>
                    <label class="coming-soon">Signatures (Coming Soon)</label>
                </li>
            </ul>
        </div>
        <div class="actions-bar">
            <span class="button button-secondary" v-on:click="addPlots()">Add</span>
        </div>
    </div>
</template>

<script>
import { getUUID } from './../helpers.js';

export default {
    name: 'PlotPicker',
    data: function() {
        return {
            plotsToAdd: [],
            plotTypes: [{
                type: 'ExposuresPlot',
                title: 'Signature Exposures with Clinical Data'
            }, {
                type: 'KataegisPlot',
                title: 'Kataegis'
            }, {
                type: 'SignatureGenomeBinsPlot',
                title: 'Manhattan Plot with Signatures'
            }]
        };
    },
    methods: {
        addPlots: function() {
            let vm = this;
            for(var i = 0; i < vm.plotsToAdd.length; i++) {
                vm.$store.commit('addPlot', {
                    type: vm.plotsToAdd[i].type,
                    id: getUUID(),
                    title: vm.plotsToAdd[i].title,
                    options: {}
                });
            }
            vm.$emit('closePlotPicker');
            vm.plotsToAdd = [];
        }
    }
    
}
</script>

<style scoped lang="scss">

@import './../variables.scss';

.plot-options {
    display: flex;
    flex-direction: column;
    height: 100%;
   .main-options {
        flex-grow: 1;
        overflow-y: auto;
        padding: 1rem;
        display: flex;
        flex-direction: column;
        h2 {
            flex-shrink: 0;
            margin: 0.3rem;
            display: inline-block;
        }
        h4 {
            margin-left: 1rem;
            margin-bottom: 0;
        }
        ul {
            display: inline-block;
            box-sizing: border-box;
            flex-grow: 1;
            list-style-type: none;
            padding-left:0;
            list-style: none;
            margin-top: 0;
            li {
                &:hover {
                    color: $color-gray;
                }
                label {
                    margin-left: 5px;
                    cursor: pointer;
                    &.coming-soon {
                        color: silver;
                    }
                }
                cursor: pointer;
                margin: 1rem;
            }
        }
        button.inline {
            display: inline-block;
        }
   }

   .actions-bar {
        padding: 1rem;
        .button {
            float: right;
            margin: 0rem 0rem 0rem 1rem;
        }
   }
    
}

</style>
