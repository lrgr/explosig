<template>
    <div>
        <div id="plot"></div>
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
              vm.plotData = data;
              vm.drawPlot();
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

          d3.select("#plot")
            .append("svg")
                .attr("width", this.width)
                .attr("height", this.height)
            .selectAll("g")
            .data(this.plotData)
            .enter().append("g")
                .attr("transform", function(d) { return "translate(" + x(parseInt(d.name)) + ",0)"; })
                .selectAll(".bar")
                .data(function(d, i, j) { 
                    return Object.values(d.vals);
                })
                .enter().append("rect")
                    .attr("class", "bar")
                    .attr("x", 0)
                    .attr("y", function(d) { return y(+d); })
                    .attr("width", function(d) { return 20; })
                    .attr("height", function(d) { return vm.height - y(+d); })
                    .attr("opacity", 0.5)
                    .attr("fill", c20);
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
    border: 0px solid red;
}

</style>
