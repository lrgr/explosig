<template>
    <div>
        <div :id="this.plotElemID" class="plot-component"></div>

        <div :id="this.tooltipElemID" class="tooltip" :style="this.tooltipPositionAttribute">
            <table>
                <tr>
                    <th>Var Name</th><td>{{ this.tooltipInfo.var }}</td>
                </tr>
            </table>
        </div>

         <div class="spinner-wrapper" v-if="loading">
            <Spinner class="spinner"></Spinner>
        </div>
        <div class="bottom-options">
            <ChromosomeSelect ref="chrSelect" />
        </div>

        <div class="plot-info" v-if="showInfo">
            <h3>Info</h3>
            <p>This plot displays... </p>
        </div>
    </div>
</template>

<script>
import * as d3 from 'd3';
import plotMixin from './../../mixins/plot-mixin.js';
import { dispatch } from './plot-link.js';
import API from './../../api.js';

// child components
import Spinner from './../Spinner.vue';
import ChromosomeSelect from './../ChromosomeSelect.vue';

export default {
    name: 'SkeletonPlot',
    mixins: [plotMixin],
    props: [],
    components: {
        Spinner,
        ChromosomeSelect
    },
    data: function () {
        return {
            margin: {
                top: 20,
                right: 30,
                bottom: 30,
                left: 80
            },
            tooltipInfo: {
                var: '',
                left: null,
                top: null
            }
        };
    },
    computed: {
        height: function () {
            return 400 - this.margin.top - this.margin.bottom;
        },
        width: function() {
            return (this.windowWidth*0.8) - 40 - this.margin.left - this.margin.right;
        }
    },
    methods: {
        tooltip: function(donorID, y) {
            this.tooltipInfo.var = donorID;
            
            this.tooltipPosition.left = d3.event.x;
            this.tooltipPosition.top = y + this.margin.top;
            
            dispatch.call("link-donor", null, donorID);
            dispatch.call("link-genome", null, d3.event.x);
        },
        tooltipDestroy: function() {
            this.tooltipHide();

            dispatch.call("link-donor-destroy");
            dispatch.call("link-genome-destroy");
        },
        updatePlot: function () {
            var vm = this;
            vm.loading = true;
            let params = {
                // request params here
            };
            API.fetchRainfall(params).then(function (data) {
                vm.plotData = data;
                
                vm.drawPlot();
                vm.loading = false;
            });

        },
        drawPlot: function () {
            var vm = this;

            if(vm.plotData == null) {
                return;
            }

            // d3 code here
        }
    }
}
</script>

<style scoped lang="scss">

@import './../../variables.scss';
@import './plot-style.scss';

</style>