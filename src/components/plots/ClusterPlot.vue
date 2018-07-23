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
                right: 25,
                bottom: 100,
                left: 25
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
            API.fetchClustering(params).then((data) => {
                vm.plotData = data;

                vm.drawPlot();
                vm.loading = false;
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

            if(vm.plotData === null) {
                return;
            }
            
            // Prepare data
            var tree = d3.cluster()
                .size([vm.width, vm.height / 2]);
            var root = d3.hierarchy(vm.plotData);
            tree(root);

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

            let g = vm.svg.append("g").attr("transform", "translate(0,0)");

            var link = g.selectAll(".link")
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

            var node = g.selectAll(".node")
                .data(root.descendants())
                .enter().append("g")
                .attr("class", function(d) { return "node" + (d.children ? " node--internal" : " node--leaf"); })
                .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });


            node.append("text")
                .style("display", (d) =>{ return d.children ? 'none' : 'inline'; })
                .text((d) => { return d.data.name; })
                .style("font", "10px sans-serif")
                .style("text-anchor", "end")
                .attr("dx", "-.6em")
                .attr("dy", ".6em")
                .attr("transform", "rotate(-65)");
           

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
