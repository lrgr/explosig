<template>
    <div>
        <div :id="this.plotElemID" class="plot-component"></div>
         <div class="spinner-wrapper" v-if="loading">
            <Spinner class="spinner"></Spinner>
        </div>
        <div class="bottom-options">
            <ChromosomeSelect ref="chrSelect" />
            <div class="option-control">
                <input type="checkbox" v-model="stackBars" :id="this.plotID + '_stack_bars'" />
                <label :for="this.plotID + '_stack_bars'">Stack Bars</label>
            </div>
        </div>
        
        <div class="plot-info" v-if="showInfo">
            <h3>Info</h3>
            <p>This plot displays bins of mutations assigned to the selected signatures for the selected datasets, across the genome.</p>
        </div>
    </div>
</template>

<script>
import * as d3 from 'd3';
import { mapGetters } from 'vuex';
import API from './../../api.js';
import { dispatch } from './plot-link.js';
 
// child components
import Spinner from './../Spinner.vue';
import ChromosomeSelect from './../ChromosomeSelect.vue';

export default {
    name: 'SignatureGenomeBinsPlot',
    props: ['plotID', 'showInfo', 'plotOptions'],
    components: {
        Spinner,
        ChromosomeSelect
    },
    data: function () {
        return {
            title: 'Manhattan Plot with Signatures',
            loading: false,
            plotData: null,
            svg: null,
            margin: {
                top: 20,
                right: 30,
                bottom: 50,
                left: 90
            },
            stackBars: false
        };
    },
    mounted: function() {
        this.$emit('titleInit', this.title);
    },
    computed: {
        height: function() {
            return 400 - this.margin.top - this.margin.bottom;
        },
        width: function() {
            return (this.windowWidth*0.8) - 40 - this.margin.left - this.margin.right;
        },
        plotElemID: function() {
            return 'plot_' + this.plotID;
        },
        ...mapGetters([
            'selectedChromosome',
            'selectedSignatures',
            'selectedDatasets',
            'windowWidth'
        ])
    },
    watch: {
        windowWidth: function (val) {
            this.drawPlot();
        },
        selectedChromosome: {
            handler: function () {
                this.drawPlot();
            },
            deep: true
        },
        stackBars: function(val) {
            this.drawPlot();
        }
    },
    methods: {
        tooltipDestroy: function() {
            dispatch.call("link-donor-destroy");
        },
        updatePlot: function () {
            var vm = this;
            vm.loading = true;
            var params = {
                "sources": vm.selectedDatasets,
                "signatures": vm.selectedSignatures,
                "chromosome": vm.selectedChromosome.name
            };
            API.fetchGenomeSignatureBins(params).then(function (data) {
                vm.plotData = data;

                vm.drawPlot();
                vm.loading = false;
            });
        },
        drawPlot: function () {
            var vm = this;

            if(vm.plotData == null) {
                return;
            }

            var x = d3.scaleLinear().range([0, this.width]);
            var y = d3.scaleLinear().range([this.height, 0]);
            var c20 = d3.scaleOrdinal(d3.schemeDark2);

            let chrLen = vm.$store.getters.chromosomeLength(vm.selectedChromosome.name);
            let yMax = d3.max(this.plotData.map(row => d3.max(Object.values(row.vals).map(val => parseInt(val)))));
           
            x.domain([vm.selectedChromosome.start, vm.selectedChromosome.end]);
            y.domain([0, yMax]);

            //console.log(vm.plotData[0].name);
            //console.log(vm.plotData[0].vals);

            if(vm.stackBars) {
                let stack = d3.stack()
                    .keys(vm.selectedSignatures.slice().reverse())
                    .value((d, key) => { return d["vals"][key]; })
                    .order(d3.stackOrderNone)
                    .offset(d3.stackOffsetNone);

                let series = stack(vm.plotData);
            }

            var barWidth = 0;
            if (this.plotData.length >= 1) {
                var numBars = this.plotData.length;
                barWidth = (vm.width) / numBars;
            }

            let windowSize = (vm.selectedChromosome.end - vm.selectedChromosome.start) / chrLen;

            d3.select("#" + this.plotElemID).select("svg").remove();

            vm.svg = d3.select("#" + this.plotElemID)
                .append("svg")
                .attr("width", this.width + this.margin.left + this.margin.right)
                .attr("height", this.height + this.margin.top + this.margin.bottom)
                .append("g")
                .attr("transform",
                    "translate(" + vm.margin.left + "," + vm.margin.top + ")")
                .on('mouseleave', vm.tooltipDestroy);
            
            // dispatch elements
            let genomeHighlight = vm.svg.append("g")
                .append("rect")
                .attr("x", 0)
                .attr("y", 0)
                .attr("width", 20)
                .attr("height", vm.height + vm.margin.top + vm.margin.bottom)
                .attr("transform", "translate(" + (-vm.margin.left - vm.margin.right) + "," + (-vm.margin.top) + ")")
                .attr("fill-opacity", 0)
                .attr("fill", "silver");

            vm.svg.selectAll(".bar-wrap")
                .data(this.plotData.filter((el) => {
                    return (+el.name >= vm.selectedChromosome.start && +el.name <= vm.selectedChromosome.end);
                }))
                .enter().append("g")
                .attr("transform", function (d) {
                    return "translate(" + x(+d.name) + ",0)";
                })
                .selectAll(".bar-wrap")
                .data(function(d) {
                    return Object.values(d.vals);
                })
                .enter().append("rect")
                .attr("class", "bar")
                .attr("x", 0)
                .attr("y", function (d) {
                    return y(+d);
                })
                .attr("width", barWidth * (1/windowSize))
                .attr("height", function (d) {
                    return vm.height - y(+d);
                })
                .attr("fill-opacity", 0.4)
                .attr("fill", function (d, i) {
                    return c20(i);
                });

            // x Axis
            vm.svg.append("g")
                .attr("transform", "translate(0," + vm.height + ")")
                .call(d3.axisBottom(x));
            
            // text label for the x axis
            vm.svg.append("text")             
                .attr("transform",
                        "translate(" + (vm.width/2) + " ," + (vm.height + vm.margin.top + 20) + ")")
                .style("text-anchor", "middle")
                .text("Chromosome Location");

            // y Axis
            vm.svg.append("g")
                .call(d3.axisLeft(y));
            
            // text label for the y axis
            vm.svg.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 0 - vm.margin.left + 5)
                .attr("x", 0 - (vm.height / 2))
                .attr("dy", "1em")
                .style("text-anchor", "middle")
                .text("Number of Mutations in Signature Bin");  
            
            // dispatch callbacks
            dispatch.on("link-genome." + this.plotElemID, function(location) {
                genomeHighlight
                    .attr("x", location)
                    .attr("fill-opacity", 1);
            });

            dispatch.on("link-genome-destroy." + this.plotElemID, function() {
                genomeHighlight.attr("fill-opacity", 0);
            });
        }
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

@import './../../variables.scss';
@import './plot-style.scss';

</style>
