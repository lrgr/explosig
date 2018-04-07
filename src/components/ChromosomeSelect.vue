<template>
    <div>
        <select v-model="selected">
            <option disabled value="">Chromosome</option>
            <option v-for="chr in Object.keys(chromosomes)" :key="chr" v-bind:value="chr">chr{{ chr }}</option>
        </select>
    </div>
</template>

<script>
import API from './../api.js'

export default {
  name: 'ChromosomeSelect',
  data: function() {
      return {
            chromosomes: {},
            selected: "",
            init: false
      };
  },
  mounted: function() {
    let vm = this;
    API.fetchChromosomes().then(function(chromosomes) {
        vm.chromosomes = chromosomes;
        vm.selected = "1";
    });
  },
  watch: {
      selected: function(val) {
        if(!this.init) {
            this.init = true;
        } else {
            this.$emit('chromosome-select', val);
        }
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
