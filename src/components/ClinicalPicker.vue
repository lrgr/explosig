<template>
  <div>
    <h3>Select clinical variables</h3>
    <button class="inline" v-on:click="toggleAll()">Toggle All</button>
    <div class="option-group">
      <table>
        <tr v-for="clinicalVariable in allClinicalVariables" :key="clinicalVariable.id">
            <td>
            <input type="checkbox" :value="clinicalVariable.id" :id="clinicalVariable.id" name="clinical" v-model="selectedClinicalVariables">
            <label :for="clinicalVariable.id" class="sample-label">{{ clinicalVariable.name }}</label>
            </td>
        </tr>
      </table>
      <VSpinner v-if="loading" class="spinner"/>
    </div>
  </div>
</template>

<script>
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
        API.fetchDataListing().then(function(listing) {
            vm.allClinicalVariables = listing["clinical_variables"];
            
            vm.loading = false;
        });
  },
  methods: {
    toggleAll: function() {
        if(this.selectedClinicalVariables.length == this.allClinicalVariables.length) {
            this.selectedClinicalVariables = [];
        } else {
            this.selectedClinicalVariables = this.allClinicalVariables.map((el) => el.id);
        }
    },
  }
}
</script>

<style scoped lang="scss">
@import './../style/variables.scss';

</style>
