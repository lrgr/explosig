<template>
    <div>
        <div :id="this.plotElemID" class="plot-component"></div>

        <div :id="this.tooltipElemID" class="tooltip" :style="this.tooltipPositionAttribute">
            <table>
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
            
        </div>

        <div class="plot-info" v-if="showInfo">
            <h3>Info</h3>
            <p>This plot displays exposures to selected signatures for the selected sample, along with clinical data such as alcohol and tobacco usage for the donor.</p>
        </div>
    </div>
</template>

<script>
import * as d3 from 'd3';
import plotMixin from './../../mixins/plot-mixin.js';
import API from './../../api.js';
import { dispatch } from './../../plot-link.js';
import { MUT_TYPES } from './../../constants.js';

// child components
import Spinner from './../Spinner.vue';

export default {
    name: 'SingleSampleExposuresPlot',
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

            }
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
        currentModeOptions: {
            handler: function() {
                if(!this.pinned) {
                    this.updatePlot();
                }
            },
            deep: true
        }
    },
    methods: {
        updatePlot: function () {
            let vm = this;
            vm.loading = true;
            let params = {
                "projects": vm.selectedDatasetNames,
                "signatures": vm.selectedSignatureNames,
                "sample_id": vm.plotOptions.donor_id,
                "proj_id": vm.plotOptions.proj_id
            };
            API.fetchSingleSampleExposures(params).then((data) => {
                vm.plotData = data[0];

                vm.drawPlot();
                vm.loading = false;

                vm.$store.dispatch('emitSignaturesLegend');
                vm.$store.dispatch('emitClinicalVariablesLegend');
            });
        },
        tooltip: function(signature, exposure, clinicalKey, clinicalValue) {
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
            this.tooltipPosition.top = this.height + 24;
            
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

            let maxExposure = {};
            for(let mutType of MUT_TYPES) {
                maxExposure[mutType] = d3.max(Object.values(vm.plotData.exposures[mutType])) || 1;
            }

            let halfWidth = vm.width / 2;


            let signaturesWidthMargin = 30;
            let totalSignatures = vm.selectedSignaturesFlat.length;
            let signaturesWidth = {};
            for(let mutType of MUT_TYPES) {
                signaturesWidth[mutType] = vm.selectedSignatureNames[mutType].length / totalSignatures * (halfWidth - signaturesWidthMargin * MUT_TYPES.length);
            }


            let y = {};
            for(let mutType of MUT_TYPES) {
                y[mutType] = d3.scaleLinear()
                    .domain([0, maxExposure[mutType]])
                    .range([vm.height, 0]);
            }

            let x = {};
            let currMaxWidth = 0;
            for(let mutType of MUT_TYPES) {
                x[mutType] = d3.scaleBand()
                    .domain(vm.selectedSignatureNames[mutType])
                    .range([currMaxWidth, currMaxWidth + signaturesWidth[mutType]]);
                currMaxWidth += signaturesWidth[mutType] + signaturesWidthMargin;
            }
            
            d3.select(this.plotSelector).select("svg").remove();
            
            vm.svg = d3.select(this.plotSelector)
                .append("svg")
                .attr("width", this.width + this.margin.left + this.margin.right)
                .attr("height", this.height + this.margin.top + this.margin.bottom)
                .append("g")
                .attr("transform",
                    "translate(" + vm.margin.left + "," + vm.margin.top + ")")
                .on('mouseleave', vm.tooltipDestroy);

            for(let mutType of MUT_TYPES) {
                if(vm.selectedSignatureNames[mutType].length === 0) {
                    continue
                }
                vm.svg.append("g")
                    .selectAll(".exposure-bar")
                    .data(vm.selectedSignatureNames[mutType])
                .enter()
                    .append("rect")
                    .attr("class", "exposure-bar")
                    .attr("width", x[mutType].bandwidth() - 2)
                    .attr("height", (d) => (vm.height - y[mutType](vm.plotData.exposures[mutType][d])))
                    .attr("x", (d) => x[mutType](d) + 1)
                    .attr("y", (d) => y[mutType](vm.plotData.exposures[mutType][d]))
                    .attr("fill", (d) => vm.$store.getters.signatureColor(d, mutType))
                    .on('mouseover', (d) => {
                        vm.tooltip(d, vm.plotData.exposures[mutType][d], null, null); 
                    });
                
                // x axis
                vm.svg.append("g")
                    .attr("transform", "translate(0," + (vm.height) + ")")
                    .call(d3.axisBottom(x[mutType]).tickSizeOuter(0))
                        .selectAll("text")	
                            .style("text-anchor", "end")
                            .attr("x", "-.8em")
                            .attr("y", ".15em")
                            .attr("transform", "rotate(-65)");
                
                // text label for the x axis
                vm.svg.append("text")
                    .attr("transform",
                            "translate(" + ((x[mutType].range()[0] + x[mutType].range()[1])/2) + " ," + (vm.height + vm.margin.top + 50) + ")")
                    .style("text-anchor", "middle")
                    .text(mutType);
                
                // y axis
                vm.svg.append("g")
                    .attr("transform", "translate(" + x[mutType].range()[0] + ",0)")
                    .call(d3.axisLeft(y[mutType]));
                
             
            }

               // text label for the y axis
                vm.svg.append("text")
                    .attr("transform", "rotate(-90)")
                    .attr("y", 0 - vm.margin.left + 10)
                    .attr("x", 0 - (vm.height / 2))
                    .attr("dy", "1em")
                    .style("text-anchor", "middle")
                    .text("Signature Exposures");
            
            // text label for the x axis
            vm.svg.append("text")
                .attr("transform",
                        "translate(" + (halfWidth/2) + " ," + (vm.height + vm.margin.top + 70) + ")")
                .style("text-anchor", "middle")
                .text("Signatures");
            
            // clinical variables
            let clinicalSize = 20;
            let clinicalMarginY = 4;
            let clinicalMarginTop = 40;

            let clinicalVarGroup = vm.svg.append("g")
                .attr("transform", "translate(" + (halfWidth + vm.margin.left) + "," + (clinicalMarginTop) + ")")
                .selectAll(".clinical-rect")
                .data(vm.selectedClinicalVariables)
            .enter();
            
            clinicalVarGroup.append("rect")
                .attr("class", "clinical-rect")
                .attr("x", 0)
                .attr("y", (d, i) => i*(clinicalSize+4 + clinicalMarginY))
                .attr("height", clinicalSize)
                .attr("width", clinicalSize)
                .attr("fill", (d) => {
                    return d.color(vm.plotData.clinical[d.id]);
                })
                .on('mouseover', (d) => {
                    vm.tooltip(null, null, d.name, d.transform(vm.plotData.clinical[d.id])); 
                });
                

            clinicalVarGroup.append("text")
                .style("font-size", "14px")
                .attr("x", clinicalSize + 4 + 3)
                .attr("y", (d, i) => i*(clinicalSize+4 + clinicalMarginY) + ((clinicalSize+4)/2) + 3)
                .text((d) => d.name);
            
            // text label for clinical variables
            vm.svg.append("text")
                .attr("transform", "translate(" + (halfWidth + vm.margin.left) + "," + (clinicalMarginTop/2) + ")")
                .style("text-anchor", "start")
                .text("Clinical Variables");
            
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
