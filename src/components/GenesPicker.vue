<template>
  <div>
    <h3>Select genes</h3>
    <div class="option-group">
      <input type="text" />
    </div>
  </div>
</template>

<script>
import API from '../api.js';
import VSpinner from './VSpinner.vue';

export default {
  name: 'GenesPicker',
  components: {
    VSpinner,
  },
  data: function() {
    return {
        loading: true,
        selectedGenes: []
    };
  },
  watch: {
    selectedGenes(val) {
      this.$emit('choose', val);
    }
  },
  methods: {
    
  }
}
</script>

<style scoped lang="scss">
@import './../style/variables.scss';

</style>
