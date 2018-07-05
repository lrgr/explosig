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
                <tr v-if="tooltipInfo.type == 'signature'">
                    <th>Signature</th><td>{{ this.tooltipInfo.signature }}</td>
                </tr>
                <tr v-if="tooltipInfo.type == 'signature'">
                    <th>Exposure</th><td>{{ this.tooltipInfo.exposure }}</td>
                </tr>
                <tr v-if="tooltipInfo.type == 'clinical'">
                    <th>{{ tooltipInfo.clinicalKey }}</th><td>{{ tooltipInfo.clinicalValue }}</td>
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

            <input type="checkbox" id="enableXScroll" v-model="options.xScroll">
            <label for="enableXScroll">Enable Horizontal Scroll</label>
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
import plotMixin from './../../mixins/plot-mixin.js';
import API from './../../api.js';
import { getTranslation } from './../../helpers.js';
import { dispatch } from './../../plot-link.js';

// child components
import Spinner from './../Spinner.vue';

export default {
    name: 'ExposuresPlot',
    mixins: [plotMixin],
    props: [],
    components: {
        Spinner
    },
    data: function () {
        return {
            margin: {
                top: 20,
                right: 30,
                bottom: 100,
                left: 90
            },
            tooltipInfo: {
                donorID: "",
                projID: "",
                type: "",
                signature: "",
                exposure: "",
                clinicalKey: "",
                clinicalValue: ""
            },
            options: {
                normalizeExposures: false,
                sortBy: null,
                xScroll: true
            },
            sortByCategory: null,
            sortByList: []
        };
    },
    computed: {
        height: function () {
            return 450 - this.margin.top - this.margin.bottom;
        },
        width: function() {
            return (this.windowWidth*0.8) - 40 - this.margin.left - this.margin.right;
        }
    },
    watch: {
        sortByCategory: function(val) {
            if(val == "exposures") {
                this.sortByList = this.selectedSignatures;
            } else if(val == "clinical") {
                this.sortByList = this.selectedClinicalVariables.map((el) => el.name);
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
                    d3.json(dataUrl).then((data) => {
                        vm.plotData = data;

                        vm.drawPlot();
                        vm.loading = false;
                        vm.showInfo = false;
                    });
                };
                reader.readAsDataURL(file);
            }
        },
        updatePlot: function () {
            let vm = this;
            vm.loading = true;
            let params = {
                "sources": vm.selectedDatasets,
                "signatures": vm.selectedSignatures
            };
            API.fetchExposures(params).then((data) => {
                vm.plotData = data;

                vm.drawPlot();
                vm.loading = false;

                vm.$store.dispatch('emitSignaturesLegend');
                vm.$store.dispatch('emitClinicalVariablesLegend');
            });
        },
        tooltip: function(donorID, projID, signature, exposure, clinicalKey, clinicalValue) {
            this.tooltipInfo.donorID = donorID || this.tooltipInfo.donorID;
            this.tooltipInfo.projID = projID || this.tooltipInfo.projID;

            if(signature != null || exposure != null) {
                this.tooltipInfo.type = 'signature';
                this.tooltipInfo.signature = signature || this.tooltipInfo.signature;
                this.tooltipInfo.exposure = exposure || this.tooltipInfo.exposure;
            } else if(clinicalKey != null || clinicalValue != null) {
                this.tooltipInfo.type = 'clinical';
                this.tooltipInfo.clinicalKey = clinicalKey;
                this.tooltipInfo.clinicalValue = clinicalValue;
            }

            this.tooltipPosition.left = d3.event.x;
            this.tooltipPosition.top = this.height + 30;
            
            dispatch.call("link-donor", null, this.tooltipInfo.donorID);
            dispatch.call("link-project", null, this.tooltipInfo.projID);
            dispatch.call("link-signature", null, this.tooltipInfo.signature);
        },
        tooltipDestroy: function() {
            this.tooltipHide();

            dispatch.call("link-donor-destroy");
        },
        drawPlot: function () {
            var vm = this;

            if(vm.plotData === null) {
                return;
            }
            let marginX = 2;
            let clinicalHeight = 10;
            let clinicalMarginY = 2;
            let totalClinicalHeight = vm.selectedClinicalVariables.length * (clinicalHeight + clinicalMarginY);
            let minBarWidth = (this.options.xScroll ? 20 : 0);
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
                if(vm.sortByCategory == "exposures") {
                    normalizedData.sort(function(a, b) {
                        return d3.descending(
                            (a[vm.sortByCategory][vm.options.sortBy] == "nan" ? -1 : +a[vm.sortByCategory][vm.options.sortBy]), 
                            (b[vm.sortByCategory][vm.options.sortBy] == "nan" ? -1 : +b[vm.sortByCategory][vm.options.sortBy])
                        );
                    });
                } else if(vm.sortByCategory == "clinical") {
                    normalizedData.sort( (a, b) => 
                        vm.getClinicalVariable(vm.options.sortBy).comparator(
                            a[vm.sortByCategory][vm.options.sortBy], 
                            b[vm.sortByCategory][vm.options.sortBy]
                        )
                    );
                }
                
            }

            // compute max for y axis
            let maxCountSum = d3.max(normalizedData.map((d) => {
                return d3.sum(Object.values(d["exposures"]));
            }));

            let sampleNames = normalizedData.map((d) => { return d["donor_id"]; });

            // axis scales
            let x = d3.scaleBand()
                .domain(sampleNames)
                .range([0, plotWidth]);
            let y = d3.scaleLinear()
                .domain([0, maxCountSum])
                .range([this.height - totalClinicalHeight, 0]);
            
            // stacked bar values
            let stack = d3.stack()
                .keys(vm.selectedSignatures.slice().reverse())
                .value((d, key) => { return d["exposures"][key]; })
                .order(d3.stackOrderNone)
                .offset(d3.stackOffsetNone);

            let series = stack(normalizedData);

            // create svg elements
            d3.select(this.plotSelector).select("svg").remove();

            vm.svg = d3.select(this.plotSelector)
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
                .style("fill", (d) => { 
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
                .attr("width", barWidth - marginX)
                .style("cursor", "pointer")
                .on('mouseover', (d, i) => { 
                    vm.tooltip(normalizedData[i]["donor_id"], normalizedData[i]["proj_id"], null, (d[1] - d[0]), null, null); 
                })
                .on('click', (d, i) => {
                    vm.enterSingleDonorMode(normalizedData[i]["donor_id"], normalizedData[i]["proj_id"]);
                });
        
            // clinical variables
            let clinicalY = {};
            var var_i;
            for(var_i = 0; var_i < vm.selectedClinicalVariables.length; var_i++) {
                let selectedCV = vm.selectedClinicalVariables[var_i];

                clinicalY[selectedCV.id] = d3.scaleBand()
                    .domain([selectedCV.name])
                    .range([this.height - totalClinicalHeight + clinicalMarginY + (var_i+1)*(clinicalHeight + clinicalMarginY), this.height - totalClinicalHeight + clinicalMarginY + (var_i)*(clinicalHeight + clinicalMarginY)]);

                XContainer.append("g")
                    .attr("class", "clinical-group")
                .selectAll(".clinical-rect")
                    .data(sampleNames)
                .enter().append("rect")
                    .attr("class", "clinical-rect")
                    .attr("x", (d) => { return x(d); })
                    .attr("y", clinicalY[selectedCV.id](selectedCV.name))
                    .attr("height", clinicalHeight)
                    .attr("width", barWidth - marginX)
                    .style("cursor", "pointer")
                    .attr("fill", (d, i) => {
                        return selectedCV.color(normalizedData[i]["clinical"][selectedCV.id]);
                    })
                    .on('mouseover', (d, i) => {
                        vm.tooltip(normalizedData[i]["donor_id"], normalizedData[i]["proj_id"], null, null, selectedCV.name, selectedCV.transform(normalizedData[i]["clinical"][selectedCV.id]));
                    })
                    .on('click', (d, i) => {
                        vm.enterSingleDonorMode(normalizedData[i]["donor_id"], normalizedData[i]["proj_id"]);
                    });
            }

            // x Axis container
            let xAxis = XContainer.append("g")
                .attr("transform", "translate(0," + (vm.height + clinicalMarginY) + ")")
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
                .text("Donor");

            // y Axis container
            let yAxis = vm.svg.append("g");
            
            // y axis white background
            yAxis.append("rect")
                    .attr("width", vm.margin.left)
                    .attr("height", vm.height + vm.margin.bottom)
                    .attr("transform", "translate(" + (-vm.margin.left) + ",0)")
                    .attr("fill", (vm.options.xScroll ? "#FFF" : "transparent"));
            
            // y Axis exposures ticks
            yAxis.call(d3.axisLeft(y));
            
            // text label for the y axis
            vm.svg.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 0 - vm.margin.left + 10)
                .attr("x", 0 - ((vm.height - totalClinicalHeight) / 2))
                .attr("dy", "1em")
                .style("text-anchor", "middle")
                .text("Signature Exposure");  
            
            // y Axis for clinical vars
            for(var_i = 0; var_i < vm.selectedClinicalVariables.length; var_i++) {
                var axisCV = vm.selectedClinicalVariables[var_i];
                vm.svg.append("g")
                    .call(d3.axisLeft(clinicalY[axisCV.id]).tickSizeOuter(0))
                    .attr("transform", "translate(0,0)")
                    .selectAll("text")	
                        .style("text-anchor", "end")
                        .attr("dx", "-.4em")
                        .attr("dy", ".1em")
                        .attr("transform", "rotate(-25)");
            }

            // dispatch callbacks
            dispatch.on("link-donor." + this.plotElemID, (donorID) => {
                if(donorID != null) {
                    // clinical opacities
                    XContainer.selectAll(".clinical-group").selectAll(".clinical-rect")
                        .attr("fill-opacity", (d) => (d == donorID ? 1 : 0.4))
                        .attr("stroke-opacity", (d) => (d == donorID ? 1 : 0.4));
                    // signature opacities
                    vm.svg.selectAll(".layer").selectAll(".exposure-bar")
                        .attr("fill-opacity", (d, i) => ((normalizedData[i] && normalizedData[i]["donor_id"] == donorID) ? 1 : 0.4));
                } else {
                    vm.svg.selectAll(".exposure-bar")
                        .attr("fill-opacity", 1);
                    XContainer.selectAll(".clinical-group").selectAll(".clinical-rect")
                        .attr("fill-opacity", 1)
                        .attr("stroke-opacity", 1);
                }
            });

            dispatch.on("link-donor-destroy." + this.plotElemID, () => {
                vm.svg.selectAll(".exposure-bar")
                    .attr("fill-opacity", 1);
                XContainer.selectAll(".clinical-group").selectAll(".clinical-rect")
                        .attr("fill-opacity", 1)
                        .attr("stroke-opacity", 1);
            });
        }
    }
}
</script>

<style scoped lang="scss">

@import './../../style/variables.scss';
@import './../../style/plots.scss';

.plot-component {
    overflow-x: hidden;
    overflow-y: hidden;
}

.bottom-options {
    select:nth-of-type(2) {
        margin-right: 15px;
    }
}

</style>
