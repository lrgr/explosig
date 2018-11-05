<template>
    <div>
       <!-- <div class="top-options">
            <GeneAutocomplete :submitGene="submitGene"/>
        </div> -->

        <div :id="this.plotElemID" class="plot-component" :style="{'height': outerHeight + 'px'}"></div>

        <div :id="this.tooltipElemID" class="tooltip" :style="this.tooltipPositionAttribute">
            <table>
                <tr>
                    <th>Sample</th><td>{{ this.tooltipInfo.donorID }}</td>
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
            <select v-model="sortByType">
                <option value="exposures">Signature Exposure</option>
                <option value="clinical">Clinical Variable</option>
            </select>
            &nbsp;
            <select v-model="sortByCategory" v-show="sortByType !== null && sortByType !== undefined && sortByCategoryList.length > 0">
                <option v-for="category in sortByCategoryList" :key="category" :value="category">{{ category }}</option>
            </select>
            &nbsp;
            <select v-model="sortBySubcategory" v-show="sortByCategory !== null && sortByCategory !== undefined && sortBySubcategoryList.length > 0">
                <option v-for="subcategory in sortBySubcategoryList" :key="subcategory" :value="subcategory">{{ subcategory }}</option>
            </select>

            <input type="checkbox" id="enableXScroll" v-model="options.xScroll">
            <label for="enableXScroll">Enable Horizontal Scroll</label>
        </div>

        <div class="plot-info" v-if="showInfo">
            <h3>Info</h3>
            <p>This plot displays exposures to selected signatures for each sample in the selected dataset, along with clinical data such as alcohol and tobacco usage.</p>
            <p>Drag along the x axis to pan across additional samples.</p>
        </div>
    </div>
</template>

<script>
import * as d3 from 'd3';
import plotMixin from './../../mixins/plot-mixin.js';
import API from './../../api.js';
import { getTranslation } from './../../helpers.js';
import { dispatch } from './../../plot-link.js';
import { MUT_TYPES } from './../../constants.js';

// child components
import Spinner from './../Spinner.vue';
import GeneAutocomplete from './../GeneAutocomplete.vue';

