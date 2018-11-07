<template>
  <div>
    <h3>Select samples</h3>
    <button class="inline" v-on:click="toggleSources()">Toggle All</button>
    <div class="option-group">
      <table>
        <tr v-for="projData in allProjects" :key="projData.id">
            <td>
            <input type="checkbox" :value="projData.id" :id="projData.id" name="projects" v-model="selectedProjects">
            <label :for="projData.id" class="sample-label">{{ projData.id }}</label>
            </td>
            <td class="cell-gray">{{ projData.name }}</td>
            <td class="cell-gray">({{ projData.num_donors }} donors)</td>
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
  name: 'SamplesPicker',
  components: {
    VSpinner,
  },
  data: function() {
    return {
        loading: true,
        allProjects: [],
        selectedProjects: []
    };
  },
  watch: {
    selectedProjects(val) {
      this.$emit('choose', val);
    }
  },
  mounted: function() {
        var vm = this;
        API.fetchDataListing().then(function(listing) {
            vm.allProjects = listing.projects;
            
            vm.loading = false;
        });
  },
  methods: {
    toggleSources: function() {
        if(this.selectedProjects.length == this.allProjects.length) {
            this.selectedProjects = [];
        } else {
            this.selectedProjects = this.allProjects.map((proj) => proj.id);
        }
    },
  }
}
</script>

<style scoped lang="scss">
@import './../style/variables.scss';

</style>
