<template>
    <div>
        <div id="plot"></div>
         <div class="spinner-wrapper">
            <Spinner v-if="loading" class="spinner"></Spinner>
        </div>
    </div>
</template>

<script>
import API from './../../api.js'
import Spinner from './../Spinner.vue'
import * as d3 from 'd3';

export default {
  name: 'SignatureGenomeBinsPlot',
  props: ['dataOptions'],
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
            margin: { top: 20, right: 20, bottom: 30, left: 40 }
        };
  },
  computed: {
      height: function() {
          return 400 - this.margin.top - this.margin.bottom;
      }
  },
  watch: {
      windowWidth: function(val) {
          this.width = val - 40 - this.margin.left - this.margin.right;
      }
  },
  mounted: function() {
    let vm = this;
    vm.windowWidth = window.innerWidth;
    window.addEventListener('resize', function(e) {
        vm.windowWidth = window.innerWidth;
        if(vm.plotData != null) {
            vm.drawPlot();
        }
    });
  },
  methods: {
      updatePlot: function() {
          var vm = this;
          vm.loading = true;
          API.fetchGenomeSignatureBins(this.dataOptions).then(function(data) {
              vm.plotData = data;
              vm.drawPlot();
              vm.loading = false;
          });
      },
      drawPlot: function() {
          console.log("drawing");
          var vm = this;
          
          var x = d3.scaleLinear().range([0, this.width]);
          var y = d3.scaleLinear().range([this.height, 0]);
          var c20 = d3.scaleOrdinal(d3.schemeDark2);

          var xMax = d3.max(this.plotData.map(row => parseInt(row.name)));
          var yMax = d3.max(this.plotData.map(row => d3.max(Object.values(row.vals).map(val => parseInt(val)))));
          x.domain([0, xMax]);
          y.domain([0, yMax]);

          var barWidth = 0;
          if(this.plotData.length >= 1) {
            var numBars = this.plotData.length;
            barWidth = (vm.width) / numBars;
          }

          d3.select("#plot").select("svg").remove();

          vm.svg = d3.select("#plot")
            .append("svg")
                .attr("width", this.width + this.margin.left + this.margin.right)
                .attr("height", this.height + this.margin.top + this.margin.bottom)
            .append("g")
            .attr("transform", 
                "translate(" + vm.margin.left + "," + vm.margin.top + ")");
            
          vm.svg.selectAll(".bar-wrap")
            .data(this.plotData)
            .enter().append("g")
                .attr("transform", function(d, i) { return "translate(" + i*barWidth + ",0)"; })
                .selectAll(".bar-wrap")
                .data(function(d, i, j) { 
                    return Object.values(d.vals);
                })
                .enter().append("rect")
                    .attr("class", "bar")
                    .attr("x", 0)
                    .attr("y", function(d) { return y(+d); })
                    .attr("width", barWidth)
                    .attr("height", function(d) { return vm.height - y(+d); })
                    .attr("opacity", 0.5)
                    .attr("fill", c20);
            
            
          d3.select("#plot").select("svg")
            .append("g")
            .attr("transform", "translate(" + vm.margin.left + "," + (vm.height + vm.margin.top) + ")")
            .call(d3.axisBottom(x));
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

@import './../../variables.scss';

#plot {
    width: 100%;
    height: 400px;
    border: 0px solid red;
    svg {
        border: 1px solid blue;
    }
}

.spinner-wrapper {
    width: 100%;
    margin: 40px 0px;
    position: absolute;
    top: 0;
    .spinner {
        margin: 0 auto;
    }
}

</style>
