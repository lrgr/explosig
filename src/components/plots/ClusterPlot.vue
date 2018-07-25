<template>
    <div>
        <div :id="this.plotElemID" class="plot-component"></div>

        <div :id="this.tooltipElemID" class="tooltip" :style="this.tooltipPositionAttribute">
            <table>
                <tr>
                    <th>Donor</th><td>{{ this.tooltipInfo.donorID }}</td>
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
            <p>This plot displays samples clustered by exposures, clinical data, etc..., computed using the Ward linkage method.</p>
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
    name: 'ClusterPlot',
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
                donorID: ""
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
                "signatures": vm.selectedSignatures
            };
            API.fetchClustering(params).then((clusteringData) => {
                API.fetchExposures(params).then((exposuresData) => {
                    vm.clusteringData = clusteringData;
                    vm.exposuresData = exposuresData;

                    vm.drawPlot();
                    vm.loading = false;
                });
            });
        },
        tooltip: function(donorID) {
            this.tooltipInfo.donorID = donorID || this.tooltipInfo.donorID;

            this.tooltipPosition.left = d3.event.x;
            this.tooltipPosition.top = this.height + 30;
            
            dispatch.call("link-donor", null, this.tooltipInfo.donorID);
        },
        tooltipDestroy: function() {
            this.tooltipHide();

            dispatch.call("link-donor-destroy");
        },
        drawPlot: function () {
            var vm = this;

            if(vm.clusteringData === null || vm.exposuresData === null) {
                return;
            }
            
            // Prepare data
            let tree = d3.cluster()
                .size([vm.width, vm.height / 3]);
            var root = d3.hierarchy(vm.clusteringData);
            tree(root);

            // Set x and y of clustered values for exposure/clinical values
            let leaves = root.descendants().filter((el) => (!el.children));
            for(let leaf of leaves) {
                let exposureIndex = vm.exposuresData.findIndex((el) => (leaf.data.name === el.donor_id));
                vm.exposuresData[exposureIndex].x = leaf.x;
                vm.exposuresData[exposureIndex].y = leaf.y;
            }

            // normalize data
            var normalizedData = vm.exposuresData;
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


            // create svg elements
            d3.select(this.plotSelector).select("svg").remove();

            vm.svg = d3.select(this.plotSelector)
                .append("svg")
                .attr("width", this.width + this.margin.left + this.margin.right)
                .attr("height", this.height + this.margin.top + this.margin.bottom)
                .append("g")
                .attr("transform",
                    "translate(" + vm.margin.left + "," + vm.margin.top + ")")
                .on('mouseleave', vm.tooltipDestroy);

            let gTree = vm.svg.append("g").attr("transform", "translate(0,0)");

            gTree.selectAll(".link")
                .data(root.descendants().slice(1))
                .enter().append("path")
                .attr("class", "link")
                .attr("d", function(d) {
                    return "M" + d.parent.x + "," + d.parent.y
                        + "H" + d.x
                        + "M" + d.x + "," + d.y
                        + "V" + d.parent.y;
                })
                .attr("fill", "none")
                .attr("stroke", "#555")
                .attr("stroke-opacity", 0.4)
                .attr("stroke-width", "1.5px");

            let node = gTree.selectAll(".node")
                .data(root.descendants())
                .enter().append("g")
                .attr("class", function(d) { return "node" + (d.children ? " node--internal" : " node--leaf"); })
                .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });


            node.append("text")
                .style("display", (d) =>{ return d.children ? 'none' : 'none'; })
                .text((d) => { return d.data.name; })
                .style("font", "10px sans-serif")
                .style("text-anchor", "end")
                .attr("dx", "-.6em")
                .attr("dy", ".6em")
                .attr("transform", "rotate(-65)");
            
            // Add heatmap below tree
            let gHeatmap = vm.svg.append("g").attr("transform", "translate(0,0)");

            let heatmapColWidth = vm.width / normalizedData.length / 2;
            let signaturesY = d3.scaleBand()
                .domain(vm.selectedSignatures)
                .range([0, (vm.height / 2)]);


            let donorCols = gHeatmap.selectAll(".donor-col")
                .data(normalizedData)
                .enter().append("g")
                .attr("class", "donor-col")
                .attr("transform", (d) => "translate(" + d.x + "," + d.y + ")");
            donorCols.selectAll(".signature-cell")
                    .data((d) => d3.entries(d.exposures))
                    .enter().append("rect")
                        .attr("class", "signature-cell")
                        .attr("width", heatmapColWidth)
                        .attr("height", signaturesY.bandwidth())
                        .attr("x", -(heatmapColWidth / 2))
                        .attr("y", (d) => signaturesY(d.key))
                        .attr("fill", (d) => vm.$store.getters.signatureColor(d.key) )
                        .attr("fill-opacity", (d) => d.value);
            
            // y Axis for signature names
            let yAxis = vm.svg.append("g")
                .attr("transform", "translate(0," + normalizedData[0].y + ")");
            
            yAxis.call(d3.axisLeft(signaturesY).tickSizeOuter(0));
            

            // dispatch callbacks
            dispatch.on("link-donor." + this.plotElemID, (donorID) => {
                if(donorID != null) {
                    /// TODO
                } else {
                    // TODO
                }
            });

            dispatch.on("link-donor-destroy." + this.plotElemID, () => {
                // TODO
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



</style>
