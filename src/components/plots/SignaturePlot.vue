<template>
    <div>
        <div :id="this.plotElemID" class="plot-component"></div>

        <div :id="this.tooltipElemID" class="tooltip" :style="this.tooltipPositionAttribute">
            <table>
                <tr>
                    <th>Mutation Category</th><td>{{ this.tooltipInfo.mutationCategory }}</td>
                </tr>
                <tr>
                    <th>Probability</th><td>{{ this.tooltipInfo.probability }}</td>
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
            <p>This plot displays probabilities for each of the mutation contexts that comprise the selected signature.</p>
            
        </div>
    </div>
</template>

<script>
import * as d3 from 'd3';
import plotMixin from './../../mixins/plot-mixin.js';
import API from './../../api.js';
import { dispatch } from './../../plot-link.js';
import { MUTATION_COLORS } from './../../constants.js';

// child components
import Spinner from './../Spinner.vue';

export default {
    name: 'SignaturePlot',
    mixins: [plotMixin],
    props: ['signature'],
    components: {
        Spinner
    },
    data: function () {
        return {
            margin: {
                top: 50,
                right: 30,
                bottom: 80,
                left: 80
            },
            tooltipInfo: {
                mutationCategory: "",
                probability: ""
            },
            options: {}
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
                "signature": vm.plotOptions.signature
            };
            API.fetchSignature(params).then((data) => {
                vm.plotData = data;

                vm.drawPlot();
                vm.loading = false;
            });
        },
        tooltip: function(mutationCategory, probability) {
            this.tooltipInfo.mutationCategory = mutationCategory;
            this.tooltipInfo.probability = probability;
            
            this.tooltipPosition.left = d3.event.x;
            this.tooltipPosition.top = this.height + 30;
        },
        tooltipDestroy: function() {
            this.tooltipHide();
        },
        drawPlot: function () {
            var vm = this;

            if(vm.plotData === null) {
                return;
            }

            vm.plotData.data.sort((a, b) => {
                let ac = a[0].substring(2, 5);
                let bc = b[0].substring(2, 5);
                return (ac > bc ? 1 : (ac == bc ? 0 : -1));
            });
            let contexts = vm.plotData.data.map((el) => el[0]);

            // compute the number of items in each category
            let categories = d3.entries(contexts.reduce((a, curr) => {
                let context = curr.substring(2, 5);
                if(a[context] === undefined) {
                    a[context] = 1;
                } else {
                    a[context]++;
                }
                return a;
            }, {}));
            
            // axes
            let x = d3.scaleBand()
                .domain(contexts)
                .range([0, vm.width]);

            let y = d3.scaleLinear()
                .domain([0, 0.2])
                .range([vm.height, 0]);

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

            vm.svg.append("g")
                .selectAll(".context-bar")
                .data(vm.plotData.data)
            .enter()
                .append("rect")
                .attr("class", "context-bar")
                .attr("width", x.bandwidth() - 2)
                .attr("height", (d) => (vm.height - y(Math.min(d[1], 0.2))))
                .attr("x", (d) => x(d[0]) + 1)
                .attr("y", (d) => y(Math.min(d[1], 0.2)))
                .attr("fill", (d) => MUTATION_COLORS[d[0].substring(2, 5)])
                .on('mouseover', (d) => {
                    vm.tooltip(d[0], d[1]);
                });
            
            // top colored bars for categories
            vm.svg.append("g")
                .selectAll(".category-bar")
                .data(categories)
            .enter()
                .append("rect")
                .attr("class", "category-bar")
                .attr("width", (d) => (x.bandwidth() * d.value) - 2 )
                .attr("height", 20)
                .attr("x", (d, i) => (i * x.bandwidth() * d.value) + 1)
                .attr("y", -25)
                .attr("fill", (d) => MUTATION_COLORS[d.key]);
            
            // top text for categories
            vm.svg.append("g")
                .selectAll(".category-text")
                .data(categories)
            .enter()
                .append("text")
                .attr("class", "category-text")
                .text(d => d.key)
                .attr("text-anchor", "middle")
                .attr("width", (d) => (x.bandwidth() * d.value) - 2 )
                .attr("height", 20)
                .attr("x", (d, i) => (i * x.bandwidth()*d.value) + (x.bandwidth()*d.value / 2) + 1)
                .attr("y", -28);
            
            // x Axis ticks
            vm.svg.append("g")
                .attr("transform", "translate(0," + vm.height + ")")
                .call(d3.axisBottom(x).tickSizeOuter(0))
                .selectAll("text")	
                    .style("text-anchor", "end")
                    .attr("x", "-.8em")
                    .attr("y", ".15em")
                    .attr("transform", "rotate(-65)");
            
            // text label for the x axis
            vm.svg.append("text")
                .attr("transform",
                        "translate(" + (vm.width/2) + " ," + (vm.height + vm.margin.top + 20) + ")")
                .style("text-anchor", "middle")
                .text("Mutation Category");

            // y Axis ticks
            vm.svg.append("g")
                .call(d3.axisLeft(y).tickSizeOuter(0));
            
            // text label for the y axis
            vm.svg.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 0 - vm.margin.left + 15)
                .attr("x", 0 - (vm.height / 2))
                .attr("dy", "1em")
                .style("text-anchor", "middle")
                .text("Probability");  
            
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
