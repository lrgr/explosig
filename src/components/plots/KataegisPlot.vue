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
  name: 'KataegisPlot',
  props: ['dataOptions', 'plotIndex'],
  components: {
      Spinner,
      ChromosomeSelect
  },
  data: function() { 
        return {
            loading:false,
            plotData: null,
            windowWidth: 0,
            width: 0,
            svg: null,
            margin: { top: 20, right: 30, bottom: 30, left: 60 },
            options: {
                chromosome: ""
            }
        };
  },
  computed: {
      height: function() {
          return 400 - this.margin.top - this.margin.bottom;
      },
      plotID: function() {
          return 'plot_' + this.plotIndex;
      }
  },
  watch: {
      windowWidth: function(val) {
          this.width = val - 40 - this.margin.left - this.margin.right;
      },
      options: {
        handler: function() {
          this.updatePlot();
        },
        deep: true
      }
  },
  mounted: function() {
    let vm = this;
    vm.windowWidth = window.innerWidth;
    window.addEventListener('resize', function() {
        vm.windowWidth = window.innerWidth;
        if(vm.plotData != null) {
            vm.drawPlot();
        }
    });
  },
  methods: {
      getPlotElem: function() {
          return "#" + this.plotID;
      },
      setChromosome: function(chr) {
          this.options.chromosome = chr;
      },
      getChromosome: function(name) {
          return this.$refs.chrSelect.getChromosome(name);
      },
      updatePlot: function() {
          var vm = this;
          vm.loading = true;
          if(vm.options.chromosome == "") {
              vm.options.chromosome = "1"
          }
          vm.dataOptions['chromosome'] = vm.options.chromosome;
          
          API.fetchKataegis(this.dataOptions).then(function(data) {
            vm.plotData = data;
            vm.drawPlot();
            vm.loading = false;
          });
       
      },
      drawPlot: function() {
          var vm = this;
          var data = {};
          
          for(var i = 0; i < vm.plotData.length; i++) {
              var donor_id = vm.plotData[i]["Donor ID"];
              var pos = vm.plotData[i]["Chromosome Start"];
              if(data[donor_id] == null) {
                  data[donor_id] = [pos];
              } else {
                  data[donor_id].push(pos);
              }
          }
          vm.plotData = data;
          
          var sampleNames = Object.keys(vm.plotData);
          var numSamples = sampleNames.length;
          var x = d3.scaleLinear().range([0, this.width]);
          var y = d3.scaleOrdinal().domain(sampleNames).range(Array.from({length: numSamples}, (v, i) => (i+0.5)*(vm.height/numSamples)))
        
          x.domain([0, vm.getChromosome(vm.options.chromosome)]);
          y.domain([0, numSamples]);

          var barHeight = vm.height / numSamples;
          var yMargin = 2;

          var plotElemID = this.getPlotElem();

          d3.select(plotElemID).select("svg").remove();

          vm.svg = d3.select(plotElemID)
            .append("svg")
                .attr("width", this.width + this.margin.left + this.margin.right)
                .attr("height", this.height + this.margin.top + this.margin.bottom)
            .append("g")
            .attr("transform", 
                "translate(" + vm.margin.left + "," + vm.margin.top + ")");

          var sampleBars = vm.svg.selectAll(".sample-bar")
            .data(sampleNames)
            .enter().append("g")
                .attr("transform", function(d, i) { return "translate(0," + (i*barHeight) + ")"; });
            sampleBars.append("rect")
                    .attr("x", 0)
                    .attr("y", 0)
                    .attr("width", this.width)
                    .attr("height", barHeight - yMargin)
                    .attr("fill", "gainsboro")
                    .on('mouseover', vm.sampleTooltip);
             sampleBars.selectAll(".sample-bar")
                .data(function(d) { 
                    return vm.plotData[d];
                })
                .enter().append("rect")
                    .attr("class", "kataegis-region")
                    .attr("x", function(d) { return x(+d); })
                    .attr("y", 0)
                    .attr("width", 3)
                    .attr("height", barHeight - yMargin)
                    .attr("opacity", 0.5)
                    .attr("fill", "blue");
            
             // x Axis
          vm.svg.append("g")
            .attr("transform", "translate(0," + vm.height + ")")
            .call(d3.axisBottom(x));

           // y Axis
          vm.svg.append("g")
            .call(d3.axisLeft(y).tickValues(sampleNames));
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

@import './../../variables.scss';
@import './plot_style.scss';

</style>
