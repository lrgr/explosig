<template>
    <div>
        <div :id="this.plotID" class="plot-component"></div>
         <div class="spinner-wrapper">
            <Spinner v-if="loading" class="spinner"></Spinner>
        </div>
        <div class="bottom-options">
            <select v-model="options.chromosome">
                <option disabled value="">Chromosome</option>
                <option v-for="chr in Object.keys(chromosomes)" :key="chr" v-bind:value="chr">chr{{ chr }}</option>
            </select>
        </div>
    </div>
</template>

<script>
import API from './../../api.js'
import Spinner from './../Spinner.vue'
import * as d3 from 'd3';

export default {
  name: 'KataegisPlot',
  props: ['dataOptions', 'plotIndex'],
  components: {
      Spinner
  },
  data: function() { 
        return {
            loading:false,
            plotData: null,
            windowWidth: 0,
            width: 0,
            svg: null,
            margin: { top: 20, right: 20, bottom: 30, left: 40 },
            chromosomes: {},
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
    API.fetchChromosomes().then(function(chromosomes) {
        vm.chromosomes = chromosomes;
    });
  },
  methods: {
      updatePlot: function() {
          var vm = this;
          vm.loading = true;
          if(vm.options.chromosome == "") {
              vm.options.chromosome = "1";
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

          var numSamples = Object.keys(vm.plotData).length;
          var x = d3.scaleLinear().range([0, this.width]);
          var y = d3.scaleBand().range([this.height, 0]).padding(0.1);
        
          x.domain([0, vm.chromosomes[vm.options.chromosome]]);
          y.domain([0, numSamples]);

          var barHeight = vm.height / numSamples;

          d3.select("#" + this.plotID).select("svg").remove();

          vm.svg = d3.select("#" + this.plotID)
            .append("svg")
                .attr("width", this.width + this.margin.left + this.margin.right)
                .attr("height", this.height + this.margin.top + this.margin.bottom)
            .append("g")
            .attr("transform", 
                "translate(" + vm.margin.left + "," + vm.margin.top + ")");

          vm.svg.selectAll(".sample-bar")
            .data(Object.keys(vm.plotData))
            .enter().append("g")
                .attr("transform", function(d, i) { return "translate(0," + i*barHeight + ")"; })
                .selectAll(".sample-bar")
                .data(function(d) { 
                    return vm.plotData[d];
                })
                .enter().append("rect")
                    .attr("class", "kataegis-region")
                    .attr("x", function(d) { return x(+d); })
                    .attr("y", 0)
                    .attr("width", 3)
                    .attr("height", barHeight)
                    .attr("opacity", 0.5)
                    .attr("fill", "blue");
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

@import './../../variables.scss';
@import './plot_style.scss';

</style>
