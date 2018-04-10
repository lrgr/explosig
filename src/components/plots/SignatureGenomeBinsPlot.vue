<template>
    <div>
        <div :id="this.plotID" class="plot-component"></div>
         <div class="spinner-wrapper">
            <Spinner v-if="loading" class="spinner"></Spinner>
        </div>
        <div class="bottom-options">
            <ChromosomeSelect v-on:chromosome-select="setChromosome($event)" ref="chrSelect"/>
        </div>
    </div>
</template>

<script>
import API from './../../api.js'
import Spinner from './../Spinner.vue'
import ChromosomeSelect from './../ChromosomeSelect.vue'
import * as d3 from 'd3';

export default {
    name: 'SignatureGenomeBinsPlot',
    props: ['dataOptions', 'plotIndex'],
    components: {
        Spinner,
        ChromosomeSelect
    },
    data: function () {
        return {
            loading: false,
            plotData: null,
            windowWidth: 0,
            width: 0,
            svg: null,
            margin: {
                top: 20,
                right: 30,
                bottom: 30,
                left: 40
            },
            options: {
                chromosome: ""
            }
        };
    },
    computed: {
        height: function () {
            return 400 - this.margin.top - this.margin.bottom;
        },
        plotID: function () {
            return 'plot_' + this.plotIndex;
        }
    },
    watch: {
        windowWidth: function (val) {
            this.width = val - 40 - this.margin.left - this.margin.right;
        },
        options: {
            handler: function () {
                this.updatePlot();
            },
            deep: true
        }
    },
    mounted: function () {
        let vm = this;
        vm.windowWidth = window.innerWidth;
        window.addEventListener('resize', function () {
            vm.windowWidth = window.innerWidth;
            if (vm.plotData != null) {
                vm.drawPlot();
            }
        });
    },
    methods: {
        setChromosome: function (chr) {
            this.options.chromosome = chr;
        },
        updatePlot: function () {
            var vm = this;
            vm.loading = true;
            vm.dataOptions['chromosome'] = vm.options.chromosome;
            API.fetchGenomeSignatureBins(vm.dataOptions).then(function (data) {
                vm.plotData = data;
                vm.drawPlot();
                vm.loading = false;
            });
        },
        drawPlot: function () {
            var vm = this;

            var x = d3.scaleLinear().range([0, this.width]);
            var y = d3.scaleLinear().range([this.height, 0]);
            var c20 = d3.scaleOrdinal(d3.schemeDark2);

            var xMax = d3.max(this.plotData.map(row => parseInt(row.name)));
            var yMax = d3.max(this.plotData.map(row => d3.max(Object.values(row.vals).map(val => parseInt(val)))));
            x.domain([0, xMax]);
            y.domain([0, yMax]);

            var barWidth = 0;
            if (this.plotData.length >= 1) {
                var numBars = this.plotData.length;
                barWidth = (vm.width) / numBars;
            }

            d3.select("#" + this.plotID).select("svg").remove();

            vm.svg = d3.select("#" + this.plotID)
                .append("svg")
                .attr("width", this.width + this.margin.left + this.margin.right)
                .attr("height", this.height + this.margin.top + this.margin.bottom)
                .append("g")
                .attr("transform",
                    "translate(" + vm.margin.left + "," + vm.margin.top + ")");

            vm.svg.selectAll(".bar-wrap")
                .data(this.plotData)
                .enter().append("g")
                .attr("transform", function (d, i) {
                    return "translate(" + i * barWidth + ",0)";
                })
                .selectAll(".bar-wrap")
                .data(function (d) {
                    return Object.values(d.vals);
                })
                .enter().append("rect")
                .attr("class", "bar")
                .attr("x", 0)
                .attr("y", function (d) {
                    return y(+d);
                })
                .attr("width", barWidth)
                .attr("height", function (d) {
                    return vm.height - y(+d);
                })
                .attr("opacity", 0.5)
                .attr("fill", function (d, i) {
                    return c20(i);
                });

            // x Axis
            vm.svg.append("g")
                .attr("transform", "translate(0," + vm.height + ")")
                .call(d3.axisBottom(x));

            // y Axis
            vm.svg.append("g")
                .call(d3.axisLeft(y));
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

@import './../../variables.scss';
@import './plot_style.scss';

</style>
