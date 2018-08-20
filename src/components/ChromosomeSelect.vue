<template>
    <div class="chromosome-select">
        <label>Chromosome </label>
        <select v-on:change="setChromosome($event.target.value)">
            <option value="*" :selected="'*' == selectedName">*</option>
            <option v-for="chr in chromosomes" :key="chr" v-bind:value="chr" :selected="chr == selectedName">{{ chr }}</option>
        </select>
    </div>
</template>

<script>
import { CHROMOSOMES, CHROMOSOME_LENGTHS } from './../constants.js'

export default {
  name: 'ChromosomeSelect',
  data: function() {
      return {
            init: false
      };
  },
  computed: {
      chromosomes() {
          return CHROMOSOMES;
      },
      selectedName() {
          return this.$store.getters.selectedChromosome.name;
      }
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
      }
  }
}
</script>

<style scoped lang="scss">
.chromosome-select {
    display: inline-block;
    margin-right: 0.5rem;
}
</style>
