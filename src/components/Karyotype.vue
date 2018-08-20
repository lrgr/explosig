<template>
    <div>
        <div :id="this.plotID" class="karyotype-component"></div>
    </div>
</template>

<script>
import * as d3 from 'd3';
import API from './../api.js';
import { CHROMOSOME_LENGTHS, KARYOTYPE_COLORS } from '../constants';

export default {
  name: 'Karyotype',
  props: ['plotIndex'],
  data: function() {
      return {
            init: false,
            plotData: null,
            width: 0,
            svg: null,
            margin: {
                top: 10,
                right: 30,
                bottom: 10,
                left: 90
            }
      };
  },
  computed: {
      height: function () {
            return 60 - this.margin.top - this.margin.bottom;
      },
      chromosomes() {
        return this.$store.getters.allChromosomes
      },
      selectedName() {
        return this.$store.getters.selectedChromosome.name
      },
      plotID: function () {
        return 'karyotype_' + this.plotIndex;
      }
  },
  mounted: function() {
    let vm = this;
    API.fetchKaryotype().then(function(plotData) {
        vm.plotData = plotData;
        vm.drawPlot();
    });
  },
  methods: {
      setChromosome: function(event) {
          var chrLen = 0;
          if(event != '*') {
              chrLen = CHROMOSOME_LENGTHS[event];
          }
          var chrOptions = {
              'name': event,
              'start': 0,
              'end': chrLen
          }
          this.$store.commit('setSelectedChromosome', chrOptions);
      },
      drawPlot: function() {
          var vm = this;

            if(vm.plotData == null) {
                return;
            }

            var chrNames = vm.$store.getters.allChromosomes();

            
            var x = d3.scaleLinear().range([0, vm.width]);

            x.domain([vm.selectedChromosome.start, vm.selectedChromosome.end]);

            

            var colorScale = d3.scaleOrdinal(d3.schemePastel1);

            var plotElemID = vm.getPlotElem();
            d3.select(plotElemID).select("svg").remove();

            vm.svg = d3.select(plotElemID)
                .append("svg")
                .attr("width", vm.width + vm.margin.left + vm.margin.right)
                .attr("height", plotHeight + vm.margin.top + vm.margin.bottom)
                .append("g")
                .attr("transform",
                    "translate(" + vm.margin.left + "," + vm.margin.top + ")");
      }
  }
}
</script>

<style scoped lang="scss">

</style>