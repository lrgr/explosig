<template>
    <div>
        <div :id="this.plotID" class="plot-component"></div>

        <div :id="this.plotID + '_tooltip'" class="tooltip" :style="this.tooltipPosition">
            <table>
                <tr>
                    <th>Donor</th><td>{{ this.tooltipInfo.donorID }}</td>
                </tr>
                <tr>
                    <th>Project</th><td>{{ this.tooltipInfo.projID }}</td>
                </tr>
                <tr>
                    <th>Count</th><td>{{ this.tooltipInfo.kataegisCount }} (chr{{ this.chromosome.value }})</td>
                </tr>
            </table>
            <span>Click for Rainfall Plot</span>
        </div>

         <div class="spinner-wrapper">
            <Spinner v-if="loading" class="spinner"></Spinner>
        </div>
        <div class="bottom-options">
            <ChromosomeSelect ref="chrSelect" />
        </div>

        <div class="plot-info" v-if="showInfo">
            <h3>Info</h3>
            <p>This plot displays each donor, with mutations in "kataegis regions" highlighted along the chromosome. </p>
            <p>For the purposes of this plot, kataegis is defined as six or more mutations with an average intermutation distance of less than or equal to 1,000 bp.</p>
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
    name: 'KataegisPlot',
    props: ['plotIndex', 'showInfo', 'windowWidth'],
    components: {
        Spinner,
        ChromosomeSelect
    },
    data: function () {
        return {
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
                donorID: "",
                projID: "",
                kataegisCount: "",
                left: null,
                top: null
            },
            dataOptions: globalDataOptions,
            chromosome: globalChromosomeSelected
        };
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
                this.drawPlot();
            },
            deep: true
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
            this.tooltipInfo.donorID = donorID;
            var projID = this.plotData[donorID]["proj_id"];
            this.tooltipInfo.projID = projID;
            if(this.plotData[donorID]["kataegis"][this.chromosome.value] == null) {
                this.tooltipInfo.kataegisCount = 0;
            } else {
                this.tooltipInfo.kataegisCount = this.plotData[donorID]["kataegis"][this.chromosome.value].length;
            }
            this.tooltipInfo.left = d3.event.x;
            this.tooltipInfo.top = y + this.margin.top;

            dispatch.call("link-donor", null, donorID);
            dispatch.call("link-project", null, projID);
            dispatch.call("link-genome", null, d3.event.x);
        },
        tooltipDestroy: function() {
            this.tooltipInfo.top = null;
            this.tooltipInfo.left = null;

            dispatch.call("link-donor-destroy");
            dispatch.call("link-genome-destroy");
        },
        addRainfallPlot: function(donor_id, proj_id) {
            console.log(donor_id, proj_id);
        },
        updatePlot: function () {
            var vm = this;
            vm.loading = true;

            API.fetchKataegis(vm.dataOptions).then(function (data) {
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

            var sampleNames = Object.keys(vm.plotData);
            var numSamples = sampleNames.length;
            var x = d3.scaleLinear().range([0, vm.width]);
            var y = d3.scaleBand()
                .domain(sampleNames)
                .range([0, vm.height]);

            x.domain([0, vm.getChromosomeLength(vm.chromosome.value)]);

            var barHeight = vm.height / numSamples;
            var yMargin = 2;

            var colorScale = d3.scaleOrdinal(d3.schemePastel1);

            var plotElemID = vm.getPlotElem();
            d3.select(plotElemID).select("svg").remove();

            vm.svg = d3.select(plotElemID)
                .append("svg")
                .attr("width", vm.width + vm.margin.left + vm.margin.right)
                .attr("height", vm.height + vm.margin.top + vm.margin.bottom)
                .append("g")
                .attr("transform",
                    "translate(" + vm.margin.left + "," + vm.margin.top + ")")
                .on('mouseleave', vm.tooltipDestroy);

            // dispatch elements
            let donorHighlight = vm.svg.append("g")
                .append("rect")
                .attr("x", -vm.margin.left)
                .attr("y", 0)
                .attr("width", (vm.width + vm.margin.left + 10))
                .attr("height", barHeight + yMargin)
                .attr("transform", "translate(0," + (-yMargin) + ")")
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
            
            // plot elements
            let sampleBars = vm.svg.selectAll(".sample-bar-g")
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
                .attr("fill", function(d) { return colorScale(vm.plotData[d]["proj_id"]); })
                .on('mousemove', function(d, i) { vm.tooltip(d, barHeight*i) })
                .on('click', (d, i) => {
                    vm.addRainfallPlot(d, vm.plotData[d]["proj_id"]);
                });

            sampleBars.selectAll(".sample-bar-g")
                .data(function (d) {
                    var sampleMutations = vm.plotData[d]["kataegis"][vm.chromosome.value];
                    if(sampleMutations == null) {
                        return [];
                    } else {
                        return sampleMutations;
                    }
                })
                .enter().append("rect")
                .attr("class", "kataegis-region")
                .attr("x", function (d) {
                    return x(+d);
                })
                .attr("y", 0)
                .attr("width", 3)
                .attr("height", barHeight - yMargin)
                .attr("opacity", 0.5)
                .attr("fill", "black");

            // x Axis
            vm.svg.append("g")
                .attr("transform", "translate(0," + vm.height + ")")
                .call(d3.axisBottom(x));

            // y Axis
            vm.svg.append("g")
                .call(d3.axisLeft(y).tickSizeOuter(0));
            
            // dispatch callbacks
            dispatch.on("link-donor." + this.plotID, function(donorID) {
                donorHighlight
                    .attr("y", barHeight * sampleNames.indexOf(donorID))
                    .attr("opacity", 1);
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
