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
                    <th>Normalized Exposure</th><td>{{ this.tooltipInfo.exposure }}</td>
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
            <p>This plot displays samples clustered by exposures, clinical data, etc..., computed using the Ward linkage method.</p>
            <p>Click on any parent in the tree to view a subset of samples.</p>
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
        showSubset: function() {
            return (this.clusteringSubset !== undefined && this.clusteringSubset !== null);
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

            if(vm.clusteringData === null || vm.exposuresData === null) {
                return;
            }

            // Prepare data
            let tree = d3.cluster()
                .size([vm.width, vm.height / 3]);
            var root;
            if(vm.showSubset()) {
                root = vm.clusteringSubset;
            } else {
                root = d3.hierarchy(vm.clusteringData);
            }
            tree(root);

            // Set x and y of clustered values for exposure/clinical values
            let leaves = root.descendants().filter((el) => (!el.children));
            for(let leaf of leaves) {
                let exposureIndex = vm.exposuresData.findIndex((el) => (leaf.data.name === el.donor_id));
                vm.exposuresData[exposureIndex].x = leaf.x;
                vm.exposuresData[exposureIndex].y = leaf.y;
            }

            // filter data
            var filteredData;
            if(vm.showSubset()) {
                filteredData = vm.exposuresData.filter((dataEl) => {
                    return (leaves.findIndex((leafEl) => (dataEl.donor_id === leafEl.data.name)) > -1);
                });
            } else {
                filteredData = vm.exposuresData;
            }

            // normalize data
            var normalizedData = filteredData;
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

            let sampleNames = normalizedData.map((el) => el.donor_id);


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
                .attr("stroke-opacity", 0.6)
                .attr("stroke-width", "1.5px");

            let node = gTree.selectAll(".node")
                .data(root.descendants())
                .enter().append("g")
                .attr("class", function(d) { return "node" + (d.children ? " node--internal" : " node--leaf"); })
                .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });


            node.append("text")
                .style("display", (d) => { return d.children ? 'none' : 'none'; })
                .text((d) => { return d.data.name; })
                .style("font", "10px sans-serif")
                .style("text-anchor", "end")
                .attr("dx", "-.6em")
                .attr("dy", ".6em")
                .attr("transform", "rotate(-65)");
            
            // filtering buttons
            node.append("circle")
                .attr("r", 7)
                .attr("fill", "#555")
                .attr("fill-opacity", 0)
                .style("cursor", "pointer")
                .on("mouseover", function() {
                    d3.select(this).attr("fill-opacity", 0.6);
                })
                .on("mouseleave", function() {
                    d3.select(this).attr("fill-opacity", 0);
                })
                .on("click", function(d) {
                    vm.clusteringSubset = d;
                    vm.drawPlot();
                });
            
            // reset button
            if(vm.showSubset()) {
                gTree.append("text")
                    .text("Reset")
                    .style("font", "10px sans-serif")
                    .style("text-anchor", "middle")
                    .style("cursor", "pointer")
                    .attr("x", vm.width / 2)
                    .attr("y", -7)
                    .on("click", () => {
                        vm.clusteringSubset = null;
                        vm.drawPlot();
                    });
            }


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
                .attr("transform", (d) => "translate(" + d.x + "," + d.y + ")")
                .on("mouseover", (d) => {
                    vm.tooltip(d.donor_id, d.proj_id, null, null, null, null);
                })
                .on("click", (d) => {
                    vm.enterSingleDonorMode(d.donor_id, d.proj_id);
                });
            
            donorCols.selectAll(".signature-cell")
                    .data((d) => d3.entries(d.exposures))
                    .enter().append("rect")
                        .attr("class", "signature-cell")
                        .attr("width", heatmapColWidth)
                        .attr("height", signaturesY.bandwidth())
                        .attr("x", -(heatmapColWidth / 2))
                        .attr("y", (d) => signaturesY(d.key))
                        .attr("fill", (d) => vm.$store.getters.signatureColor(d.key) )
                        .attr("fill-opacity", (d) => d.value)
                        .style("cursor", "pointer")
                        .on("mouseover", (d) => {
                            vm.tooltip(null, null, d.key, d.value, null, null);
                        });
            
            // y Axis for signature names
            let yAxis = vm.svg.append("g")
                .attr("transform", "translate(0," + normalizedData[0].y + ")");
            
            yAxis.call(d3.axisLeft(signaturesY).tickSizeOuter(0));
            
            /**
             * Dispatch indicators
             */
            let donorHighlight = vm.svg.append("g")
                .attr("class", "donor-highlight");
            
            donorHighlight.append("line")
                .attr("x1", -(heatmapColWidth / 2))
                .attr("y1", 0)
                .attr("x2", -(heatmapColWidth / 2))
                .attr("y2", vm.height)
                .attr("stroke", "#000")
                .attr("stroke-width", 1)
                .attr("stroke-opacity", 0);
            
            donorHighlight.append("line")
                .attr("x1", (heatmapColWidth / 2))
                .attr("y1", 0)
                .attr("x2", (heatmapColWidth / 2))
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
                    console.log(i);
                    // get x position of donor col
                    let donorTranslate = gHeatmap.selectAll(".donor-col").filter(":nth-child(" + (i+1) + ")").attr("transform");
                    console.log(donorTranslate);
                    // move donor highlight group
                    donorHighlight
                        .attr("transform", donorTranslate);

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



</style>
