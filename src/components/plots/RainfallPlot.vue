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

         <div class="spinner-wrapper">
            <Spinner v-if="loading" class="spinner"></Spinner>
        </div>
        <div class="bottom-options">
            <ChromosomeSelect ref="chrSelect" class="option-control" />
            <div class="option-control">
                <input type="checkbox" v-model="highlightKataegis" :id="this.plotID + '_highlight_kataegis'" />
                <label :for="this.plotID + '_highlight_kataegis'">Highlight Kataegis Regions</label>
            </div>
        </div>

        <div class="plot-info" v-if="showInfo">
            <h3>Info</h3>
            <p>This plot displays mutations by their genome location and the distance to the previous mutation. Points are colored by mutation context (e.g. A[T>G]C)</p>
        </div>
    </div>
</template>

<script>
import { globalDataOptions, globalChromosomeSelected } from './../../buses/data-options-bus.js';
import { dispatch } from './plot-link.js';
import API from './../../api.js'
import Spinner from './../Spinner.vue'
import ChromosomeSelect from './../ChromosomeSelect.vue'

import * as d3 from 'd3';

export default {
    name: 'RainfallPlot',
    props: ['plotIndex', 'showInfo', 'windowWidth', 'plotOptions'],
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
            },
            dataOptions: globalDataOptions,
            chromosome: globalChromosomeSelected,
            highlightKataegis: true
        };
    },
    mounted: function() {
        this.$emit('titleInit', this.title + " (" + this.plotOptions.proj_id + ", " + this.plotOptions.donor_id + ")");
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
            this.width = val - 40 - this.margin.left - this.margin.right;
        },
        chromosome: {
            handler: function () {
                this.updatePlot();
            },
            deep: true
        },
        highlightKataegis: function() {
            this.drawPlot();
        }
    },
    methods: {
        getPlotElem: function () {
            return "#" + this.plotID;
        },
        getChromosomeLength: function (name) {
            return this.$refs.chrSelect.getChromosomeLength(name);
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
            let vm = this;
            vm.loading = true;

            let rainfallOptions = {
                'proj_id': vm.plotOptions.proj_id,
                'donor_id': vm.plotOptions.donor_id,
                'chromosome': vm.chromosome.value
            }

            API.fetchRainfall(rainfallOptions).then(function (data) {
                vm.plotData = data;
                vm.drawPlot();
                vm.loading = false;
            });

        },
        drawPlot: function () {
            let vm = this;

            if(vm.plotData == null) {
                return;
            }

            let chrLen = vm.getChromosomeLength(vm.chromosome.value);
            let maxDist = d3.max( vm.plotData.map((el) => +el.mut_dist) );

            let kataegisPoints = vm.plotData.filter((el) => (+el.kataegis == 1));
            console.log(kataegisPoints);

            // scales
            let x = d3.scaleLinear()
                .range([0, vm.width])
                .domain([0, chrLen]);
            let y = d3.scaleLinear()
                .range([vm.height, 0])
                .domain([0, maxDist]);
            
            // svg
            let plotElemID = vm.getPlotElem();
            d3.select(plotElemID).select("svg").remove();

            vm.svg = d3.select(plotElemID)
                .append("svg")
                .attr("width", vm.width + vm.margin.left + vm.margin.right)
                .attr("height", vm.height + vm.margin.top + vm.margin.bottom)
                .append("g")
                .attr("transform",
                    "translate(" + vm.margin.left + "," + vm.margin.top + ")");
            
            // kataegis highlights
            let kataegisBars = vm.svg.selectAll('.kataegis-bar')
			    .data(kataegisPoints)
			.enter().append('rect')
                .attr('class', 'kataegis-bar')
                .attr('x', function(d){ return x(+d.pos); })
                .attr('y', 0)
                .attr('width', 3)
                .attr('height', vm.height)
                .attr('opacity', (vm.highlightKataegis ? 1 : 0))
                .attr('fill', "#FFC4C4");

            // hash string to int: 
            // https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript-jquery
            let hashFunc = function(str) {
                var hash = 0, i, chr;
                if (str.length === 0) return hash;
                for (i = 0; i < str.length; i++) {
                    chr   = str.charCodeAt(i);
                    hash  = ((hash << 5) - hash) + chr;
                    hash |= 0; // Convert to 32bit integer
                }
                return hash;
            };
            // get min and max hash values for mutation contexts
            let contextExtent = d3.extent(vm.plotData.map((el) => hashFunc(el.context)));
            let contextOffset = 0 - contextExtent[0];
            let contextMax = contextExtent[1] + contextOffset;
            
            // point for each mutation, colored by mutation context
            let points = vm.svg.selectAll('.point')
			    .data(vm.plotData)
			.enter().append('circle')
                .attr('class', 'point')
                .attr('cx', function(d){return x(+d.pos);})
                .attr('cy', function(d){ return y(+d.mut_dist); })
                .attr('r', 3)
                .style('fill', function(d){ 
                    // map hashed value to value between 0 and 1
                    return d3.interpolateRainbow((hashFunc(d.context) + contextOffset) / contextMax); 
                });
                
            
             // x Axis
            vm.svg.append("g")
                .attr("transform", "translate(0," + vm.height + ")")
                .call(d3.axisBottom(x));

            // y Axis
            vm.svg.append("g")
                .call(d3.axisLeft(y).tickSizeOuter(0));
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

@import './../../variables.scss';
@import './plot-style.scss';

</style>
