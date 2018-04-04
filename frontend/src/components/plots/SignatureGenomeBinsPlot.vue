<template>
    <div>
        <svg id="plot"></svg>
    </div>
</template>

<script>
import API from './../../api.js'
import * as d3 from 'd3';

export default {
  name: 'SignatureGenomeBinsPlot',
  props: ['dataOptions'],
  data: function() { 
        return {
            plotData: null,
            margin: {top: 20, right: 20, bottom: 30, left: 40}
        };
  },
  computed: {
      width: function() {
          return 960 - this.margin.left - this.margin.right;
      },
      height: function() {
          return 500 - this.margin.top - this.margin.bottom;
      }
  },
  methods: {
      updatePlot: function() {
          var vm = this;
          API.fetchGenomeSignatureBins(this.dataOptions).then(function(data) {
              console.log(data[0]);
              vm.plotData = data;
              vm.drawPlot();
          });
      },
      drawPlot: function() {
          console.log("drawing");
          var vm = this;

          var x = d3.scaleLinear().range([0, this.width]);
          var y = d3.scaleLinear().range([this.height, 0]);

          var xMax = d3.max(Object.keys(this.plotData[0]).map(key => +key));
          var yMax = this.plotData.reduce(
              function(a, curr) { 
                  d3.max( [a, d3.max(
                      Object.keys(curr).map(key => +curr[key])
                    )] ) 
              }, 
              0
            );
          x.domain([0, xMax]);
          y.domain([0, yMax]);

          d3.select("#plot")
            .selectAll("g")
            .data(this.plotData)
            .enter().append("g")
                .selectAll(".bar")
                .data(function(d, i, j) { 
                    return Object.keys(d).map(key => [key, d[key]]);
                })
                .enter().append("rect")
                    .attr("class", "bar")
                    .attr("x", function(d) { return x(+d[0]); })
                    .attr("y", function(d) { return y(+d[1]); })
                    .attr("width", function(d) { return 20; })
                    .attr("height", function(d) { return vm.height - y(+d[1]); });
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

@import './../../variables.scss';

#plot {
    width: 100%;
    height: 25rem;
    border: 1px solid red;
}

</style>
