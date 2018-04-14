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
                    <th>Count</th><td>{{ this.tooltipInfo.kataegisCount }} (chr{{ this.options.chromosome }})</td>
                </tr>
            </table>
            <span>Click for Rainfall Plot</span>
        </div>

         <div class="spinner-wrapper">
            <Spinner v-if="loading" class="spinner"></Spinner>
        </div>
        <div class="bottom-options">
            <ChromosomeSelect v-on:chromosome-select="setChromosome($event)" ref="chrSelect"/>
        </div>

        <div class="plot-info" v-if="showInfo">
            <h3>Info</h3>
            <p>This plot displays each donor, with mutations in "kataegis regions" highlighted along the chromosome. </p>
            <p>For the purposes of this plot, kataegis is defined as six or more mutations with an average intermutation distance of less than or equal to 1,000 bp.</p>
        </div>
    </div>
</template>

<script>
import { dataOptions } from './../../buses/data-options-bus.js';
import { dispatch } from './plot-link.js';
import API from './../../api.js'
import Spinner from './../Spinner.vue'
import ChromosomeSelect from './../ChromosomeSelect.vue'

import * as d3 from 'd3';

export default {
    name: 'KataegisPlot',
    props: ['plotIndex', 'showInfo'],
    components: {
        Spinner,
        ChromosomeSelect
    },
    data: function () {
        return {
            loading: false,
            plotData: null,
            windowWidth: 0,
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
            globalDataOptions: dataOptions,
            options: {
                chromosome: ""
            }
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
        options: {
            handler: function () {
                this.drawPlot();
            },
            deep: true
        }
    },
    mounted: function () {
        let vm = this;
        vm.windowWidth = window.innerWidth;
        window.addEventListener('resize', function () {
            vm.windowWidth = window.innerWidth;
            if (vm.plotData != null) {
                vm.drawPlot();
            }
        });
    },
    methods: {
        getPlotElem: function () {
            return "#" + this.plotID;
        },
        setChromosome: function (chr) {
            this.options.chromosome = chr;
        },
        getChromosome: function (name) {
            return this.$refs.chrSelect.getChromosome(name);
        },
        tooltip: function(donorID, y) {
            this.tooltipInfo.donorID = donorID;
            var projID = this.plotData[donorID]["proj_id"];
            this.tooltipInfo.projID = projID;
            if(this.plotData[donorID]["kataegis"][this.options.chromosome] == null) {
                this.tooltipInfo.kataegisCount = 0;
            } else {
                this.tooltipInfo.kataegisCount = this.plotData[donorID]["kataegis"][this.options.chromosome].length;
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
        updatePlot: function () {
            var vm = this;
            vm.loading = true;
            if (vm.options.chromosome == "") {
                vm.options.chromosome = "1"
            }
            vm.globalDataOptions['chromosome'] = vm.options.chromosome;
            API.fetchKataegis(vm.globalDataOptions).then(function (data) {
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

            x.domain([0, vm.getChromosome(vm.options.chromosome)]);

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
            let sampleBars = vm.svg.selectAll(".sample-bar")
                .data(sampleNames)
                .enter().append("g")
                .attr("transform", function (d, i) {
                    return "translate(0," + (i * barHeight) + ")";
                });

            sampleBars.append("rect")
                .attr("x", 0)
                .attr("y", 0)
                .attr("width", vm.width)
                .attr("height", barHeight - yMargin)
                .attr("fill", function(d) { return colorScale(vm.plotData[d]["proj_id"]); })
                .on('mousemove', function(d, i) { vm.tooltip(d, barHeight*i) });

            sampleBars.selectAll(".sample-bar")
                .data(function (d) {
                    var sampleMutations = vm.plotData[d]["kataegis"][vm.options.chromosome];
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
                .call(d3.axisLeft(y));
            
            // dispatch callbacks
            dispatch.on("link-donor.kataegis", function(donorID) {
                donorHighlight
                    .attr("y", barHeight * sampleNames.indexOf(donorID))
                    .attr("opacity", 1);
            });

            dispatch.on("link-donor-destroy.kataegis", function() {
                donorHighlight.attr("opacity", 0);
            });

            dispatch.on("link-genome.kataegis", function(location) {
                genomeHighlight
                    .attr("x", location)
                    .attr("opacity", 1);
            });

            dispatch.on("link-genome-destroy.kataegis", function() {
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
