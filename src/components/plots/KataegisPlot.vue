<template>
    <div>
        <div :id="this.plotElemID" class="plot-component"></div>

        <div :id="this.tooltipElemID" class="tooltip" :style="this.tooltipPositionAttribute">
            <table>
                <tr>
                    <th>Donor</th><td>{{ this.tooltipInfo.donorID }}</td>
                </tr>
                <tr>
                    <th>Project</th><td>{{ this.tooltipInfo.projID }}</td>
                </tr>
                <!--<tr>
                    <th>Count</th><td>{{ this.tooltipInfo.kataegisCount }} (chr{{ this.selectedChromosome.name }})</td>
                </tr>-->
            </table>
        </div>

         <div class="spinner-wrapper" v-if="loading">
            <Spinner class="spinner"></Spinner>
        </div>
        <div class="bottom-options">
            <ChromosomeSelect />
        </div>

        <div class="plot-info" v-if="showInfo">
            <h3>Info</h3>
            <p>This plot displays each donor, with mutations in "kataegis regions" highlighted along the chromosome. </p>
            <p>For the purposes of this plot, kataegis is defined as six or more mutations with an average intermutation distance of less than or equal to 1,000 bp.</p>
            <p>To view the rainfall plot for a donor, click on its colored row.</p>
            <p>To zoom in along chromosome location, click and drag mouse below the axis. To zoom out, double click.</p>
            <p>Drag along the y axis to pan across additional donors.</p>
        </div>
    </div>
</template>

<script>
import * as d3 from 'd3';
import plotMixin from './../../mixins/plot-mixin.js';
import API from './../../api.js';
import { getTranslation } from './../../helpers.js';
import { CHROMOSOMES, CHROMOSOME_LENGTHS } from './../../constants.js';
import { dispatch } from './../../plot-link.js';

// child components
import Spinner from './../Spinner.vue';
import ChromosomeSelect from './../ChromosomeSelect.vue';

