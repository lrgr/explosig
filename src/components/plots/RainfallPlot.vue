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
            <ChromosomeSelect ref="chrSelect" class="option-control" />
            <div class="option-control">
                <input type="checkbox" v-model="logScale" :id="this.plotID + '_log_scale'" />
                <label :for="this.plotID + '_log_scale'">Log Scale</label>
            </div>
            <div class="option-control">
                <input type="checkbox" v-model="highlightKataegis" :id="this.plotID + '_highlight_kataegis'" />
                <label :for="this.plotID + '_highlight_kataegis'">Highlight Kataegis Events</label>
            </div>
            <div class="option-control">
                <label>Color by&nbsp;</label>
                <select>
                    <option>Mutation Context</option>
                    <!--<option>Assigned Signature</option>-->
                </select>
            </div>
        </div>

        <div class="plot-info" v-if="showInfo">
            <h3>Info</h3>
            <p>This plot displays mutations by their genome location and the distance to the previous mutation. Points are colored by mutation context (e.g. A[T>G]C)</p>
            <p>To zoom in along chromosome location, click and drag mouse below the axis. To zoom out, double click.</p>
        </div>
    </div>
</template>

<script>
import { globalDataOptions, globalChromosomeSelected, globalChromosomeLocation } from './../../buses/data-options-bus.js';
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
                bottom: 50,
                left: 90
            },
            tooltipInfo: {
                var: '',
                left: null,
                top: null
            },
            dataOptions: globalDataOptions,
            chromosome: globalChromosomeSelected,
            chromosomeLocation: globalChromosomeLocation,
            highlightKataegis: true,
            logScale: true
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
            this.width = (val*0.8) - 40 - this.margin.left - this.margin.right;
        },
        chromosome: {
            handler: function () {
                this.updatePlot();
            },
            deep: true
        },
        chromosomeLocation: {
            handler: function () {
                this.drawPlot();
            },
            deep: true
        },
        highlightKataegis: function() {
            this.drawPlot();
        },
        logScale: function() {
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

            // scales
            let x = d3.scaleLinear()
                .range([0, vm.width])
                .domain([vm.chromosomeLocation.start, vm.chromosomeLocation.end]);

            var y = d3.scaleLinear();
            if(vm.logScale) {
                y = d3.scaleLog();
            }
            y.range([vm.height, 0]);
            y.domain([1, maxDist]);
            
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
            
            // dispatch elements
            let donorHighlight = vm.svg.append("g")
                .append("rect")
                .attr("x", -vm.margin.left)
                .attr("y", -vm.margin.top)
                .attr("width", (vm.width + vm.margin.left + 10))
                .attr("height", (vm.height + vm.margin.top + vm.margin.bottom))
                .attr("opacity", 0)
                .attr("fill", "silver");
            
            let genomeHighlight = vm.svg.append("g")
                .append("rect")
                .attr("x", 0)
                .attr("y", 0)
                .attr("width", 20)
                .attr("height", vm.height + vm.margin.top + vm.margin.bottom)
                .attr("transform", "translate(" + (-vm.margin.left - vm.margin.right) + "," + (-vm.margin.top) + ")")
                .attr("opacity", 0)
                .attr("fill", "silver");
            
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
            
            // zoom with brush
            vm.svg.append("g")
                .attr("class", "brush")
                .call(
                    d3.brushX()
                        .on("end." + vm.plotID, brushend)
                );
            //create brush function redraw scatterplot with x selection
            function brushend() {
                var s = d3.event.selection;
                if(s) {
                    var s2 = s.map((el) => Math.floor(x.invert(el)));
                    vm.chromosomeLocation.start = s2[0];
                    vm.chromosomeLocation.end = s2[1];
                } else {
                    vm.chromosomeLocation.start = 0;
                    vm.chromosomeLocation.end = chrLen;
                }
                vm.drawPlot();
            }
                
            
             // x Axis
            vm.svg.append("g")
                .attr("transform", "translate(0," + vm.height + ")")
                .call(d3.axisBottom(x));
            
            // text label for the x axis
            vm.svg.append("text")             
                .attr("transform",
                        "translate(" + (vm.width/2) + " ," + (vm.height + vm.margin.top + 20) + ")")
                .style("text-anchor", "middle")
                .text("Chromosome Location");

            // y Axis
            vm.svg.append("g")
                .call(d3.axisLeft(y).tickSizeOuter(0));
            
            // text label for the y axis
            vm.svg.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 0 - vm.margin.left + 5)
                .attr("x", 0 - (vm.height / 2))
                .attr("dy", "1em")
                .style("text-anchor", "middle")
                .text("Distance to Previous Mutation");  
            
            // dispatch callbacks
            dispatch.on("link-donor." + this.plotID, function(donorID) {
                if(donorID == vm.plotOptions.donor_id) {
                    donorHighlight.attr("opacity", 0.5);
                } else {
                    donorHighlight.attr("opacity", 0);
                }
            });

            dispatch.on("link-donor-destroy." + this.plotID, function() {
                donorHighlight.attr("opacity", 0);
            });

            dispatch.on("link-genome." + this.plotID, function(location) {
                genomeHighlight
                    .attr("x", location)
                    .attr("opacity", 1);
            });

            dispatch.on("link-genome-destroy." + this.plotID, function() {
                genomeHighlight.attr("opacity", 0);
            });
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

@import './../../variables.scss';
@import './plot-style.scss';

</style>
