<template>
    <div>
        <select v-model="selected.value">
            <option disabled value="">Chromosome</option>
            <option v-for="chr in Object.keys(chromosomes)" :key="chr" v-bind:value="chr">chr{{ chr }}</option>
        </select>
    </div>
</template>

<script>
import API from './../api.js'
import { globalChromosomeSelected } from './../buses/data-options-bus.js';

export default {
  name: 'ChromosomeSelect',
  data: function() {
      return {
            chromosomes: {},
            selected: globalChromosomeSelected,
            init: false
      };
  },
  mounted: function() {
    let vm = this;
    API.fetchChromosomes().then(function(chromosomes) {
        vm.chromosomes = chromosomes;
        vm.selected.value = "1";
    });
  },
  watch: {
      selected: {
        handler: function(selected) {
            if(!this.init) {
                this.init = true;
            } else {
                this.$emit('chromosome-select', selected.value);
            }
        },
        deep: true
      }
  },
  methods: {
      getChromosome: function(name) {
          return this.chromosomes[name];
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">


</style>
