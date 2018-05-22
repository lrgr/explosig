<template>
    <div>
        <div :id="this.plotID" class="plot-component"></div>

        <div :id="this.plotID + '_tooltip'" class="tooltip" :style="this.tooltipPosition">
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
import { dispatch } from './plot-link.js';
import API from './../../api.js';

// child components
import Spinner from './../Spinner.vue';
import ChromosomeSelect from './../ChromosomeSelect.vue';

export default {
    name: 'RainfallPlot',
    props: ['plotIndex', 'showInfo', 'windowWidth'],
    components: {
        Spinner,
        ChromosomeSelect
    },
    data: function () {
        return {
            title: 'Rainfall',
            loading: false,
            plotData: null,
            width: 0,
            svg: null,
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
    mounted: function() {
        this.$emit('titleInit', this.title);
    },
    computed: {
        height: function () {
            return 400 - this.margin.top - this.margin.bottom;
        },
        plotID: function () {
            return 'plot_' + this.plotIndex;
        },
        tooltipPosition: function() {
            if(this.tooltipInfo.left == null || this.tooltipInfo.top == null) {
                return 'display: none;';
            } else {
                return 'left: ' + this.tooltipInfo.left + 'px; top: ' + this.tooltipInfo.top + 'px;';
            }
        }
    },
    watch: {
        windowWidth: function (val) {
            this.width = (val*0.8) - 40 - this.margin.left - this.margin.right;
        },
        chromosome: {
            handler: function () {
                this.drawPlot();
            },
            deep: true
        }
    },
    methods: {
        getPlotElem: function () {
            return "#" + this.plotID;
        },
        tooltip: function(donorID, y) {
            this.tooltipInfo.var = donorID;
            
            this.tooltipInfo.left = d3.event.x;
            this.tooltipInfo.top = y + this.margin.top;

            dispatch.call("link-donor", null, donorID);
            dispatch.call("link-genome", null, d3.event.x);
        },
        tooltipDestroy: function() {
            this.tooltipInfo.top = null;
            this.tooltipInfo.left = null;

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

            
        }
    }
}
</script>

<style scoped lang="scss">

@import './../../variables.scss';
@import './plot-style.scss';

</style>