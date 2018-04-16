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

        <div class="spinner-wrapper" v-if="loading">
            <Spinner class="spinner"></Spinner>
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

        <div class="plot-info" v-if="showInfo">
            <h3>Info</h3>
            <p>This plot displays exposures to selected signatures for each donor in the selected dataset, along with clinical data such as alcohol and tobacco usage.</p>
            <h3>Settings</h3>
            <label>Use local file: &nbsp;</label>
            <input type="file" accept=".csv" v-on:input="fileInput($event.target.files)">
        </div>
    </div>
</template>

<script>
import { globalDataOptions } from './../../buses/data-options-bus.js';
import { dispatch } from './plot-link.js';
import API from './../../api.js'
import Spinner from './../Spinner.vue'
import * as d3 from 'd3';

export default {
    name: 'ExposuresPlot',
    props: ['plotIndex', 'showInfo', 'windowWidth'],
    components: {
        Spinner
    },
    data: function () {
        return {
            title: 'Signature Exposures with Clinical Data',
            loading: false,
            plotData: null,
            width: 0,
            svg: null,
            margin: {
                top: 20,
                right: 30,
                bottom: 100,
                left: 90
            },
            tooltipInfo: {
                donorID: "",
                projID: "",
                signature: "",
                exposure: "",
                left: null,
                top: null
            },
            dataOptions: globalDataOptions,
            options: {
                normalizeExposures: true,
                sortBy: null
            }
        };
    },
    mounted: function() {
        this.$emit('titleInit', this.title);
    },
    computed: {
        height: function () {
            return 450 - this.margin.top - this.margin.bottom;
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
    methods: {
        fileInput: function(files) {
            let vm = this;
            vm.loading = true;

            let file = files[0];
            if(file) {
                var reader = new FileReader();
                reader.onloadend = function(evt) {
                    var dataUrl = evt.target.result;
                    d3.csv(dataUrl, vm.rowOp).then((data) => {
                        vm.plotData = data;
                        vm.drawPlot();
                        vm.loading = false;
                        vm.showInfo = false;
                    });
                };
                reader.readAsDataURL(file);
            }
        },
        rowOp: function(d) {
            var row = {
                'donor_id': d["donor_id"],
                'clinical': {
                    'alcohol_binary': d["Alcohol Binary"],
                    'tobacco_binary': d["Tobacco Binary"],
                    'tobacco_intensity': d["Tobacco Intensity"]
                },
                'proj_id': d["proj_id"]
            }
            delete d["donor_id"];
            delete d["Alcohol Binary"];
            delete d["Tobacco Binary"];
            delete d["Tobacco Intensity"];
            delete d["proj_id"];
            row["exposures"] = d;
            return row;
        },
        updatePlot: function () {
            let vm = this;
            vm.loading = true;
            API.fetchExposures(vm.dataOptions, vm.rowOp).then((data) => {
                vm.plotData = data;
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
            this.tooltipInfo.top = this.height + 30;

            dispatch.call("link-donor", null, this.tooltipInfo.donorID);
            dispatch.call("link-project", null, this.tooltipInfo.projID);
            dispatch.call("link-signature", null, this.tooltipInfo.signature);
        },
        tooltipDestroy: function() {
            this.tooltipInfo.left = null;
            this.tooltipInfo.top = null;

            dispatch.call("link-donor-destroy");
        },
        drawPlot: function () {
            var vm = this;

            if(vm.plotData == null) {
                return;
            }

            var barWidth = this.width / this.plotData.length;
            var sampleNames = vm.plotData.map((d) => { return d["donor_id"]; });
            var sigNames = Object.keys(vm.plotData[0]["exposures"]);

            var maxCountSum = d3.max(vm.plotData.map((d) => {
                return d3.sum(Object.values(d["exposures"]));
            }));

            // height and margins for clinical variable rects
            let cHeight = 15;
            let cMargin = 3;

            var x = d3.scaleBand()
                .domain(sampleNames)
                .range([0, this.width]);
            var y = d3.scaleLinear()
            .domain([0, maxCountSum])
            .range([this.height - 2*(cHeight + cMargin), 0]);
            var stack = d3.stack()
                .keys((d) => { return Object.keys(d[Object.keys(d)[0]]["exposures"]); })
                .value((d, key) => { return d["exposures"][key]; })
                .order(d3.stackOrderNone)
                .offset(d3.stackOffsetNone);

            var series = stack(vm.plotData);

            var colorScale = d3.interpolateRainbow;
            var xMargin = 2;

            var yClinicalAlcohol = d3.scaleBand()
                .domain(["Alcohol"])
                .range([cHeight, 0]);
            
            var yClinicalTobacco = d3.scaleBand()
                .domain(["Tobacco"])
                .range([cHeight, 0]);

             

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
            let donorHighlight = vm.svg.append("g")
                .append("rect")
                .attr("x", 0)
                .attr("y", 0)
                .attr("width", barWidth + xMargin)
                .attr("height", (vm.height + vm.margin.top + 60))
                .attr("transform", "translate(" + (-xMargin) + "," + (-vm.margin.top) + ")")
                .attr("opacity", 0)
                .attr("fill", "silver");
            
            
            let layer = vm.svg.selectAll(".layer")
                .data(series)
            .enter().append("g")
                .attr("class", "layer")
                .style("fill", (d, i) => { return colorScale(i / parseFloat(sigNames.length)); })
                .on('mousemove', (d) => {
                    vm.tooltip(null, null, d["key"], null); 
                });
            
                
            layer.selectAll("rect")
                .data((d) => { return d; })
            .enter().append("rect")
                .attr("x", (d, i) => { return x(vm.plotData[i]["donor_id"]); })
                .attr("y", (d) => { return y(d[1]); })
                .attr("height", (d) => { return y(d[0]) - y(d[1]); })
                .attr("width", barWidth - xMargin)
                .on('mouseover', (d, i) => { 
                    vm.tooltip(vm.plotData[i]["donor_id"], vm.plotData[i]["proj_id"], null, (d[1] - d[0])); 
                });
            
        
            // clinical variables
            vm.svg.selectAll(".clinical-alcohol")
                .data(sampleNames)
            .enter().append("rect")
                .attr("x", (d, i) => { return x(d) + 1; })
                .attr("y", vm.height - 2*(cHeight) - cMargin)
                .attr("height", cHeight)
                .attr("width", barWidth - xMargin - 2)
                .attr("stroke", "black")
                .attr("stroke-width", (d, i) => {
                    return ((vm.plotData[i]["clinical"]["alcohol_binary"] == "") ? 0 : 2)
                })
                .attr("fill", (d, i) => {
                    if(vm.plotData[i]["clinical"]["alcohol_binary"] == "") {
                        return "transparent";
                    } else {
                        return d3.interpolateGreys(vm.plotData[i]["clinical"]["alcohol_binary"]);
                    }
                });
            
            vm.svg.selectAll(".clinical-tobacco")
                .data(sampleNames)
            .enter().append("rect")
                .attr("x", (d, i) => { return x(d) + 1; })
                .attr("y", vm.height - cHeight + 1)
                .attr("height", cHeight)
                .attr("width", barWidth - xMargin - 2)
                .attr("stroke", "black")
                .attr("stroke-width", (d, i) => {
                    return ((vm.plotData[i]["clinical"]["tobacco_binary"] == "") ? 0 : 2)
                })
                .attr("fill", (d, i) => {
                    if(vm.plotData[i]["clinical"]["tobacco_binary"] == "") {
                        return "transparent";
                    } else {
                        return d3.interpolateGreys(vm.plotData[i]["clinical"]["tobacco_binary"]);
                        //return d3.interpolateGreys(vm.plotData[i]["clinical"]["tobacco_intensity"] / 100.0);
                    }
                });

            // x Axis
            vm.svg.append("g")
                .attr("transform", "translate(0," + (vm.height + 2*cMargin) + ")")
                .attr("class", "x_axis")
                .call(d3.axisBottom(x).tickSizeOuter(0).tickPadding(0))
                .selectAll("text")	
                    .style("text-anchor", "end")
                    .attr("dx", "-.8em")
                    .attr("dy", ".15em")
                    .attr("transform", "rotate(-65)");
            
            // text label for the x axis
            vm.svg.append("text")             
                .attr("transform",
                        "translate(" + (vm.width/2) + " ," + (vm.height + vm.margin.top + 60) + ")")
                .style("text-anchor", "middle")
                .text("Donors");

            // y Axis
            vm.svg.append("g")
                .call(d3.axisLeft(y));
            
            // text label for the y axis
            vm.svg.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 0 - vm.margin.left + 10)
                .attr("x", 0 - (vm.height / 2))
                .attr("dy", "1em")
                .style("text-anchor", "middle")
                .text("Signature Exposures");  
            
            // y Axis for clinical vars
            vm.svg.append("g")
                .call(d3.axisLeft(yClinicalAlcohol).tickSizeOuter(0))
                .attr("transform", "translate(0," + (vm.height - 2*cHeight - cMargin) + ")")
                .selectAll("text")	
                    .style("text-anchor", "end")
                    .attr("dx", "-.4em")
                    .attr("dy", ".1em")
                    .attr("transform", "rotate(-25)");

            vm.svg.append("g")
                .call(d3.axisLeft(yClinicalTobacco).tickSizeOuter(0))
                .attr("transform", "translate(0," + (vm.height - cHeight) + ")")
                .selectAll("text")	
                    .style("text-anchor", "end")
                    .attr("dx", "-.4em")
                    .attr("dy", ".1em")
                    .attr("transform", "rotate(-25)");

            // dispatch callbacks
            dispatch.on("link-donor." + this.plotID, (donorID) => {
                let i = sampleNames.indexOf(donorID);
                if(i != null && i != -1) {
                    donorHighlight
                        .attr("x", x(donorID))
                        .attr("opacity", 1);
                } else {
                    donorHighlight.attr("opacity", 0);
                }
            });

            dispatch.on("link-donor-destroy." + this.plotID, () => {
                donorHighlight.attr("opacity", 0);
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
