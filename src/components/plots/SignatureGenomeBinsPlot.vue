<template>
    <div>
        <div :id="this.plotElemID" class="plot-component"></div>
         <div class="spinner-wrapper" v-if="loading">
            <Spinner class="spinner"></Spinner>
        </div>
        <div class="bottom-options">
            <ChromosomeSelect ref="chrSelect" />
            <!--<div class="option-control">
                <input type="checkbox" v-model="stackBars" :id="this.plotID + '_stack_bars'" />
                <label :for="this.plotID + '_stack_bars'">Stack Bars</label>
            </div>-->
        </div>
        
        <div class="plot-info" v-if="showInfo">
            <h3>Info</h3>
            <p>This plot displays bins of mutations assigned to the selected signatures for the selected datasets, across the genome.</p>
            <p>By default, bars for each region are overlaid from front to back in order from smallest to largest number of mutations.</p>
        </div>
    </div>
</template>

<script>
import * as d3 from 'd3';
import plotMixin from './../../mixins/plot-mixin.js';
import API from './../../api.js';
import { CHROMOSOMES } from './../../constants.js';
import { dispatch } from './plot-link.js';
 
// child components
import Spinner from './../Spinner.vue';
import ChromosomeSelect from './../ChromosomeSelect.vue';

export default {
    name: 'SignatureGenomeBinsPlot',
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
                bottom: 50,
                left: 90
            },
            stackBars: false
        };
    },
    computed: {
        height: function() {
            return 400 - this.margin.top - this.margin.bottom;
        },
        width: function() {
            return (this.windowWidth*0.8) - 40 - this.margin.left - this.margin.right;
        }
    },
    watch: {
        selectedChromosome: {
            handler: function () {
                this.drawPlot();
            },
            deep: true
        },
        stackBars: function() {
            this.drawPlot();
        }
    },
    methods: {
        tooltipDestroy: function() {
            dispatch.call("link-donor-destroy");
        },
        updatePlot: function () {
            var vm = this;
            vm.loading = true;
            var params = {
                "sources": vm.selectedDatasets,
                "signatures": vm.selectedSignatures
            };
            API.fetchGenomeSignatureBins(params).then(function (data) {
                vm.plotData = data;

                vm.drawPlot();
                vm.loading = false;
                
                vm.$store.dispatch('emitSignaturesLegend');
            });
        },
        drawPlot: function () {
            var vm = this;

            if(vm.plotData == null) {
                return;
            }
            
            // max(array of chromosome objects => array of region objects => array of counts)
            var yMax = d3.max(
                Object.values(vm.plotData)
                    .map((chrData) => d3.max(
                        Object.values(chrData)
                            .map((regionData) => d3.max(
                                Object.values(regionData)
                            ))
                    ))
            );

            var y = d3.scaleLinear()
                .domain([0, yMax])
                .range([this.height, 0]);
            
            d3.select(this.plotSelector).select("svg").remove();

            vm.svg = d3.select(this.plotSelector)
                .append("svg")
                .attr("width", this.width + this.margin.left + this.margin.right)
                .attr("height", this.height + this.margin.top + this.margin.bottom)
                .append("g")
                .attr("transform",
                    "translate(" + vm.margin.left + "," + vm.margin.top + ")")
                .on('mousemove', function() { dispatch.call("link-genome", null, d3.event.x); })
                .on('mouseleave', vm.tooltipDestroy);
            
            // dispatch elements
            let genomeHighlight = vm.svg.append("g")
                .append("rect")
                .attr("x", 0)
                .attr("y", 0)
                .attr("width", 1)
                .attr("height", vm.height + vm.margin.top + vm.margin.bottom)
                .attr("transform", "translate(" + (-vm.margin.left - vm.margin.right) + "," + (-vm.margin.top) + ")")
                .attr("fill-opacity", 0)
                .attr("fill", "silver");
            
            var chr_x = {};
            var chr_i, chrLen, chrName;
            
            if(vm.showAllChromosomes) {
                let genomeLength = CHROMOSOMES.map((name) => vm.$store.getters.chromosomeLength(name)).reduce((a, h) => a + h);
                var cumulativeLength = 0;
                for(chr_i = 0; chr_i < CHROMOSOMES.length; chr_i++) {
                    chrName = CHROMOSOMES[chr_i];
                    chrLen = vm.$store.getters.chromosomeLength(chrName);
                    chr_x[chrName] = d3.scaleBand()
                        .domain(Object.keys(vm.plotData[chrName]))
                        .range([vm.width*(cumulativeLength / genomeLength), vm.width*((cumulativeLength + chrLen) / genomeLength)]);

                    cumulativeLength += chrLen;
                }
            } else {
                // SINGLE CHROMOSOME
                chrName = vm.selectedChromosome.name;
                chrLen = vm.$store.getters.chromosomeLength(chrName);
                chr_x[chrName] = d3.scaleBand()
                    .domain(Object.keys(vm.plotData[chrName]))
                    .range([0, vm.width]);
            }
            
            let selectedChromosomes = Object.keys(chr_x);
            for(chr_i = 0; chr_i < selectedChromosomes.length; chr_i++) {
                chrName = selectedChromosomes[chr_i];

                vm.svg.selectAll(".region-wrap-" + chrName)
                    .data(d3.entries(vm.plotData[chrName]))
                .enter().append("g")
                    .attr("class", "region-wrap-" + chrName)
                    .attr("transform", function (d) {
                        return "translate(" + chr_x[chrName](+d.key) + ",0)";
                    })
                    .selectAll(".bar")
                    .data(function(d) {
                        return d3.entries(d.value).sort((a, b) => {
                            return (+b.value) - (+a.value);
                        });
                    })
                .enter().append("rect")
                    .attr("class", "bar")
                    .attr("x", 0)
                    .attr("y", function (d) {
                        return y(+d.value);
                    })
                    .attr("width", chr_x[chrName].step())
                    .attr("height", function (d) {
                        return vm.height - y(+d.value);
                    })
                    .attr("fill-opacity", 1)
                    .attr("fill", function (d) {
                        return vm.$store.getters.signatureColor(d.key);
                    });
            }

            // x Axis
            if(vm.showAllChromosomes) {
                for(chr_i = 0; chr_i < CHROMOSOMES.length; chr_i++) {
                    chrName = CHROMOSOMES[chr_i];
                    vm.svg.append("g")
                        .attr("transform", "translate(0," + vm.height + ")")
                        .call(d3.axisBottom(chr_x[chrName]).tickValues([0]).tickFormat(() => chrName));
                }
            } else {
                // SINGLE CHROMOSOME
                chrName = vm.selectedChromosome.name;
                chrLen = vm.$store.getters.chromosomeLength(chrName);
                vm.svg.append("g")
                        .attr("transform", "translate(0," + vm.height + ")")
                        .call(
                            d3.axisBottom(d3.scaleLinear().domain([0, chrLen]).range([0, vm.width]))
                        );
            }
            
            // text label for the x axis
            vm.svg.append("text")             
                .attr("transform",
                        "translate(" + (vm.width/2) + " ," + (vm.height + vm.margin.top + 20) + ")")
                .style("text-anchor", "middle")
                .text("Chromosome" + (vm.showAllChromosomes ? "" : (" " + vm.selectedChromosome.name + " Location")));

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
            dispatch.on("link-genome." + this.plotElemID, function(location) {
                genomeHighlight
                    .attr("x", location)
                    .attr("fill-opacity", 1);
            });

            dispatch.on("link-genome-destroy." + this.plotElemID, function() {
                genomeHighlight.attr("fill-opacity", 0);
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
