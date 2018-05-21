<template>
    <div>
        <select v-on:change="setChromosome($event.target.value)">
            <option disabled value="">Chromosome</option>
            <!--<option value="*" :selected="'*' == selectedName">*</option>-->
            <option v-for="chr in chromosomes" :key="chr" v-bind:value="chr" :selected="chr == selectedName">chr{{ chr }}</option>
        </select>
    </div>
</template>

<script>
import API from './../api.js'

export default {
  name: 'ChromosomeSelect',
  data: function() {
      return {
            init: false
      };
  },
  computed: {
      chromosomes() {
          return this.$store.getters.allChromosomes
      },
      selectedName() {
          return this.$store.getters.selectedChromosome.name
      }
  },
  mounted: function() {
    let vm = this;
    API.fetchChromosomes().then(function(chromosomeLengths) {
        vm.$store.commit('setChromosomeLengths', chromosomeLengths);
    });
  },
  methods: {
      setChromosome: function(event) {
          let chrLen = this.$store.getters.chromosomeLength(event);
          let chrOptions = {
              'name': event,
              'start': 0,
              'end': chrLen
          }
          this.$store.commit('setSelectedChromosome', chrOptions);
      }
  }
}
</script>

<style scoped lang="scss">


</style>
