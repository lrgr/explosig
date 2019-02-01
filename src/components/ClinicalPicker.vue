<template>
  <div>
    <h3>Select clinical variables</h3>
    <button class="inline" v-on:click="toggleAll()">Toggle All</button>
    <div class="option-group">
      <table>
        <tr v-for="clinicalVariable in allClinicalVariables" :key="clinicalVariable">
            <td>
            <input type="checkbox" :value="clinicalVariable" :id="clinicalVariable" name="clinical" v-model="selectedClinicalVariables">
            <label :for="clinicalVariable" class="sample-label">{{ clinicalVariable }}</label>
            </td>
        </tr>
      </table>
      <VSpinner v-if="loading" class="spinner"/>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
import API from '../api.js';
import VSpinner from './VSpinner.vue';

export default {
  name: 'ClinicalPicker',
  components: {
    VSpinner,
  },
  data: function() {
    return {
        loading: true,
        allClinicalVariables: [],
        selectedClinicalVariables: []
    };
  },
  watch: {
    selectedClinicalVariables(val) {
      this.$emit('choose', val);
    }
  },
  mounted: function() {
        var vm = this;
        API.fetchClinicalVariableList().then(function(listing) {
            vm.allClinicalVariables = listing.map(el => el['Clinical Column']);
            const continuousVars = listing.filter(el => el['Scale Type'] === 'continuous').map(el => el['Clinical Column']);
            vm.setContinuousClinicalVariables(continuousVars);
            vm.selectedClinicalVariables = vm.allClinicalVariables.slice()
            vm.loading = false;
        });
  },
  methods: {
    toggleAll: function() {
        if(this.selectedClinicalVariables.length == this.allClinicalVariables.length) {
            this.selectedClinicalVariables = [];
        } else {
            this.selectedClinicalVariables = this.allClinicalVariables.slice();
        }
    },
    ...mapMutations([
      'setContinuousClinicalVariables'
    ])
  }
}
</script>

<style scoped lang="scss">
@import './../style/variables.scss';

</style>
