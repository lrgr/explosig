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
            <p>This plot displays exposures to selected signatures for the selected donor, along with clinical data such as alcohol and tobacco usage.</p>
        </div>
    </div>
</template>

<script>
import * as d3 from 'd3';
import plotMixin from './../../mixins/plot-mixin.js';
import API from './../../api.js';
import { getTranslation } from './../../helpers.js';
import { dispatch } from './plot-link.js';

// child components
import Spinner from './../Spinner.vue';

export default {
    name: 'SingleDonorExposuresPlot',
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
    methods: {
        updatePlot: function () {
            let vm = this;
            vm.loading = true;
            let params = {
                "sources": vm.selectedDatasets,
                "signatures": vm.selectedSignatures,
                "donor_id": vm.currentModeOptions.donor_id,
                "proj_id": vm.currentModeOptions.proj_id
            };
            API.fetchSingleDonorExposures(params).then((data) => {
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

            let maxExposure = d3.max(Object.values(vm.plotData.exposures));
            let halfWidth = vm.width / 3;

            let y = d3.scaleLinear()
                .domain([0, maxExposure])
                .range([vm.height, 0]);

            let x = d3.scaleBand()
                .domain(vm.selectedSignatures)
                .range([0, halfWidth]);
            
            vm.svg = d3.select(this.plotSelector)
                .append("svg")
                .attr("width", this.width + this.margin.left + this.margin.right)
                .attr("height", this.height + this.margin.top + this.margin.bottom)
                .append("g")
                .attr("transform",
                    "translate(" + vm.margin.left + "," + vm.margin.top + ")")
                .on('mouseleave', vm.tooltipDestroy);
            
            vm.svg.append("g")
                .selectAll(".exposure-bar")
                .data(vm.selectedSignatures)
            .enter()
                .append("rect")
                .attr("class", "exposure-bar")
                .attr("width", x.bandwidth() - 2)
                .attr("height", (d) => (vm.height - y(vm.plotData.exposures[d])))
                .attr("x", (d) => x(d) + 1)
                .attr("y", (d) => y(vm.plotData.exposures[d]))
                .attr("fill", (d) => vm.$store.getters.signatureColor(d));
            
            // x axis
            vm.svg.append("g")
                .attr("transform", "translate(0," + (vm.height) + ")")
                .call(d3.axisBottom(x))
                    .selectAll("text")	
                        .style("text-anchor", "end")
                        .attr("x", "-.8em")
                        .attr("y", ".15em")
                        .attr("transform", "rotate(-65)");
            
            // text label for the x axis
            vm.svg.append("text")
                .attr("transform",
                        "translate(" + (halfWidth/2) + " ," + (vm.height + vm.margin.top + 70) + ")")
                .style("text-anchor", "middle")
                .text("Signatures");
            
            // y axis
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
                .attr("stroke", (d) => {
                    if(vm.plotData.clinical[d] === undefined || vm.plotData.clinical[d] == "nan") {
                        // variable is not present for the donor or is NaN => unknown
                        return "transparent";
                    } else {
                        return "#000000";
                    }
                })
                .attr("stroke-width", 2)
                .attr("fill", (d) => {
                    if(vm.plotData.clinical[d] === undefined || vm.plotData.clinical[d] == "nan") {
                        // variable is not present for the donor or is NaN => unknown
                        return "transparent";
                    } else {
                        return d3.interpolateGreys(+vm.plotData.clinical[d]);
                    }
                })
                .on('mouseover', (d) => {
                    if(vm.plotData.clinical[d] === undefined || vm.plotData.clinical[d] == "nan") {
                        // variable is not present for the donor or is NaN => unknown
                        vm.tooltip(null, null, vm.$store.getters.clinicalVariable(d).name, "Unknown"); 
                    } else {
                        vm.tooltip(null, null, vm.$store.getters.clinicalVariable(d).name, +vm.plotData.clinical[d]); 
                    }
                    
                });
                

            clinicalVarGroup.append("text")
                .style("font-size", "14px")
                .attr("x", clinicalSize + 4 + 3)
                .attr("y", (d, i) => i*(clinicalSize+4 + clinicalMarginY) + ((clinicalSize+4)/2) + 3)
                .text((d) => vm.$store.getters.clinicalVariable(d).name);
            
            // text label for clinical variables
            vm.svg.append("text")
                .attr("transform", "translate(" + (halfWidth + (halfWidth/2) + vm.margin.left) + "," + (clinicalMarginTop/2) + ")")
                .style("text-anchor", "middle")
                .text("Clinical Variables");
            
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

.bottom-options {
    select:nth-of-type(2) {
        margin-right: 15px;
    }
}

</style>
