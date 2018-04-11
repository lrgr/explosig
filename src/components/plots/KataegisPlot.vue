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
        </div>

         <div class="spinner-wrapper">
            <Spinner v-if="loading" class="spinner"></Spinner>
        </div>
        <div class="bottom-options">
            <ChromosomeSelect v-on:chromosome-select="setChromosome($event)" ref="chrSelect"/>
        </div>
    </div>
</template>

<script>
import API from './../../api.js'
import Spinner from './../Spinner.vue'
import ChromosomeSelect from './../ChromosomeSelect.vue'

import * as d3 from 'd3';

export default {
    name: 'KataegisPlot',
    props: ['dataOptions', 'plotIndex'],
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
                left: 0,
                top: 0
            },
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
            if(this.tooltipInfo.left == 0 && this.tooltipInfo.top == 0) {
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
            this.tooltipInfo.projID = this.plotData[donorID]["proj_id"];
            if(this.plotData[donorID]["kataegis"][this.options.chromosome] == null) {
                this.tooltipInfo.kataegisCount = 0;
            } else {
                this.tooltipInfo.kataegisCount = this.plotData[donorID]["kataegis"][this.options.chromosome].length;
            }
            this.tooltipInfo.left = d3.event.x;
            this.tooltipInfo.top = y + this.margin.top;
        },
        updatePlot: function () {
            var vm = this;
            vm.loading = true;
            if (vm.options.chromosome == "") {
                vm.options.chromosome = "1"
            }
            vm.dataOptions['chromosome'] = vm.options.chromosome;

            API.fetchKataegis(this.dataOptions).then(function (data) {
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
            var y = d3.scaleOrdinal().domain(sampleNames).range(Array.from({
                length: numSamples
            }, (v, i) => (i + 0.5) * (vm.height / numSamples)))

            x.domain([0, vm.getChromosome(vm.options.chromosome)]);
            y.domain([0, numSamples]);

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
                    "translate(" + vm.margin.left + "," + vm.margin.top + ")");

            var sampleBars = vm.svg.selectAll(".sample-bar")
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
                .on('mouseover', function(d, i) { vm.tooltip(d, barHeight*i) });

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
                .call(d3.axisLeft(y).tickValues(sampleNames));
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

@import './../../variables.scss';
@import './plot_style.scss';

</style>
