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
                    <th>Signature</th><td>{{ this.tooltipInfo.signature }}</td>
                </tr>
                <tr>
                    <th>Exposure</th><td>{{ this.tooltipInfo.exposure }}</td>
                </tr>
            </table>
        </div>

        <div class="spinner-wrapper">
            <Spinner v-if="loading" class="spinner"></Spinner>
        </div>
        <div class="bottom-options">
            <input type="checkbox" id="normalizeExposures" v-model="options.normalizeExposures">
            <label for="normalizeExposures">Normalize</label>
            &nbsp;
            <select v-model="options.sortBy">
                <option>Exposure to Signature 1</option>
                <option>Clinical Variable - Tobacco</option>
                <option>Clinical Variable - Alcohol</option>
            </select>
        </div>
    </div>
</template>

<script>
import { dataOptions } from './../../buses/data-options-bus.js';
import { dispatch } from './plot-link.js';
import API from './../../api.js'
import Spinner from './../Spinner.vue'
import * as d3 from 'd3';

export default {
    name: 'ExposuresPlot',
    props: ['plotIndex'],
    components: {
        Spinner
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
                left: 40
            },
            tooltipInfo: {
                donorID: "",
                projID: "",
                signature: "",
                exposure: "",
                left: null,
                top: null
            },
            globalDataOptions: dataOptions,
            options: {
                normalizeExposures: false,
                sortBy: null
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
        updatePlot: function () {
            var vm = this;
            vm.loading = true;
            API.fetchExposures(vm.globalDataOptions).then(function (data) {
                vm.plotData = data;
                //console.log(data);
                vm.drawPlot();
                vm.loading = false;
            });
        },
        tooltip: function(donorID, projID, signature, exposure) {
            this.tooltipInfo.donorID = donorID || this.tooltipInfo.donorID;
            this.tooltipInfo.projID = projID || this.tooltipInfo.projID;
            this.tooltipInfo.signature = signature || this.tooltipInfo.signature;
            this.tooltipInfo.exposure = exposure || this.tooltipInfo.exposure;

            this.tooltipInfo.left = d3.event.x;
            this.tooltipInfo.top = d3.event.y - 50;

            dispatch.call("link-donor", null, this.tooltipInfo.donorID);
            dispatch.call("link-project", null, this.tooltipInfo.projID);
            dispatch.call("link-signature", null, this.tooltipInfo.signature);
        },
        hideTooltip: function() {
            this.tooltip.left = null;
            this.tooltip.top = null;
        },
        drawPlot: function () {
            var vm = this;

            if(vm.plotData == null) {
                return;
            }

            var barWidth = this.width / this.plotData.length;
            var sampleNames = vm.plotData.map(function(d) { return d["donor_id"]; });

            var x = d3.scaleBand()
                .domain(sampleNames)
                .range([0, this.width]);
            var y = d3.scaleLinear()
            .domain([0, 1])
            .range([this.height, 0]);
            var stack = d3.stack()
                .keys(function(d) { return Object.keys(d[Object.keys(d)[0]]["exposures"]); })
                .value(function(d, key) { return d["exposures"][key]; })
                .order(d3.stackOrderNone)
                .offset(d3.stackOffsetNone);

            var series = stack(vm.plotData);

            var c20 = d3.scaleOrdinal(d3.schemeDark2);
            var xMargin = 2;

            d3.select("#" + this.plotID).select("svg").remove();

            vm.svg = d3.select("#" + this.plotID)
                .append("svg")
                .attr("width", this.width + this.margin.left + this.margin.right)
                .attr("height", this.height + this.margin.top + this.margin.bottom)
                .append("g")
                .attr("transform",
                    "translate(" + vm.margin.left + "," + vm.margin.top + ")");
            
             // dispatch elements
            let donorHighlight = vm.svg.append("g")
                .append("rect")
                .attr("x", 0)
                .attr("y", 0)
                .attr("width", barWidth + 2 * xMargin)
                .attr("height", vm.height)
                .attr("transform", "translate(" + (-xMargin) + ",0)")
                .attr("opacity", 0)
                .attr("fill", "silver");
            
            
            let layer = vm.svg.selectAll(".layer")
                .data(series)
            .enter().append("g")
                .attr("class", "layer")
                .style("fill", function(d) { return c20(d["key"]); })
                .on('mouseover', function(d) {
                    vm.tooltip(null, null, d["key"], null); 
                });
            
                
            layer.selectAll("rect")
                .data(function(d) { return d; })
            .enter().append("rect")
                .attr("x", function(d, i) { return i*barWidth; })
                .attr("y", function(d) { return y(d[1]); })
                .attr("height", function(d) { return y(d[0]) - y(d[1]); })
                .attr("width", barWidth - xMargin)
                .on('mouseover', function(d, i) { 
                    vm.tooltip(vm.plotData[i]["donor_id"], vm.plotData[i]["proj_id"], null, (d[1] - d[0])); 
                });

            // x Axis
            vm.svg.append("g")
                .attr("transform", "translate(0," + vm.height + ")")
                .call(d3.axisBottom(x));

            // y Axis
            vm.svg.append("g")
                .call(d3.axisLeft(y));

            // dispatch callbacks
            dispatch.on("link-donor.exposures", function(donorID) {
                donorHighlight
                    .attr("x", barWidth * sampleNames.indexOf(donorID))
                    .attr("opacity", 1);
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
