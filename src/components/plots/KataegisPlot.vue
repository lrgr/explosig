<template>
    <div>
        <div :id="this.plotElemID" class="plot-component"></div>
        <Karyotype :plotID="'k_' + this.plotElemID" />

        <div :id="this.plotElemID + '_tooltip'" class="tooltip" :style="this.tooltipPosition">
            <table>
                <tr>
                    <th>Donor</th><td>{{ this.tooltipInfo.donorID }}</td>
                </tr>
                <tr>
                    <th>Project</th><td>{{ this.tooltipInfo.projID }}</td>
                </tr>
                <tr>
                    <th>Count</th><td>{{ this.tooltipInfo.kataegisCount }} (chr{{ this.selectedChromosome.name }})</td>
                </tr>
            </table>
            <span>&nbsp;Click for Rainfall Plot</span>
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
import { mapGetters } from 'vuex';
import API from './../../api.js';
import { getTranslation, getUUID } from './../../helpers.js';
import { dispatch } from './plot-link.js';

// child components
import Spinner from './../Spinner.vue';
import ChromosomeSelect from './../ChromosomeSelect.vue';
import Karyotype from './../Karyotype.vue';

export default {
    name: 'KataegisPlot',
    props: ['plotID', 'showInfo', 'plotOptions'],
    components: {
        Spinner,
        ChromosomeSelect,
        Karyotype
    },
    data: function () {
        return {
            title: 'Kataegis',
            loading: false,
            plotData: null,
            svg: null,
            margin: {
                top: 20,
                right: 30,
                bottom: 50,
                left: 90
            },
            tooltipInfo: {
                donorID: "",
                projID: "",
                kataegisCount: "",
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
        width: function() {
            return (this.windowWidth*0.8) - 40 - this.margin.left - this.margin.right;
        },
        plotElemID: function () {
            return 'plot_' + this.plotID;
        },
        tooltipPosition: function() {
            if(this.tooltipInfo.left == null || this.tooltipInfo.top == null) {
                return 'display: none;';
            } else {
                return 'left: ' + this.tooltipInfo.left + 'px; top: ' + this.tooltipInfo.top + 'px;';
            }
        },
        ...mapGetters([
            'selectedChromosome',
            'selectedDatasets',
            'windowWidth'
        ])
    },
    watch: {
        windowWidth: function (val) {
            this.drawPlot();
        },
        selectedChromosome: {
            handler: function() {
                this.drawPlot();
            },
            deep: true
        }
    },
    methods: {
        getPlotElem: function () {
            return "#" + this.plotElemID;
        },
        tooltip: function(donorID) {
            this.tooltipInfo.donorID = donorID;
            var projID = this.plotData[donorID]["proj_id"];
            this.tooltipInfo.projID = projID;
            if(this.plotData[donorID]["kataegis"][this.selectedChromosome.name] == null) {
                this.tooltipInfo.kataegisCount = 0;
            } else {
                this.tooltipInfo.kataegisCount = this.plotData[donorID]["kataegis"][this.selectedChromosome.name].length;
            }
            this.tooltipInfo.left = d3.event.x;
            this.tooltipInfo.top = this.height + this.margin.top;

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
            this.$store.commit('addPlot', {
                type: 'RainfallPlot',
                id: getUUID(),
                title: 'Rainfall (' + proj_id + ', ' + donor_id + ')',
                options: { 'proj_id': proj_id, 'donor_id': donor_id }
            });
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
            });

        },
        drawPlot: function () {
            var vm = this;

            if(vm.plotData == null) {
                return;
            }

            var sampleNames = Object.keys(vm.plotData);
            var numSamples = sampleNames.length;
            let chrLen = vm.$store.getters.chromosomeLength(vm.selectedChromosome.name);

            let minBarHeight = 10;
            var barHeight = Math.max(minBarHeight, vm.height / numSamples);
            // expand plot height to account for minimum bar height adjustments
            let plotHeight = barHeight * numSamples;
            var yMargin = 2;


            var x = d3.scaleLinear().range([0, vm.width]);
            var y = d3.scaleBand()
                .domain(sampleNames)
                .range([0, plotHeight]);

            x.domain([vm.selectedChromosome.start, vm.selectedChromosome.end]);


            var plotElemID = vm.getPlotElem();
            d3.select(plotElemID).select("svg").remove();

            vm.svg = d3.select(plotElemID)
                .append("svg")
                .attr("width", vm.width + vm.margin.left + vm.margin.right)
                .attr("height", plotHeight + vm.margin.top + vm.margin.bottom)
                .append("g")
                .attr("transform",
                    "translate(" + vm.margin.left + "," + vm.margin.top + ")")
                .on('mouseleave', vm.tooltipDestroy);
            
            let YContainer = vm.svg.append("g")
                .attr("transform", "translate(0,0)");
            
            
            //create brush function redraw scatterplot with x selection
            function brushendX() {
                var s = d3.event.selection;
                if(s) {
                    var s2 = s.map((el) => Math.floor(x.invert(el)));
                    var chrOptions = {
                        start: s2[0],
                        end: s2[1],
                        name: vm.selectedChromosome.name
                    }
                    vm.$store.commit('setSelectedChromosome', chrOptions)
                } else {
                    var chrOptions = {
                        start: 0,
                        end: vm.$store.getters.chromosomeLength(vm.selectedChromosome.name),
                        name: vm.selectedChromosome.name
                    }
                    vm.$store.commit('setSelectedChromosome', chrOptions)
                }
                vm.drawPlot();
            }
            

            // dispatch elements
            let genomeHighlight = YContainer.append("g")
                .append("rect")
                .attr("x", 0)
                .attr("y", 0)
                .attr("width", 1)
                .attr("height", plotHeight + vm.margin.top + vm.margin.bottom)
                .attr("transform", "translate(" + (-vm.margin.left - vm.margin.right) + "," + (-vm.margin.top) + ")")
                .attr("fill-opacity", 0)
                .attr("fill", "silver");
            
            // plot elements
            let sampleBars = YContainer.selectAll(".sample-bar-g")
                .data(sampleNames)
                .enter().append("g")
                .attr("class", "sample-bar-g")
                .attr("transform", function (d, i) {
                    return "translate(0," + (i * barHeight) + ")";
                });

            sampleBars.append("rect")
                .attr("class", (d) => d)
                .attr("x", 0)
                .attr("y", 0)
                .attr("width", vm.width)
                .attr("height", barHeight - yMargin)
                .attr("fill", function(d) { return vm.$store.getters.datasetColor(vm.plotData[d]["proj_id"]); })
                .style("cursor", "pointer")
                .on('mousemove', function(d, i) { vm.tooltip(d) })
                .on('click', (d) => {
                    vm.addRainfallPlot(d, vm.plotData[d]["proj_id"]);
                });

            sampleBars.selectAll(".sample-bar-g")
                .data(function (d) {
                    var sampleMutations = vm.plotData[d]["kataegis"][vm.selectedChromosome.name];
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
                .attr("fill-opacity", 0.5)
                .attr("fill", "black");

            // y Axis
            let yAxis = YContainer.append("g")
                .attr("class", "y_axis");
            
            yAxis.call(d3.axisLeft(y).tickSizeOuter(0));

            // y Axis drag target
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
            
            // text label for the y axis
            vm.svg.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 0 - vm.margin.left + 5)
                .attr("x", 0 - (vm.height / 2))
                .attr("dy", "1em")
                .style("text-anchor", "middle")
                .text("Donors");  
             
            
            // white background rects to hide overflow-y
            vm.svg.append("g")
                .append("rect")
                .attr("x", -vm.margin.left)
                .attr("y", vm.height)
                .attr("width", vm.width + vm.margin.left + vm.margin.right)
                .attr("height", plotHeight)
                .attr("fill", "#FFF");

            // x Axis
            let xAxis = vm.svg.append("g")
                .attr("transform", "translate(0," + vm.height + ")")
                .call(d3.axisBottom(x));
            
            // zoom with brush x
            xAxis.append("g")
                .attr("class", "brush")
                .call(
                    d3.brushX()
                        .on("end." + vm.plotElemID, brushendX)
                );
            
            // text label for the x axis
            vm.svg.append("text")             
                .attr("transform",
                        "translate(" + (vm.width/2) + " ," + (vm.height + vm.margin.top + 20) + ")")
                .style("text-anchor", "middle")
                .text("Chromosome Location");
            
            // dispatch callbacks
            dispatch.on("link-donor." + this.plotElemID, function(donorID) {
                if(donorID != null) {
                    vm.svg.selectAll(".sample-bar-g > rect")
                        .attr("fill-opacity", 0.4);
                    vm.svg.select("." + donorID)
                        .attr("fill-opacity", 1);
                } else {
                    vm.svg.selectAll(".sample-bar-g > rect")
                        .attr("fill-opacity", 1);
                }
            });

            dispatch.on("link-donor-destroy." + this.plotElemID, function() {
                vm.svg.selectAll(".sample-bar-g > rect")
                        .attr("fill-opacity", 1);
            });

            dispatch.on("link-genome." + this.plotElemID, function(location) {
                genomeHighlight
                    .attr("x", location)
                    .attr("fill-opacity", 1);
            });

            dispatch.on("link-genome-destroy." + this.plotElemID, function() {
                genomeHighlight.attr("fill-opacity", 0);
            });

            vm.$store.dispatch('emitDatasetsLegend');
        }
    }
}
</script>

<style scoped lang="scss">

@import './../../variables.scss';
@import './plot-style.scss';

.plot-component {
    overflow-y: hidden;
    overflow-x: hidden;
}

</style>
