<template>
  <div>
    <h3 class="samples-title">Select samples</h3>
    <button class="deselect-button inline" v-show="selectedProjects.length > 0" @click="deselectAll">Deselect All</button>

    <div class="filters">
      <div class="samples-filter-by-source">
        Filter samples by source: 
        <select v-model="filterBySource">
          <option value="*" :selected="filterBySource === '*'">*</option>
          <option v-for="source of allSources" :key="source" :value="source" :selected="source === filterBySource ? 'selected' : ''">
            {{ source }}
          </option>
        </select>
      </div>

      <div class="tricounts-option-wrapper">
        <input type="checkbox" :value="true" id="tricounts-checkbox" v-model="tricountsValue">
        <label for="tricounts-checkbox" title="Normalize trinucleotides by frequency (based on sequencing strategy of each selected cohort)">Trinucleotide normalization</label>
      </div>
    </div>

    <div class="col-container">
      <div class="col-tissue-types" :style="{'height': (windowHeight*0.8 - 164) + 'px' }">
        <div v-for="tType in filteredProjectsByTissueType" :key="tType.oncotree_code" @click="scrollToTissueType(tType.oncotree_code)">
          <span>{{ tType.oncotree_name }}</span>
          <span class="num-projects-badge">
            {{ tType.projects.length }}
            <span class="projects-selected-badge" v-show="hasSelectedProjectsForTissueType(tType.oncotree_code)"></span>
          </span>
        </div>
      </div>

      <div class="col-projects" id="col-projects" :style="{'height': (windowHeight*0.8 - 164) + 'px' }">
        <div v-for="tType in filteredProjectsByTissueType" :key="tType.oncotree_code">
          <h4>{{ tType.oncotree_name }}</h4> <button @click="selectAllByTissueType(tType.oncotree_code)">Select All {{ tType.oncotree_name }}</button>
          <div v-for="tTypeProject in tType.projects" :key="tTypeProject.id">
            <input type="checkbox" :value="tTypeProject.id" :id="tTypeProject.id" name="projects" v-model="selectedProjects">
            <label :for="tTypeProject.id" class="project-label">
              {{ tTypeProject.name }} ({{ tTypeProject.id }}) <span class="num-samples">{{ tTypeProject.num_samples }} samples</span>
            </label>
          </div>
        </div>
        <VSpinner v-if="loading" class="spinner"/>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import API from '../api.js';
import VSpinner from './VSpinner.vue';