export default {
    name: 'ExposuresPlot',
    mixins: [plotMixin],
    props: [],
    components: {
        Spinner,
        GeneAutocomplete
    },
    data: function () {
        return {
            outerHeight: 450,
            margin: {
                top: 20,
                right: 30,
                bottom: 100,
                left: 105
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
                xScroll: true
            },
            sortByType: null,
            sortByTypeList: ["exposures", "clinical"],
            sortByCategory: null,
            sortByCategoryList: [],
            sortBySubcategory: null,
            sortBySubcategoryList: [],
            eventsData: {}
        };
    },
    computed: {
        height: function () {
            return this.outerHeight - this.margin.top - this.margin.bottom;
        },
        width: function() {
            return (this.windowWidth*0.8) - 40 - this.margin.left - this.margin.right;
        }
    },
    watch: {
        sortByType: function(val) {
            if(val === "exposures") {
                this.sortByCategoryList = MUT_TYPES;
            } else if(val === "clinical") {
                this.sortByCategoryList = this.selectedClinicalVariables.map((el) => el.name);
            }
            this.sortByCategory = null;
            this.sortBySubcategory = null;
            this.sortBySubcategoryList = [];
        },
        sortByCategory: function(val) {
            if(this.sortByType === "exposures") {
                this.sortBySubcategoryList = this.selectedSignatureNames[val];
                this.sortBySubcategory = null;
            } else if(val !== null && val !== undefined) {
                this.drawPlot();
            }
        },
        sortBySubcategory: function(val) {
            if(val !== null && val !== undefined) {
                this.drawPlot();
            }
        }
    },
    methods: {
        submitGene(geneId) {
            let vm = this;
            let params = {
                "gene_id": geneId,
                "projects": this.selectedDatasetNames
            };
            API.fetchGeneEventTrack(params)
                .then((eventData) => {
                    vm.eventsData[geneId] = eventData;
                    vm.drawPlot();
                })
        },
        updatePlot: function () {
            let vm = this;
            vm.loading = true;
            let params = {
                "projects": vm.selectedDatasetNames,
                "signatures": vm.selectedSignatureNames
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

           
            /**
             * Data preparation
             */
            // normalize data if necessary
            var normalizedData = vm.plotData;
            if(vm.options.normalizeExposures) {
                normalizedData = normalizedData.map((d) => {
                    // deep copy of exposures objects
                    d = Object.assign({}, d);
                    d["exposures"] = Object.assign({}, d["exposures"]);

                    for(let mutType of MUT_TYPES) {
                        d["exposures"][mutType] = Object.assign({}, d["exposures"][mutType]);
                        let dMax = d3.sum(Object.values(d["exposures"][mutType]));
                        if(dMax > 0) {
                            Object.keys(d["exposures"][mutType]).map((sigName) => {
                                d["exposures"][mutType][sigName] = d["exposures"][mutType][sigName] / parseFloat(dMax);
                            });
                        }
                    }
                    return d;
                });
            }
            // sort data if necessary
            if(vm.sortByType !== null && vm.sortByCategory !== null && vm.sortByCategory !== undefined) {
                if(vm.sortByType == "exposures" && vm.sortBySubcategory !== null && vm.sortBySubcategory !== undefined) {
                    normalizedData.sort(function(a, b) {
                        return d3.descending(
                            (a[vm.sortByType][vm.sortByCategory][vm.sortBySubcategory] === undefined ? -1 : +a[vm.sortByType][vm.sortByCategory][vm.sortBySubcategory]), 
                            (b[vm.sortByType][vm.sortByCategory][vm.sortBySubcategory] === undefined ? -1 : +b[vm.sortByType][vm.sortByCategory][vm.sortBySubcategory])
                        );
                    });
                } else if(vm.sortByType == "clinical") {
                    normalizedData.sort( (a, b) => 
                        vm.getClinicalVariable(vm.sortByCategory).comparator(
                            a[vm.sortByType][vm.sortByCategory], 
                            b[vm.sortByType][vm.sortByCategory]
                        )
                    );
                }
                
            }

            // compute max for y axis
            let maxCountSum = {};
            let maxCountSumAcrossMutTypes = 0;
            for(let mutType of MUT_TYPES) {
                maxCountSum[mutType] = d3.max(normalizedData.map((d) => {
                    return d3.sum(Object.values(d["exposures"][mutType]));
                }));
                maxCountSumAcrossMutTypes = Math.max(maxCountSum[mutType], maxCountSumAcrossMutTypes);
            }


            let marginX = 0;
            if(vm.options.xScroll) {
                marginX = 2;
            }

            let clinicalRowMargin = 2;
            let clinicalRowHeight = 10;

            let signaturesRowMargin = 10;

            let signaturesHeightMax = 300;
            let totalSignaturesHeight = 0;
            let signaturesHeight = {};
            for(let mutType of MUT_TYPES) {
                
                let ratio = maxCountSum[mutType] / maxCountSumAcrossMutTypes;
                if(maxCountSum[mutType] > 0) {
                    signaturesHeight[mutType] = Math.max(ratio * signaturesHeightMax, 80);
                } else {
                    signaturesHeight[mutType] = 0;
                }
                totalSignaturesHeight += signaturesHeight[mutType] + signaturesRowMargin;
            }
            let clinicalHeight = vm.selectedClinicalVariables.length * (clinicalRowHeight + clinicalRowMargin);
            let eventsHeight = Object.keys(vm.eventsData).length * (clinicalRowHeight + clinicalRowMargin);
            
            vm.outerHeight = totalSignaturesHeight + eventsHeight + clinicalHeight + vm.margin.top + vm.margin.bottom;
            

            let minBarWidth = (this.options.xScroll ? 20 : 0);
            let barWidth = Math.max(minBarWidth, this.width / this.plotData.length);
            // expand plot width to account for minimum bar width adjustments
            let plotWidth = barWidth * this.plotData.length;
            




            let sampleNames = normalizedData.map((d) => { return d["sample_id"]; });

            /**
             * Scales
             */
            let x = d3.scaleBand()
                .domain(sampleNames)
                .range([0, plotWidth]);
            
            let y = {};
            let currMaxY = 0;
            for(let mut_i = 0; mut_i < MUT_TYPES.length; mut_i++) {
                let mutType = MUT_TYPES[mut_i];
                let minY = currMaxY;
                let maxY = minY + signaturesHeight[mutType];
                y[mutType] = d3.scaleLinear()
                    .domain([0, maxCountSum[mutType]])
                    .range([maxY, minY]);
                currMaxY = maxY + signaturesRowMargin;
            }
            
            // stacked bar values
            let series = {};
            for(let mutType of MUT_TYPES) {
                let stack = d3.stack()
                    .keys(vm.selectedSignatureNames[mutType].slice().reverse())
                    .value((d, key) => { return d["exposures"][mutType][key] || 0; })
                    .order(d3.stackOrderNone)
                    .offset(d3.stackOffsetNone);

                series[mutType] = stack(normalizedData);
            }

            /**
             * SVG Elements
             */
            // remove existing svg element
            d3.select(this.plotSelector).select("svg").remove();
            
            // create new svg element
            vm.svg = d3.select(this.plotSelector)
                .append("svg")
                .attr("width", plotWidth + this.margin.left + this.margin.right)
                .attr("height", vm.height + this.margin.top + this.margin.bottom)
                .append("g")
                .attr("transform",
                    "translate(" + vm.margin.left + "," + vm.margin.top + ")")
                .on('mouseleave', vm.tooltipDestroy);
            
            let XContainer = vm.svg.append("g")
                .attr("transform", "translate(0,0)");

            /**
             * Signature exposure stacked bars
             */
            for(let mutType of MUT_TYPES) {

                let layer = XContainer.append("g").selectAll(".layer")
                    .data(series[mutType])
                .enter().append("g")
                    .attr("class", "layer")
                    .style("fill", (d) => {
                        return vm.$store.getters.signatureColor(d["key"], mutType); 
                    })
                    .on('mousemove', (d) => {
                        vm.tooltip(null, null, d["key"], null); 
                    });
                
                layer.selectAll("rect")
                    .data((d) => { return d; })
                .enter().append("rect")
                    .attr("class", "exposure-bar")
                    .attr("x", (d, i) => { return x(normalizedData[i]["sample_id"]); })
                    .attr("y", (d) => { return y[mutType](d[1]); })
                    .attr("height", (d) => { return y[mutType](d[0]) - y[mutType](d[1]); })
                    .attr("width", barWidth - marginX)
                    .style("cursor", "pointer")
                    .on('mouseover', (d, i) => { 
                        vm.tooltip(normalizedData[i]["sample_id"], normalizedData[i]["proj_id"], null, (d[1] - d[0]), null, null); 
                    })
                    .on('click', (d, i) => {
                        vm.enterSingleDonorMode(normalizedData[i]["sample_id"], normalizedData[i]["proj_id"]);
                    });
            }
        
            /**
             * Clinical variable heatmap
             */
            let clinicalY = {};
            var var_i;
            for(var_i = 0; var_i < vm.selectedClinicalVariables.length; var_i++) {
                let selectedCV = vm.selectedClinicalVariables[var_i];

                clinicalY[selectedCV.id] = d3.scaleBand()
                    .domain([selectedCV.name])
                    .range([totalSignaturesHeight + clinicalRowMargin + (var_i+1)*(clinicalRowHeight + clinicalRowMargin), totalSignaturesHeight + clinicalRowMargin + (var_i)*(clinicalRowHeight + clinicalRowMargin)]);

                XContainer.append("g")
                    .attr("class", "clinical-group")
                .selectAll(".clinical-rect")
                    .data(sampleNames)
                .enter().append("rect")
                    .attr("class", "clinical-rect")
                    .attr("x", (d) => { return x(d); })
                    .attr("y", clinicalY[selectedCV.id](selectedCV.name))
                    .attr("height", clinicalRowHeight)
                    .attr("width", barWidth - marginX)
                    .style("cursor", "pointer")
                    .attr("fill", (d, i) => {
                        return selectedCV.color(normalizedData[i]["clinical"][selectedCV.id]);
                    })
                    .on('mouseover', (d, i) => {
                        vm.tooltip(normalizedData[i]["sample_id"], normalizedData[i]["proj_id"], null, null, selectedCV.name, selectedCV.transform(normalizedData[i]["clinical"][selectedCV.id]));
                    })
                    .on('click', (d, i) => {
                        vm.enterSingleDonorMode(normalizedData[i]["sample_id"], normalizedData[i]["proj_id"]);
                    });
            }

            /**
             * Genomic events tracks
             */
            let eventY = {};
            let eventGenes = Object.keys(vm.eventsData);
            for(var_i = 0; var_i < eventGenes.length; var_i++) {
                let geneId = eventGenes[var_i];
                let geneData = vm.eventsData[geneId];

                eventY[geneId] = d3.scaleBand()
                    .domain([geneId])
                    .range([totalSignaturesHeight + clinicalHeight + clinicalRowMargin + (var_i+1)*(clinicalRowHeight + clinicalRowMargin), totalSignaturesHeight + clinicalHeight + clinicalRowMargin + (var_i)*(clinicalRowHeight + clinicalRowMargin)]);

                XContainer.append("g")
                    .attr("class", "event-group")
                .selectAll(".event-rect")
                    .data(sampleNames)
                .enter().append("rect")
                    .attr("class", "event-rect")
                    .attr("x", (d) => { return x(d); })
                    .attr("y", eventY[geneId](geneId))
                    .attr("height", clinicalRowHeight)
                    .attr("width", barWidth - marginX)
                    .style("cursor", "pointer")
                    .attr("fill", (d, i) => {
                        return (geneData[d]["event"] !== "NA" ? "#000": "#FFF");
                    })
                    .on('mouseover', (d, i) => {
                        vm.tooltip(normalizedData[i]["sample_id"], normalizedData[i]["proj_id"], null, null, geneId, geneData[d]["event"]);
                    })
                    .on('click', (d, i) => {
                        vm.enterSingleDonorMode(normalizedData[i]["sample_id"], normalizedData[i]["proj_id"]);
                    });
            }
            
            /**
             * Axes
             */
            // x axis container
            let xAxis = XContainer.append("g")
                .attr("transform", "translate(0," + (vm.height + clinicalRowMargin) + ")")
                .attr("class", "x_axis");

            // x axis ticks
            xAxis.call(d3.axisBottom(x).tickSizeOuter(0).tickPadding(0))
                .selectAll("text")	
                    .style("text-anchor", "end")
                    .attr("x", "-.8em")
                    .attr("y", ".15em")
                    .attr("transform", "rotate(-65)");
            
            // x axis drag target
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
            
            // x axis text label
            vm.svg.append("text")
                .attr("transform",
                        "translate(" + (vm.width/2) + " ," + (vm.height + vm.margin.top + 70) + ")")
                .style("text-anchor", "middle")
                .text("Sample");

            // y axis container
            let yAxis = vm.svg.append("g");
            
            // y axis white background
            yAxis.append("rect")
                    .attr("width", vm.margin.left)
                    .attr("height", vm.height + vm.margin.bottom)
                    .attr("transform", "translate(" + (-vm.margin.left) + ",0)")
                    .attr("fill", (vm.options.xScroll ? "#FFF" : "transparent"));
            
            // y axis exposures ticks
            for(let mutType of MUT_TYPES) {
                if(maxCountSum[mutType] > 0) {
                    yAxis.append("g").call(d3.axisLeft(y[mutType]));
                }
            }

            let prevSignaturesHeight = signaturesRowMargin;
            for(var_i = MUT_TYPES.length - 1; var_i >= 0; var_i--) {
                let mutType = MUT_TYPES[var_i];
                if(maxCountSum[mutType] > 0) {
                    let currSignaturesCenter = prevSignaturesHeight + (signaturesHeight[mutType] / 2);
                    yAxis.append("g").append("text")
                        .attr("transform", "rotate(-90)")
                        .attr("y", 0 - vm.margin.left + 30)
                        .attr("x", 0 - (vm.height - clinicalHeight - currSignaturesCenter))
                        .attr("dy", "1em")
                        .style("text-anchor", "middle")
                        .style("font-size", "14px")
                        .text(mutType); 
                    prevSignaturesHeight += signaturesHeight[mutType] + signaturesRowMargin;
                }
            }
            
            // y axis text label
            vm.svg.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 0 - vm.margin.left + 10)
                .attr("x", 0 - ((vm.height - clinicalHeight) / 2))
                .attr("dy", "1em")
                .style("text-anchor", "middle")
                .text("Signature Exposure");  
            
            // y axis for clinical vars
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

            // y axis for event vars
            for(var_i = 0; var_i < eventGenes.length; var_i++) {
                var geneId = eventGenes[var_i];
                vm.svg.append("g")
                    .call(d3.axisLeft(eventY[geneId]).tickSizeOuter(0))
                    .attr("transform", "translate(0,0)")
                    .selectAll("text")	
                        .style("text-anchor", "end")
                        .attr("dx", "-.4em")
                        .attr("dy", ".1em")
                        .attr("transform", "rotate(-25)");
            }

            /**
             * Dispatch indicators
             */
            let donorHighlight = XContainer.append("g")
                .attr("class", "donor-highlight");
            
            donorHighlight.append("line")
                .attr("x1", 0)
                .attr("y1", 0)
                .attr("x2", 0)
                .attr("y2", vm.height)
                .attr("stroke", "#000")
                .attr("stroke-width", 1)
                .attr("stroke-opacity", 0);
            
            donorHighlight.append("line")
                .attr("x1", barWidth - marginX)
                .attr("y1", 0)
                .attr("x2", barWidth - marginX)
                .attr("y2", vm.height)
                .attr("stroke", "#000")
                .attr("stroke-width", 1)
                .attr("stroke-opacity", 0);

            /**
             * Dispatch callbacks
             */
            dispatch.on("link-donor." + this.plotElemID, (donorID) => {
                let i = sampleNames.indexOf(donorID);
                if(i != -1) {
                    // move donor highlight group
                    donorHighlight
                        .attr("transform", "translate(" + x(donorID) + ",0)");

                    // show donor highlight
                    donorHighlight.selectAll("line")
                        .attr("stroke-opacity", 0.5);

                } else {
                    // hide donor highlight
                    donorHighlight.selectAll("line")
                        .attr("stroke-opacity", 0);
                }
            });

            dispatch.on("link-donor-destroy." + this.plotElemID, () => {
                // hide donor highlight
                donorHighlight.selectAll("line")
                        .attr("stroke-opacity", 0);
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
    select:last-of-type {
        margin-right: 15px;
    }
}

.top-options {
    right: 0;
    top: 0;
    position: absolute;
}

</style>