export default {
    name: 'KataegisPlot',
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
            tooltipInfo: {
                donorID: "",
                projID: "",
                kataegisCount: ""
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
    watch: {
        selectedChromosome: {
            handler: function() {
                this.drawPlot();
            },
            deep: true
        }
    },
    methods: {
        tooltip: function(donorID) {
            this.tooltipInfo.donorID = donorID;
            var projID = this.plotData[donorID]["proj_id"];
            this.tooltipInfo.projID = projID;
            if(this.plotData[donorID]["kataegis"][this.selectedChromosome.name] == null) {
                this.tooltipInfo.kataegisCount = 0;
            } else {
                this.tooltipInfo.kataegisCount = this.plotData[donorID]["kataegis"][this.selectedChromosome.name].length;
            }
            this.tooltipPosition.left = d3.event.x;
            this.tooltipPosition.top = this.height + this.margin.top;

            dispatch.call("link-donor", null, donorID);
            dispatch.call("link-project", null, projID);
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
            var params = {
                "sources": vm.selectedDatasets
            };
            API.fetchKataegis(params).then(function (data) {
                vm.plotData = data;
                
                vm.drawPlot();
                vm.loading = false;

                vm.$store.dispatch('emitDatasetsLegend');
            });

        },
        drawPlot: function () {
            var vm = this;

            if(vm.plotData == null) {
                return;
            }

            var sampleNames = Object.keys(vm.plotData);
            var numSamples = sampleNames.length;
            
            // y scale
            let minBarHeight = 10;
            var barHeight = Math.max(minBarHeight, vm.height / numSamples);
            // expand plot height to account for minimum bar height adjustments
            let plotHeight = barHeight * numSamples;
            var yMargin = 2;

            /**
             * Scales
             */
            var y = d3.scaleBand()
                .domain(sampleNames)
                .range([0, plotHeight]);
            
            /**
             * SVG Elements
             */
            // remove existing svg element
            d3.select(this.plotSelector).select("svg").remove();
            
            // create new svg element
            vm.svg = d3.select(this.plotSelector)
                .append("svg")
                .attr("width", vm.width + vm.margin.left + vm.margin.right)
                .attr("height", plotHeight + vm.margin.top + vm.margin.bottom)
                .append("g")
                .attr("transform",
                    "translate(" + vm.margin.left + "," + vm.margin.top + ")")
                .on('mouseleave', vm.tooltipDestroy);
            
            let YContainer = vm.svg.append("g")
                .attr("transform", "translate(0,0)");
            
            // plot elements
            let sampleBars = YContainer.selectAll(".sample-bar-g")
                .data(sampleNames)
                .enter().append("g")
                .attr("class", "sample-bar-g")
                .attr("transform", function (d, i) {
                    return "translate(0," + (i * barHeight) + ")";
                });
            
            sampleBars.append("rect")
                .attr("class", "sample-bar")
                .attr("x", 0)
                .attr("y", 0)
                .attr("width", vm.width)
                .attr("height", barHeight - yMargin)
                .attr("fill", function(d) { return vm.$store.getters.datasetColor(vm.plotData[d]["proj_id"]); })
                .style("cursor", "pointer")
                .on('mousemove', function(d) { vm.tooltip(d) })
                .on('click', (d) => {
                    vm.enterSingleDonorMode(d, vm.plotData[d]["proj_id"]);
                });
            
            
            var chr_x = {};
            var chrLen, chrName, chr_i;
            
            if(vm.showAllChromosomes) {
                let genomeLength = CHROMOSOMES.map((name) => CHROMOSOME_LENGTHS[name]).reduce((a, h) => a + h);
                var cumulativeLength = 0;
                for(chr_i = 0; chr_i < CHROMOSOMES.length; chr_i++) {
                    chrName = CHROMOSOMES[chr_i];
                    chrLen = CHROMOSOME_LENGTHS[chrName];
                    chr_x[chrName] = d3.scaleLinear()
                        .domain([0, chrLen])
                        .range([vm.width*(cumulativeLength / genomeLength), vm.width*((cumulativeLength + chrLen) / genomeLength)]);
                    
                    sampleBars.selectAll(".sample-bar-g")
                        .data(function (d) {
                            var sampleMutations = vm.plotData[d]["kataegis"][chrName];
                            if(sampleMutations == null) {
                                return [];
                            } else {
                                return sampleMutations;
                            }
                        })
                        .enter().append("rect")
                        .attr("class", "kataegis-region")
                        .attr("x", function (d) {
                            return chr_x[chrName](+d);
                        })
                        .attr("y", 0)
                        .attr("width", 3)
                        .attr("height", barHeight - yMargin)
                        .attr("fill-opacity", 0.5)
                        .attr("fill", "black");

                    cumulativeLength += chrLen;
                }

            } else {
                // SINGLE CHROMOSOME
                chrName = vm.selectedChromosome.name;
                chrLen = CHROMOSOME_LENGTHS[chrName];
                chr_x[chrName] = d3.scaleLinear()
                    .domain([vm.selectedChromosome.start, vm.selectedChromosome.end])
                    .range([0, vm.width]);
                
                sampleBars.selectAll(".sample-bar-g")
                    .data(function (d) {
                        var sampleMutations = vm.plotData[d]["kataegis"][chrName];
                        if(sampleMutations == null) {
                            return [];
                        } else {
                            return sampleMutations;
                        }
                    })
                    .enter().append("rect")
                    .attr("class", "kataegis-region")
                    .attr("x", function (d) {
                        return chr_x[chrName](+d);
                    })
                    .attr("y", 0)
                    .attr("width", 3)
                    .attr("height", barHeight - yMargin)
                    .attr("fill-opacity", 0.5)
                    .attr("fill", "black");
            }

            /**
             * Dispatch indicators
             */
            let donorHighlight = YContainer.append("g")
                .attr("class", "donor-highlight");
            
            donorHighlight.append("line")
                .attr("x1", 0)
                .attr("y1", 0)
                .attr("x2", vm.width)
                .attr("y2", 0)
                .attr("stroke", "#000")
                .attr("stroke-width", 1)
                .attr("stroke-opacity", 0);
            
            donorHighlight.append("line")
                .attr("x1", 0)
                .attr("y1", barHeight - yMargin)
                .attr("x2", vm.width)
                .attr("y2", barHeight - yMargin)
                .attr("stroke", "#000")
                .attr("stroke-width", 1)
                .attr("stroke-opacity", 0);
            
            let genomeHighlight = YContainer.append("g")
                .append("rect")
                .attr("x", 0)
                .attr("y", 0)
                .attr("width", 1)
                .attr("height", plotHeight + vm.margin.top + vm.margin.bottom)
                .attr("transform", "translate(" + (-vm.margin.left - vm.margin.right) + "," + (-vm.margin.top) + ")")
                .attr("fill-opacity", 0)
                .attr("fill", "silver");
            
            
            /**
             * Axes
             */
            // y axis
            let yAxis = YContainer.append("g")
                .attr("class", "y_axis");
            
            yAxis.call(d3.axisLeft(y).tickSizeOuter(0));

            // y axis drag target
            yAxis.append("rect")
                .attr("class", "y-drag-target")
                .attr("width", vm.margin.left)
                .attr("height", plotHeight)
                .attr("x", -vm.margin.left)
                .attr("fill", "transparent")
                .attr("fill-opacity", "0")
                .style("cursor", "pointer")
                .call(d3.drag().container(document.querySelector("#" + vm.plotElemID)).on("drag", () => {
                    var newY = getTranslation(YContainer.attr("transform"))[1] + d3.event.dy;
                    newY = Math.max(-plotHeight + vm.height, newY);
                    newY = Math.min(0, newY);
                    YContainer.attr("transform", "translate(0," + newY + ")");
                }));
            
            // y axis text label
            vm.svg.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 0 - vm.margin.left + 5)
                .attr("x", 0 - (vm.height / 2))
                .attr("dy", "1em")
                .style("text-anchor", "middle")
                .text("Donor");  
             
            
            // white background rects to hide overflow-y
            vm.svg.append("g")
                .append("rect")
                .attr("x", -vm.margin.left)
                .attr("y", vm.height)
                .attr("width", vm.width + vm.margin.left + vm.margin.right)
                .attr("height", plotHeight)
                .attr("fill", "#FFF");

            // x axis
            var xAxis;
            if(vm.showAllChromosomes) {
                for(chr_i = 0; chr_i < CHROMOSOMES.length; chr_i++) {
                    chrName = CHROMOSOMES[chr_i];
                    xAxis = vm.svg.append("g")
                        .attr("transform", "translate(0," + vm.height + ")")
                        .call(d3.axisBottom(chr_x[chrName]).tickValues([0]).tickFormat(() => chrName));
                }
            } else {
                // SINGLE CHROMOSOME
                chrName = vm.selectedChromosome.name;
                xAxis = vm.svg.append("g")
                        .attr("transform", "translate(0," + vm.height + ")")
                        .call(d3.axisBottom(chr_x[chrName]));
                

                // brushing                
                xAxis.append("g")
                .attr("class", "brush")
                .call(
                    d3.brushX()
                        .on("end." + vm.plotElemID, () => {
                            var s = d3.event.selection;
                            var chrOptions;
                            if(s) {
                                var s2 = s.map((el) => Math.floor(chr_x[chrName].invert(el)));
                                chrOptions = {
                                    start: s2[0],
                                    end: s2[1],
                                    name: vm.selectedChromosome.name
                                }
                                vm.$store.commit('setSelectedChromosome', chrOptions)
                            } else {
                                chrOptions = {
                                    start: 0,
                                    end: CHROMOSOME_LENGTHS[vm.selectedChromosome.name],
                                    name: vm.selectedChromosome.name
                                }
                                vm.$store.commit('setSelectedChromosome', chrOptions)
                            }
                            vm.drawPlot();
                        })
                );
            }
            
            // x axis text label
            vm.svg.append("text")             
                .attr("transform",
                        "translate(" + (vm.width/2) + " ," + (vm.height + vm.margin.top + 20) + ")")
                .style("text-anchor", "middle")
                .text("Chromosome" + (vm.showAllChromosomes ? "" : (" " + vm.selectedChromosome.name + " Location")));
            
            /**
             * Dispatch callbacks
             */
            dispatch.on("link-donor." + this.plotElemID, function(donorID) {
                let i = sampleNames.indexOf(donorID);
                if(i != -1) {
                    // move donor highlight group
                    donorHighlight
                        .attr("transform", "translate(0," + y(donorID) + ")");

                    // show donor highlight
                    donorHighlight.selectAll("line")
                        .attr("stroke-opacity", 0.5);

                } else {
                    // hide donor highlight
                    donorHighlight.selectAll("line")
                        .attr("stroke-opacity", 0);
                }
            });

            dispatch.on("link-donor-destroy." + this.plotElemID, function() {
                // hide donor highlight
                donorHighlight.selectAll("line")
                    .attr("stroke-opacity", 0);
            });

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

<style scoped lang="scss">

@import './../../style/variables.scss';
@import './../../style/plots.scss';

.plot-component {
    overflow-y: hidden;
    overflow-x: hidden;
}

</style>
