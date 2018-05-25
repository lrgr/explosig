<template>
    <div>
        <div :id="this.plotElemID" class="plot-component"></div>

        <div :id="this.plotElemID + '_tooltip'" class="tooltip" :style="this.tooltipPosition">
            <table>
                <tr>
                    <th>Chromosome</th><td>{{ this.tooltipInfo.chromosome }}</td>
                </tr>
                <tr>
                    <th>Position</th><td>{{ this.tooltipInfo.position }}</td>
                </tr>
                <tr>
                    <th>Distance to Previous</th><td>{{ this.tooltipInfo.mutDist }}</td>
                </tr>
                <tr>
                    <th>Mutation Category</th><td>{{ this.tooltipInfo.category }}</td>
                </tr>
            </table>
        </div>

        <div class="spinner-wrapper" v-if="loading">
            <Spinner class="spinner"></Spinner>
        </div>
        <div class="bottom-options">
            <ChromosomeSelect class="option-control" />
            <div class="option-control">
                <input type="checkbox" v-model="logScale" :id="this.plotID + '_log_scale'" />
                <label :for="this.plotID + '_log_scale'">Log Scale</label>
            </div>
            <div class="option-control">
                <input type="checkbox" v-model="highlightKataegis" :id="this.plotID + '_highlight_kataegis'" />
                <label :for="this.plotID + '_highlight_kataegis'">Highlight Kataegis Events</label>
            </div>
            <div class="option-control">
                <label>Color by&nbsp;</label>
                <select>
                    <option>Mutation Category</option>
                    <!--<option>Assigned Signature</option>-->
                </select>
            </div>
        </div>

        <div class="plot-info" v-if="showInfo">
            <h3>Info</h3>
            <p>This plot displays mutations by their genome location and the distance to the previous mutation. Points are colored by mutation context (e.g. A[T>G]C)</p>
            <p>To zoom in along chromosome location, click and drag mouse below the axis. To zoom out, double click.</p>
        </div>
    </div>
</template>

<script>
import * as d3 from 'd3';
import { mapGetters } from 'vuex';
import API from './../../api.js';
import { LegendListBus } from './../../buses.js';
import { MUTATION_CATEGORIES, CHROMOSOMES } from './../../constants.js';
import { dispatch } from './plot-link.js';

// child components
import Spinner from './../Spinner.vue';
import ChromosomeSelect from './../ChromosomeSelect.vue';