export default {
  name: 'SamplesPicker',
  props: ['selectedSigGroup'],
  components: {
    VSpinner,
  },
  data: function() {
    return {
        loading: true,
        allProjects: [],
        selectedProjects: [],
        tissueTypes: [],
        tricountsValue: false,
        // for filtering:
        allSources: [],
        filterBySource: "TCGA"
    };
  },
  computed: {
    filteredProjects() {
      if(this.filterBySource === "*") {
        return this.allProjects;
      } else {
        return this.allProjects.filter(el => el["source"] === this.filterBySource);
      }
    },
    filteredProjectsByTissueType() {
      let result = [];
      for(let tType of this.tissueTypes) {
        let tTypeProjects = this.filteredProjects.filter(el => el.oncotree_tissue_code === tType.oncotree_code);
        if(tTypeProjects.length > 0) {
          result.push({
            'oncotree_name': tType.oncotree_name,
            'oncotree_code': tType.oncotree_code,
            'projects': tTypeProjects
          })
        }
      }
      return result;
    },
    ...mapGetters([
        'windowHeight'
    ])
  },
  watch: {
    selectedProjects(val) {
      this.$emit('choose-num', this.selectedNumSamples());
      this.$emit('choose-mappings', this.selectedOncotreeMappings());
      this.$emit('choose', val);
    },
    allProjects(val) {
      for(let project of val) {
        if(!this.allSources.includes(project["source"])) {
          this.allSources.push(project["source"]);
        }
      }
    },
    tricountsValue(val) {
      if(val === true){
        this.$emit('choose-tricounts-method', "By Study");
      } else {
        this.$emit('choose-tricounts-method', "None");
      }
    },
  },
  mounted: function() {
        var vm = this;
        API.fetchDataListing().then(function(listing) {
            vm.allProjects = listing["projects"];
            vm.tissueTypes = listing["tissue_types"].sort((a, b) => a.oncotree_name.localeCompare(b.oncotree_name));
            vm.loading = false;
        });
  },
  methods: {
    deselectAll() {
      this.selectedProjects = [];
    },
    selectAllByTissueType(oncotree_tissue_code) {
      let tTypeProjects = this.filteredProjects.filter(el => el.oncotree_tissue_code === oncotree_tissue_code).map(el => el.id);
      for(let projId of tTypeProjects) {
        if(!this.selectedProjects.includes(projId)) {
          this.selectedProjects.push(projId);
        }
      }
    },
    hasSelectedProjectsForTissueType(oncotree_tissue_code) {
      for(let projId of this.selectedProjects) {
        let proj = this.allProjects.find(el => el.id === projId);
        if(proj !== undefined && proj.oncotree_tissue_code === oncotree_tissue_code) {
          return true;
        }
      }
      return false;
    },
    selectedNumSamples() {
      let result = 0;
      for(let projId of this.selectedProjects) {
        let proj = this.allProjects.find(el => el.id === projId);
        result += proj.num_samples;
      }
      return result;
    },
    selectedOncotreeMappings() {
      let mappings = [];
      for(let projId of this.selectedProjects) {
        let proj = this.allProjects.find(el => el.id === projId);
        for(let projMapping of proj["sigs_mapping"]) {
          mappings.push(projMapping);
        }
      }
      return mappings;
    },
    scrollToTissueType(oncotree_tissue_code) {
      let scrollHeight = 0;
      let filteredProjectsByTissueType = this.filteredProjectsByTissueType;
      for(let tType of filteredProjectsByTissueType) {
        if(tType.oncotree_code === oncotree_tissue_code) {
          break;
        }
        scrollHeight += (22 + 4 + 21.280) + (19*tType.projects.length);
      }
      document.querySelector("#col-projects").scrollTop = scrollHeight;
    }
  }
}
</script>

<style scoped lang="scss">
@import './../style/variables.scss';
.samples-title {
  display: inline-block;
  margin-right: 15px;
  margin-bottom: 5px;
}
.filters {
  margin-bottom: 10px;
  display: flex;
  flex-direction: row;
  .samples-filter-by-source {
    flex-grow: 1;
  }
}
.tricounts-option-wrapper {
  position: relative;
}

.col-container {
  display: flex;
  flex-direction: row;

  .col-tissue-types {
    flex-grow: 1;
    overflow-y: scroll;
    &>div {
      background-color: #F1F6FE;
      border-bottom: 1px solid #DEE9F1;
      padding: 5px 0px 5px 10px;
      font-size: 14px;
      cursor: pointer;
      .num-projects-badge {
        float: right;
        padding: 0 10px;
        background-color: #DEE9F1;
        right: 10px;
        position: relative;

        .projects-selected-badge {
          width: 5px;
          height: 5px;
          border-bottom-left-radius: 5px;
          display: inline-block;
          background-color: $color-gray;
          position: absolute;
          right: 0;
          top: 0;
        }
      }
      &:hover {
        background-color: #DEEAF3;
      }
    }
  }
  .col-projects {
    flex-grow: 3;
    overflow-y: scroll;
    padding: 0 10px;
    h4 {
      margin-bottom: 4px;
      display: inline-block;
      margin-right: 15px;
    }
    .project-label {
      .num-samples {
        float: right;
      }
    }
    &>div>div {
      font-size: 14px;
      label {
        cursor: pointer;
      }
      &:hover {
        background-color: #F1F3F4;
      }
    }
  }
}

</style>
