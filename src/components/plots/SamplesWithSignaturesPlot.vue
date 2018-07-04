<template>
    <div>
        <div :id="this.plotElemID" class="plot-component"></div>

        <div :id="this.tooltipElemID" class="tooltip" :style="this.tooltipPositionAttribute">
            <table>
                <tr>
                    <th>Signature</th><td>{{ this.tooltipInfo.signature }}</td>
                </tr>
                <tr>
                    <th>Percentage of Samples</th><td>{{ this.tooltipInfo.samplePercentage }}</td>
                </tr>
                <tr>
                    <th>Number of Samples</th><td>{{ this.tooltipInfo.sampleNumber }}</td>
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
            <p>This plot displays the number or percentage of samples exhibiting exposure to each signature for each of the selected sample datasets.</p>
        </div>
    </div>
</template>

<script>
import * as d3 from 'd3';
import plotMixin from './../../mixins/plot-mixin.js';
import API from './../../api.js';
import { dispatch } from './../../plot-link.js';

// child components
import Spinner from './../Spinner.vue';

export default {
    name: 'SamplesWithSignaturesPlot',
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
                signature: "",
                samplePercentage: "",
                sampleNumber: ""
            },
            options: {
                percentage: false
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
                "sources": vm.selectedDatasets,
                "signatures": vm.selectedSignatures
            };
            API.fetchSamplesWithSignatures(params).then((data) => {
                vm.plotData = data;

                vm.drawPlot();
                vm.loading = false;

                vm.$store.dispatch('emitSignaturesLegend');
            });
        },
        tooltip: function(signature, samplePercentage, sampleNumber, projID) {
            this.tooltipInfo.signature = signature || this.tooltipInfo.signature;
            this.tooltipInfo.samplePercentage = samplePercentage || this.tooltipInfo.samplePercentage;
            this.tooltipInfo.sampleNumber = sampleNumber || this.tooltipInfo.sampleNumber;
            this.tooltipInfo.projID = projID || this.tooltipInfo.projID;
            
            this.tooltipPosition.left = d3.event.x;
            this.tooltipPosition.top = this.height + 24;
            
            dispatch.call("link-signature", null, this.tooltipInfo.signature);
        },
        tooltipDestroy: function() {
            this.tooltipHide();

            dispatch.call("link-signature-destroy");
        },
        drawPlot: function () {
            var vm = this;

            if(vm.plotData === null) {
                return;
            }

            let totalSamples = d3.sum(Object.values(vm.plotData.projects));

            var maxY = totalSamples;
            if(vm.options.percentage) {
                maxY = 100;
                // TODO: divide all numbers per signature by totalSamples, *100
            }

            let signatureEntries = d3.entries(vm.plotData.signatures);

             // stacked bar values
            let stack = d3.stack()
                .keys(vm.selectedDatasets.slice().reverse())
                .value((signatureResult, key) => { return signatureResult.value[key]; })
                .order(d3.stackOrderNone)
                .offset(d3.stackOffsetNone);

            let series = stack(signatureEntries);

            // scales
            let y = d3.scaleLinear()
                .domain([0, maxY])
                .range([vm.height, 0]);

            let x = d3.scaleBand()
                .domain(vm.selectedSignatures)
                .range([0, vm.width]);

            
            d3.select(this.plotSelector).select("svg").remove();
            
            vm.svg = d3.select(this.plotSelector)
                .append("svg")
                .attr("width", this.width + this.margin.left + this.margin.right)
                .attr("height", this.height + this.margin.top + this.margin.bottom)
                .append("g")
                .attr("transform",
                    "translate(" + vm.margin.left + "," + vm.margin.top + ")")
                .on('mouseleave', vm.tooltipDestroy);
                        

            
            let layer = vm.svg.selectAll(".layer")
                .data(series)
            .enter().append("g")
                .attr("class", "layer")
                .style("fill", (d) => {
                    return vm.$store.getters.datasetColor(d["key"]); 
                })
                .on('mousemove', (d) => {
                    vm.tooltip(null, null, null, d["key"]); 
                });
            
            layer.selectAll("rect")
                .data((d) => { return d; })
            .enter().append("rect")
                .attr("class", "dataset-bar")
                .attr("x", (d, i) => { return x(signatureEntries[i].key) + 1; })
                .attr("y", (d) => { return y(d[1]); })
                .attr("height", (d) => { return y(d[0]) - y(d[1]); })
                .attr("width", x.bandwidth() - 2)
                .style("cursor", "pointer")
                .on('mouseover', (d, i) => { 
                    vm.tooltip(signatureEntries[i].key, null, (d[1] - d[0]), null); 
                });
            
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
                        "translate(" + (vm.width / 2) + "," + (vm.height + vm.margin.top + 70) + ")")
                .style("text-anchor", "middle")
                .text("Signature");
            
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
                .text("Number of Samples with Signature");
            
           
            
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