export default {
    name: 'RainfallPlot',
    props: ['plotID', 'showInfo', 'plotOptions'],
    components: {
        Spinner,
        ChromosomeSelect
    },
    data: function () {
        return {
            title: 'Rainfall',
            loading: false,
            plotData: null,
            svg: null,
            margin: {
                top: 20,
                right: 30,
                bottom: 50,
                left: 90
            },
            tooltipInfo: {
                category: '',
                position: '',
                mutDist: '',
                chromosome: '',
                left: null,
                top: null
            },
            highlightKataegis: true,
            logScale: true
        };
    },
    mounted: function() {
        this.$emit('titleInit', this.title + " (" + this.plotOptions.proj_id + ", " + this.plotOptions.donor_id + ")");
    },
    computed: {
        height: function () {
            return 400 - this.margin.top - this.margin.bottom;
        },
        width: function() {
            return (this.windowWidth*0.8) - 40 - this.margin.left - this.margin.right;
        },
        plotElemID: function () {
            return 'plot_' + this.plotID;
        },
        tooltipPosition: function() {
            if(this.tooltipInfo.left == null || this.tooltipInfo.top == null) {
                return 'display: none;';
            } else {
                return 'left: ' + this.tooltipInfo.left + 'px; top: ' + this.tooltipInfo.top + 'px;';
            }
        },
        ...mapGetters([
            'selectedChromosome',
            'windowWidth',
            'showAllChromosomes'
        ])
    },
    watch: {
        windowWidth: function (val) {
            this.drawPlot();
        },
        highlightKataegis: function() {
            this.drawPlot();
        },
        logScale: function() {
            this.drawPlot();
        },
        selectedChromosome: {
            handler: function() {
                this.drawPlot();
            },
            deep: true
        }
    },
    methods: {
        getPlotSelector: function () {
            return "#" + this.plotElemID;
        },
        tooltip: function(category, position, mutDist, chromosome) {
            this.tooltipInfo.category = category;
            this.tooltipInfo.position = position;
            this.tooltipInfo.mutDist = mutDist;
            this.tooltipInfo.chromosome = chromosome;
            
            this.tooltipInfo.left = d3.event.x;
            this.tooltipInfo.top = this.height + this.margin.top;

        },
        tooltipDestroy: function() {
            this.tooltipInfo.top = null;
            this.tooltipInfo.left = null;

            dispatch.call("link-genome-destroy");
        },
        updatePlot: function () {
            let vm = this;
            vm.loading = true;

            let rainfallOptions = {
                'proj_id': vm.plotOptions.proj_id,
                'donor_id': vm.plotOptions.donor_id,
                'chromosome': vm.selectedChromosome.name
            }

            API.fetchRainfall(rainfallOptions).then(function (data) {
                vm.plotData = data;
                vm.drawPlot();
                vm.loading = false;
            });

        },
        drawPlot: function () {
            let vm = this;

            if(vm.plotData == null) {
                return;
            }

            let maxDist = d3.max( vm.plotData.map((el) => +el.mut_dist) );
            let filteredData = vm.plotData.filter((el) => (vm.showAllChromosomes ? true : (vm.selectedChromosome.name == el.chr)));
            let kataegisPoints = filteredData.filter((el) => (+el.kataegis == 1));

            // scales
            var y = d3.scaleLinear();
            if(vm.logScale) {
                y = d3.scaleLog();
            }
            y.range([vm.height, 0]);
            y.domain([1, maxDist]);
            
            // svg
            let plotSelector = vm.getPlotSelector();
            d3.select(plotSelector).select("svg").remove();

            vm.svg = d3.select(plotSelector)
                .append("svg")
                .attr("width", vm.width + vm.margin.left + vm.margin.right)
                .attr("height", vm.height + vm.margin.top + vm.margin.bottom)
                .append("g")
                .attr("transform",
                    "translate(" + vm.margin.left + "," + vm.margin.top + ")")
                .on('mousemove', function() { dispatch.call("link-genome", null, d3.event.x); })
                .on("mouseleave", () => {
                    vm.tooltipDestroy();
                });
            
            // dispatch elements
            let donorHighlight = vm.svg.append("g")
                .append("rect")
                .attr("x", -vm.margin.left)
                .attr("y", -vm.margin.top)
                .attr("width", (vm.width + vm.margin.left + 10))
                .attr("height", (vm.height + vm.margin.top + vm.margin.bottom))
                .attr("fill-opacity", 0)
                .attr("fill", "silver");
            
            let genomeHighlight = vm.svg.append("g")
                .append("rect")
                .attr("x", 0)
                .attr("y", 0)
                .attr("width", 1)
                .attr("height", vm.height + vm.margin.top + vm.margin.bottom)
                .attr("transform", "translate(" + (-vm.margin.left - vm.margin.right) + "," + (-vm.margin.top) + ")")
                .attr("fill-opacity", 0)
                .attr("fill", "silver");
            
            var chr_x = {};
            var chrLen, chrName;
            
            if(vm.showAllChromosomes) {
                let genomeLength = CHROMOSOMES.map((name) => vm.$store.getters.chromosomeLength(name)).reduce((a, h) => a + h);
                var cumulativeLength = 0;
                for(var chr_i = 0; chr_i < CHROMOSOMES.length; chr_i++) {
                    chrName = CHROMOSOMES[chr_i];
                    chrLen = vm.$store.getters.chromosomeLength(chrName);
                    chr_x[chrName] = d3.scaleLinear()
                        .domain([0, chrLen])
                        .range([vm.width*(cumulativeLength / genomeLength), vm.width*((cumulativeLength + chrLen) / genomeLength)]);

                    cumulativeLength += chrLen;
                }
            } else {
                // SINGLE CHROMOSOME
                chrName = vm.selectedChromosome.name;
                chrLen = vm.$store.getters.chromosomeLength(chrName);
                chr_x[chrName] = d3.scaleLinear()
                    .domain([vm.selectedChromosome.start, vm.selectedChromosome.end])
                    .range([0, vm.width]);
            }

            // kataegis highlights
            let kataegisBars = vm.svg.selectAll('.kataegis-bar')
                .data(kataegisPoints)
            .enter().append('rect')
                .attr('class', 'kataegis-bar')
                .attr('x', function(d){ return chr_x[d.chr](+d.pos); })
                .attr('y', 0)
                .attr('width', 3)
                .attr('height', vm.height)
                .attr('fill-opacity', (vm.highlightKataegis ? 1 : 0))
                .attr('fill', "#FFC4C4");
            
            
            
            // point for each mutation, colored by mutation context
            let points = vm.svg.selectAll('.point')
			    .data(filteredData)
		    .enter().append('circle')
                .attr('class', 'point')
                .attr('cx', function(d){return chr_x[d.chr](+d.pos);})
                .attr('cy', function(d){ return y(+d.mut_dist); })
                .attr('r', 3)
                .style('fill', function(d){
                    // map hashed value to value between 0 and 1
                    return d3.interpolateRainbow(+d.cat_index / 96); 
                })
                .on("mouseover", function(d) {
                    vm.tooltip(d.cat, d.pos, d.mut_dist, d.chr);
                });
            
            
            var legendInfo = {
                "meta": {
                    "title": "Mutation Categories"
                },
                "data": []
            };

            let catNames = Object.keys(MUTATION_CATEGORIES);
            for(var i = 0; i < catNames.length; i++) {
                legendInfo["data"].push({ "name":catNames[i], "color": d3.interpolateRainbow(MUTATION_CATEGORIES[catNames[i]] / 96) });
            }
            LegendListBus.$emit("contexts", legendInfo); 
            
            // x Axis
            var xAxis;
            if(vm.showAllChromosomes) {
                for(var chr_i = 0; chr_i < CHROMOSOMES.length; chr_i++) {
                    chrName = CHROMOSOMES[chr_i];
                    xAxis = vm.svg.append("g")
                        .attr("transform", "translate(0," + vm.height + ")")
                        .call(d3.axisBottom(chr_x[chrName]).tickValues([0]).tickFormat(() => chrName));
                }
            } else {
                // SINGLE CHROMOSOME
                chrName = vm.selectedChromosome.name;
                xAxis = vm.svg.append("g")
                        .attr("transform", "translate(0," + vm.height + ")")
                        .call(d3.axisBottom(chr_x[chrName]));
                
                // brushing
                function brushend() {
                    var s = d3.event.selection;
                    var chrOptions;
                    if(s) {
                        var s2 = s.map((el) => Math.floor(chr_x[chrName].invert(el)));
                        chrOptions = {
                            start: s2[0],
                            end: s2[1],
                            name: vm.selectedChromosome.name
                        }
                        vm.$store.commit('setSelectedChromosome', chrOptions)
                    } else {
                        chrOptions = {
                            start: 0,
                            end: vm.$store.getters.chromosomeLength(vm.selectedChromosome.name),
                            name: vm.selectedChromosome.name
                        }
                        vm.$store.commit('setSelectedChromosome', chrOptions)
                    }
                    vm.drawPlot();
                }

                xAxis.append("g")
                    .attr("class", "brush")
                    .call(
                        d3.brushX()
                            .on("end." + vm.plotElemID, brushend)
                    );
            }
            
            // text label for the x axis
            vm.svg.append("text")             
                .attr("transform",
                        "translate(" + (vm.width/2) + " ," + (vm.height + vm.margin.top + 20) + ")")
                .style("text-anchor", "middle")
                .text("Chromosome" + (vm.showAllChromosomes ? "" : (" " + vm.selectedChromosome.name + " Location")));

            // y Axis
            vm.svg.append("g")
                .call(d3.axisLeft(y).tickSizeOuter(0));
            
            // text label for the y axis
            vm.svg.append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", 0 - vm.margin.left + 5)
                .attr("x", 0 - (vm.height / 2))
                .attr("dy", "1em")
                .style("text-anchor", "middle")
                .text("Distance to Previous Mutation");  
            
            // dispatch callbacks
            dispatch.on("link-donor." + this.plotElemID, function(donorID) {
                if(donorID == vm.plotOptions.donor_id) {
                    donorHighlight.attr("fill-opacity", 0.5);
                } else {
                    donorHighlight.attr("fill-opacity", 0);
                }
            });

            dispatch.on("link-donor-destroy." + this.plotElemID, function() {
                donorHighlight.attr("fill-opacity", 0);
            });

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

.plot-component {
    overflow-x: hidden;
    overflow-y: hidden;
}

</style>
