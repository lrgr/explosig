<template>
    <div>
        <select v-on:change="setChromosome($event.target.value)">
            <option disabled value="">Chromosome</option>
            <option v-for="chr in Object.keys(chromosomes)" :key="chr" v-bind:value="chr" :selected="chr == selected.value">chr{{ chr }}</option>
        </select>
    </div>
</template>

<script>
import API from './../api.js'
import { globalChromosomeSelected, globalChromosomeLocation } from './../buses/data-options-bus.js';

export default {
  name: 'ChromosomeSelect',
  data: function() {
      return {
            chromosomes: {},
            init: false,
            selected: globalChromosomeSelected,
            location: globalChromosomeLocation
      };
  },
  mounted: function() {
    let vm = this;
    API.fetchChromosomes().then(function(chromosomes) {
        vm.chromosomes = chromosomes;
    });
  },
  methods: {
      getChromosomeLength: function(name) {
          return this.chromosomes[name];
      },
      setChromosome: function(event) {
            this.selected.value = event;
            this.location.start = 0;
            this.location.end = this.getChromosomeLength(event);
         
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">


</style>
