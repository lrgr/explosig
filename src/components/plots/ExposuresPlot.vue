<template>
    <div>
        <div :id="this.plotElemID" class="plot-component"></div>

        <div :id="this.plotElemID + '_tooltip'" class="tooltip" :style="this.tooltipPosition">
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
            &nbsp; &nbsp;
            Sort by
            &nbsp;
            <select v-model="sortByCategory">
                <option value="exposures">Signature Exposure</option>
                <option value="clinical">Clinical Variable</option>
            </select>
            &nbsp;
            <select v-model="options.sortBy" v-if="sortByCategory !== null">
                <option v-for="sortByOption in sortByList" :key="sortByOption" :value="sortByOption">{{ sortByOption }}</option>
            </select>
        </div>

        <div class="plot-info" v-if="showInfo">
            <h3>Info</h3>
            <p>This plot displays exposures to selected signatures for each donor in the selected dataset, along with clinical data such as alcohol and tobacco usage.</p>
            <p>Drag along the x axis to pan across additional donors.</p>
            <h3>Settings</h3>
            <label>Use local file: &nbsp;</label>
            <input type="file" accept=".csv" v-on:input="fileInput($event.target.files)">
        </div>
    </div>
</template>

<script>
import * as d3 from 'd3';
import { mapGetters } from 'vuex';
import API from './../../api.js';
import { LegendListBus } from './../../buses.js';
import { getTranslation } from './../../helpers.js';
import { dispatch } from './plot-link.js';

// child components
import Spinner from './../Spinner.vue';

