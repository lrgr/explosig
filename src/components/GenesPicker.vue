<template>
  <div>
    <h3>Select genes</h3>
    <div class="option-group">
      <GeneAutocomplete :submitGene="submitGene" :selectedSamples="selectedSamplesCopy" />
      <h4>Current selections:</h4>
      <span v-if="selectedGenes.length === 0">None</span>
      <div class="gene-selections">
        <span v-for="selectedGene in selectedGenes" :key="selectedGene">
          {{ selectedGene }}
          <button @click="removeGene(selectedGene)">Remove</button>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import API from '../api.js';
import VSpinner from './VSpinner.vue';

import GeneAutocomplete from './GeneAutocomplete.vue';

export default {
  name: 'GenesPicker',
  props: ['selectedSamples'],
  components: {
    VSpinner,
    GeneAutocomplete
  },
  data: function() {
    return {
        loading: true,
        selectedGenes: [],
        selectedSamplesCopy: []
    };
  },
  watch: {
    selectedGenes(val) {
      this.$emit('choose', val);
    },
    selectedSamples(val) {
      this.selectedSamplesCopy = val;
    }
  },
  methods: {
    submitGene(gene_id) {
      if(!this.selectedGenes.includes(gene_id)) {
        this.selectedGenes.push(gene_id);
      }
    },
    removeGene(gene_id) {
      this.selectedGenes.splice(this.selectedGenes.indexOf(gene_id), 1);
    }
  }
}
</script>

<style scoped lang="scss">
@import './../style/variables.scss';

.gene-selections {
  span {
    display: block;
  }
}
</style>
