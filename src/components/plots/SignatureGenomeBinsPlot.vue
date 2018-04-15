<template>
    <div>
        <div :id="this.plotID" class="plot-component"></div>
         <div class="spinner-wrapper" v-if="loading">
            <Spinner class="spinner"></Spinner>
        </div>
        <div class="bottom-options">
            <ChromosomeSelect ref="chrSelect" />
        </div>
        
        <div class="plot-info" v-if="showInfo">
            <h3>Info</h3>
            <p>This plot displays bins of mutations assigned to the selected signatures for the selected datasets, across the genome.</p>
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
    name: 'SignatureGenomeBinsPlot',
    props: ['plotIndex', 'showInfo', 'windowWidth'],
    components: {
        Spinner,
        ChromosomeSelect
    },
    data: function () {
        return {
            title: 'Manhattan Plot with Signatures',
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
            dataOptions: globalDataOptions,
            chromosome: globalChromosomeSelected,
            chromosomeLocation: globalChromosomeLocation
        };
    },
    mounted: function() {
        this.$emit('titleInit', this.title);
    },
    computed: {
        height: function() {
            return 400 - this.margin.top - this.margin.bottom;
        },
        plotID: function() {
            return 'plot_' + this.plotIndex;
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
        chromosomeLocation: {
            handler: function () {
                this.drawPlot();
            },
            deep: true
        }
    },
    methods: {
        tooltipDestroy: function() {
            dispatch.call("link-donor-destroy");
        },
        getChromosomeLength: function (name) {
            return this.$refs.chrSelect.getChromosomeLength(name);
        },
        updatePlot: function () {
            var vm = this;
            vm.loading = true;
            vm.dataOptions['chromosome'] = vm.chromosome.value;
            API.fetchGenomeSignatureBins(vm.dataOptions).then(function (data) {
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

            var x = d3.scaleLinear().range([0, this.width]);
            var y = d3.scaleLinear().range([this.height, 0]);
            var c20 = d3.scaleOrdinal(d3.schemeDark2);

            let chrLen = vm.getChromosomeLength(vm.chromosome.value);
            let yMax = d3.max(this.plotData.map(row => d3.max(Object.values(row.vals).map(val => parseInt(val)))));
           
            x.domain([vm.chromosomeLocation.start, vm.chromosomeLocation.end]);
            y.domain([0, yMax]);

            var barWidth = 0;
            if (this.plotData.length >= 1) {
                var numBars = this.plotData.length;
                barWidth = (vm.width) / numBars;
            }

            let windowSize = (vm.chromosomeLocation.end - vm.chromosomeLocation.start) / chrLen;

            d3.select("#" + this.plotID).select("svg").remove();

            vm.svg = d3.select("#" + this.plotID)
                .append("svg")
                .attr("width", this.width + this.margin.left + this.margin.right)
                .attr("height", this.height + this.margin.top + this.margin.bottom)
                .append("g")
                .attr("transform",
                    "translate(" + vm.margin.left + "," + vm.margin.top + ")")
                .on('mouseleave', vm.tooltipDestroy);
            
            // dispatch elements
            let genomeHighlight = vm.svg.append("g")
                .append("rect")
                .attr("x", 0)
                .attr("y", 0)
                .attr("width", 20)
                .attr("height", vm.height + vm.margin.top + vm.margin.bottom)
                .attr("transform", "translate(" + (-vm.margin.left - vm.margin.right) + "," + (-vm.margin.top) + ")")
                .attr("opacity", 0)
                .attr("fill", "silver");

            vm.svg.selectAll(".bar-wrap")
                .data(this.plotData.filter((el) => {
                    return (+el.name >= vm.chromosomeLocation.start && +el.name <= vm.chromosomeLocation.end);
                }))
                .enter().append("g")
                .attr("transform", function (d) {
                    return "translate(" + x(+d.name) + ",0)";
                })
                .selectAll(".bar-wrap")
                .data(function(d) {
                    return Object.values(d.vals);
                })
                .enter().append("rect")
                .attr("class", "bar")
                .attr("x", 0)
                .attr("y", function (d) {
                    return y(+d);
                })
                .attr("width", barWidth * (1/windowSize))
                .attr("height", function (d) {
                    return vm.height - y(+d);
                })
                .attr("opacity", 0.4)
                .attr("fill", function (d, i) {
                    return c20(i);
                });

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
                .call(d3.axisLeft(y));
            
            // text label for the y axis
            vm.svg.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 0 - vm.margin.left + 5)
                .attr("x", 0 - (vm.height / 2))
                .attr("dy", "1em")
                .style("text-anchor", "middle")
                .text("Number of Mutations in Signature Bin");  
            
            // dispatch callbacks
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