export default {
    name: 'ExposuresPlot',
    props: ['plotID', 'showInfo', 'plotOptions'],
    components: {
        Spinner
    },
    data: function () {
        return {
            title: 'Signature Exposures with Clinical Data',
            loading: false,
            plotData: null,
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
            options: {
                normalizeExposures: false,
                sortBy: null
            },
            sortByCategory: null,
            sortByList: []
        };
    },
    mounted: function() {
        this.$emit('titleInit', this.title);
        this.updatePlot();
    },
    computed: {
        height: function () {
            return 450 - this.margin.top - this.margin.bottom;
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
            'windowWidth',
            'selectedDatasets',
            'selectedSignatures',
            'selectedClinicalVariables'
        ])
    },
    watch: {
        windowWidth: function (val) {
            this.drawPlot();
        },
        options: {
            handler: function () {
                this.drawPlot();
            },
            deep: true
        },
        sortByCategory: function(val) {
            if(val == "exposures") {
                this.sortByList = this.selectedSignatures;
            } else if(val == "clinical") {
                this.sortByList = this.selectedClinicalVariables;
            }
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
            let params = {
                "sources": vm.selectedDatasets,
                "signatures": vm.selectedSignatures
            };
            API.fetchExposures(params, vm.rowOp).then((data) => {
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

            if(vm.plotData === null) {
                return;
            }


            let minBarWidth = 20;
            let barWidth = Math.max(minBarWidth, this.width / this.plotData.length);
            // expand plot width to account for minimum bar width adjustments
            let plotWidth = barWidth * this.plotData.length;
            
            // normalize data if necessary
            var normalizedData = vm.plotData;
            if(vm.options.normalizeExposures) {
                normalizedData = normalizedData.map((d) => {
                    // deep copy of exposures objects
                    d = Object.assign({}, d);
                    d["exposures"] = Object.assign({}, d["exposures"]);

                    let dMax = d3.sum(Object.values(d["exposures"]));
                    Object.keys(d["exposures"]).map((sigName) => {
                        d["exposures"][sigName] = d["exposures"][sigName] / parseFloat(dMax);
                    });
                    return d;
                });
            }
            // sort data if necessary
            if(vm.sortByCategory != null && vm.options.sortBy != null && vm.sortByList.indexOf(vm.options.sortBy) >= 0) {
                
                normalizedData.sort(function(x, y) {
                    //console.log(x[vm.sortByCategory][vm.options.sortBy]);
                    return d3.descending(+x[vm.sortByCategory][vm.options.sortBy], +y[vm.sortByCategory][vm.options.sortBy]);
                });
            }
            // compute max for y axis
            var maxCountSum = d3.max(normalizedData.map((d) => {
                return d3.sum(Object.values(d["exposures"]));
            }));

            // height and margins for clinical variable rects
            let cHeight = 15;
            let cMargin = 3;

            var sampleNames = normalizedData.map((d) => { return d["donor_id"]; });
   

            // axis scales
            var x = d3.scaleBand()
                .domain(sampleNames)
                .range([0, plotWidth]);
            var y = d3.scaleLinear()
                .domain([0, maxCountSum])
                .range([this.height - 2*(cHeight + cMargin), 0]);
            // stacked bar values
            var stack = d3.stack()
                .keys(vm.selectedSignatures.slice().reverse())
                .value((d, key) => { return d["exposures"][key]; })
                .order(d3.stackOrderNone)
                .offset(d3.stackOffsetNone);

            var series = stack(normalizedData);

            var xMargin = 2;

            var yClinicalAlcohol = d3.scaleBand()
                .domain(["Alcohol"])
                .range([cHeight, 0]);
            
            var yClinicalTobacco = d3.scaleBand()
                .domain(["Tobacco"])
                .range([cHeight, 0]);

             
            // create svg elements
            d3.select("#" + this.plotElemID).select("svg").remove();

            vm.svg = d3.select("#" + this.plotElemID)
                .append("svg")
                .attr("width", plotWidth + this.margin.left + this.margin.right)
                .attr("height", this.height + this.margin.top + this.margin.bottom)
                .append("g")
                .attr("transform",
                    "translate(" + vm.margin.left + "," + vm.margin.top + ")")
                .on('mouseleave', vm.tooltipDestroy);
            
            let XContainer = vm.svg.append("g")
                .attr("transform", "translate(0,0)");

            
            let layer = XContainer.selectAll(".layer")
                .data(series)
            .enter().append("g")
                .attr("class", "layer")
                .style("fill", (d, i) => { 
                    return vm.$store.getters.signatureColor(d["key"]); 
                })
                .on('mousemove', (d) => {
                    vm.tooltip(null, null, d["key"], null); 
                });
            
            layer.selectAll("rect")
                .data((d) => { return d; })
            .enter().append("rect")
                .attr("class", "exposure-bar")
                .attr("x", (d, i) => { return x(normalizedData[i]["donor_id"]); })
                .attr("y", (d) => { return y(d[1]); })
                .attr("height", (d) => { return y(d[0]) - y(d[1]); })
                .attr("width", barWidth - xMargin)
                .style("cursor", "pointer")
                .on('mouseover', (d, i) => { 
                    vm.tooltip(normalizedData[i]["donor_id"], normalizedData[i]["proj_id"], null, (d[1] - d[0])); 
                });
        
            // clinical variables
            XContainer.selectAll(".clinical-alcohol")
                .data(sampleNames)
            .enter().append("rect")
                .attr("class", "clinical-alcohol")
                .attr("x", (d, i) => { return x(d) + 1; })
                .attr("y", vm.height - 2*(cHeight) - cMargin)
                .attr("height", cHeight)
                .attr("width", barWidth - xMargin - 2)
                .style("cursor", "pointer")
                .attr("stroke", "black")
                .attr("stroke-width", (d, i) => {
                    return ((normalizedData[i]["clinical"]["alcohol_binary"] == "") ? 0 : 2)
                })
                .attr("fill", (d, i) => {
                    if(normalizedData[i]["clinical"]["alcohol_binary"] == "") {
                        return "transparent";
                    } else {
                        return d3.interpolateGreys(normalizedData[i]["clinical"]["alcohol_binary"]);
                    }
                });
            
            XContainer.selectAll(".clinical-tobacco")
                .data(sampleNames)
            .enter().append("rect")
                .attr("class", "clinical-tobacco")
                .attr("x", (d, i) => { return x(d) + 1; })
                .attr("y", vm.height - cHeight + 1)
                .attr("height", cHeight)
                .attr("width", barWidth - xMargin - 2)
                .style("cursor", "pointer")
                .attr("stroke", "black")
                .attr("stroke-width", (d, i) => {
                    return ((normalizedData[i]["clinical"]["tobacco_binary"] == "") ? 0 : 2)
                })
                .attr("fill", (d, i) => {
                    if(normalizedData[i]["clinical"]["tobacco_binary"] == "") {
                        return "transparent";
                    } else {
                        return d3.interpolateGreys(normalizedData[i]["clinical"]["tobacco_binary"]);
                        //return d3.interpolateGreys(normalizedData[i]["clinical"]["tobacco_intensity"] / 100.0);
                    }
                });

            // x Axis container
            let xAxis = XContainer.append("g")
                .attr("transform", "translate(0," + (vm.height + 2*cMargin) + ")")
                .attr("class", "x_axis");

            // x Axis ticks
            xAxis.call(d3.axisBottom(x).tickSizeOuter(0).tickPadding(0))
                .selectAll("text")	
                    .style("text-anchor", "end")
                    .attr("x", "-.8em")
                    .attr("y", ".15em")
                    .attr("transform", "rotate(-65)");
            
            // x Axis drag target
            xAxis.append("rect")
                .attr("class", "x-drag-target")
                .attr("width", plotWidth)
                .attr("height", 60)
                .attr("fill", "transparent")
                .attr("fill-opacity", "0")
                .style("cursor", "pointer")
                .call(d3.drag().container(document.querySelector("#" + vm.plotElemID)).on("drag", () => {
                    var newX = getTranslation(XContainer.attr("transform"))[0] + d3.event.dx;
                    newX = Math.max(-plotWidth + vm.width, newX);
                    newX = Math.min(barWidth, newX);
                    XContainer.attr("transform", "translate(" + newX + ",0)");
                }));
            
            // text label for the x axis
            vm.svg.append("text")
                .attr("transform",
                        "translate(" + (vm.width/2) + " ," + (vm.height + vm.margin.top + 70) + ")")
                .style("text-anchor", "middle")
                .text("Donors");

            // y Axis container
            let yAxis = vm.svg.append("g");
            
            // y axis white background
            yAxis.append("rect")
                    .attr("width", vm.margin.left)
                    .attr("height", vm.height + 2*(cMargin) + vm.margin.bottom)
                    .attr("transform", "translate(" + (-vm.margin.left) + ",0)")
                    .attr("fill", "#FFF");
            
            // y Axis exposures ticks
            yAxis.call(d3.axisLeft(y));
            
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
            dispatch.on("link-donor." + this.plotElemID, (donorID) => {
                if(donorID != null) {
                    // clinical opacities
                    XContainer.selectAll(".clinical-alcohol")
                        .attr("fill-opacity", (d) => (d == donorID ? 1 : 0.4))
                        .attr("stroke-opacity", (d) => (d == donorID ? 1 : 0.4));
                    XContainer.selectAll(".clinical-tobacco")
                        .attr("fill-opacity", (d) => (d == donorID ? 1 : 0.4))
                        .attr("stroke-opacity", (d) => (d == donorID ? 1 : 0.4));
                    // signature opacities
                    vm.svg.selectAll(".layer").selectAll(".exposure-bar")
                        .attr("fill-opacity", (d, i) => ((normalizedData[i] && normalizedData[i]["donor_id"] == donorID) ? 1 : 0.4));
                } else {
                    vm.svg.selectAll(".exposure-bar")
                        .attr("fill-opacity", 1);
                    XContainer.selectAll(".clinical-alcohol")
                        .attr("fill-opacity", 1)
                        .attr("stroke-opacity", 1);
                    XContainer.selectAll(".clinical-tobacco")
                        .attr("fill-opacity", 1)
                        .attr("stroke-opacity", 1);
                }
            });

            dispatch.on("link-donor-destroy." + this.plotElemID, () => {
                vm.svg.selectAll(".exposure-bar")
                    .attr("fill-opacity", 1);
                XContainer.selectAll(".clinical-alcohol")
                    .attr("fill-opacity", 1)
                    .attr("stroke-opacity", 1);
                XContainer.selectAll(".clinical-tobacco")
                    .attr("fill-opacity", 1)
                    .attr("stroke-opacity", 1);
            });

            vm.$store.dispatch('emitSignaturesLegend');
            vm.$store.dispatch('emitClinicalVariablesLegend');
        }
    }
}
</script>

<style scoped lang="scss">

@import './../../variables.scss';
@import './plot-style.scss';

.plot-component {
    overflow-x: hidden;
    overflow-y: hidden;
}

</style>
