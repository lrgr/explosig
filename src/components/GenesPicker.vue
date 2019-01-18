<template>
  <div>
    <h3 class="genes-title">Select genes</h3>
    <div v-show="selectedSamples.length == 0">
      <p>First select samples to enable selection of genes altered in the selected samples.</p>
    </div>
    <div class="gene-col-container" v-show="selectedSamples.length > 0">
      <div class="gene-col">
        <h4 class="gene-col-title">by search</h4>
        <GeneAutocomplete :submitGene="submitGene" :selectedSamples="selectedSamplesCopy" />
        <h4 class="current-selections">Current selections:</h4>&nbsp;<button v-show="selectedGenes.length > 0" @click="deselectAll">Deselect All</button><br>
        <span v-if="selectedGenes.length === 0">None</span>
        <div class="gene-selections">
          <table>
            <tr v-for="selectedGene in selectedGenes" :key="selectedGene">
              <td>{{ selectedGene }}</td>
              <td><button @click="removeGene(selectedGene)">Deselect</button></td>
            </tr>
          </table>
        </div>
      </div>
      <div class="gene-col">
        <h4 class="gene-col-title">by pathway</h4>
        <div v-for="group of pathwayGroups" :key="group.pathway_group" class="pathway-group">
          <span>{{ group.pathway_group }} pathways</span>&nbsp;<span><em>({{ group.publication }})</em></span>
          <div v-for="pathway of group.pathways" :key="pathway.pathway" class="pathway">
            <span>{{ pathway.pathway }}</span>
              &nbsp;<button @click="selectPathway(pathway, false)">Select All</button>
              &nbsp;<button @click="selectPathway(pathway, true)">Select Core</button>
              <br>
            <div class="pathway-genes">
              <span v-for="gene of pathway.genes" :key="gene.gene" class="gene-item" 
                :style="{'font-weight': (gene.core ? 'bold' : 'normal')}"
                :title="getGeneTooltip(gene)"
              >{{ gene.gene }}</span>
            </div>
          </div>
        </div>
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
        selectedSamplesCopy: [],
        pathwayGenes: []
    };
  },
  mounted() {
    API.fetchPathwaysListing().then((data) => {
      this.pathwayGenes = data;
    });
  },
  watch: {
    selectedGenes(val) {
      this.$emit('choose', val);
    },
    selectedSamples(val) {
      this.selectedSamplesCopy = val;
    }
  },
  computed: {
    pathwayGroups() {
      let result = [];
      for(let pathwayGene of this.pathwayGenes) {
        let group = result.find(el => el["pathway_group"] === pathwayGene["pathway_group"]);

        if(group === undefined) {
          group = {
            "pathway_group": pathwayGene["pathway_group"],
            "pathways": [{
              "pathway": pathwayGene["pathway"],
              "genes": [ pathwayGene ]
            }],
            "publication": pathwayGene["publication"]
          };
          result.push(group);
        } else {
          let pathway = group["pathways"].find(el => el["pathway"] === pathwayGene["pathway"]);
          if(pathway === undefined) {
            pathway = {
              "pathway": pathwayGene["pathway"],
              "genes": [ pathwayGene ]
            }
            group["pathways"].push(pathway);
          } else {
            pathway["genes"].push(pathwayGene)
          }
        }
      }
      return result;
    }
  },
  methods: {
    submitGene(gene_id) {
      if(gene_id !== null && gene_id !== undefined && gene_id.length > 0 && !this.selectedGenes.includes(gene_id)) {
        this.selectedGenes.push(gene_id);
      }
    },
    removeGene(gene_id) {
      this.selectedGenes.splice(this.selectedGenes.indexOf(gene_id), 1);
    },
    deselectAll() {
      this.selectedGenes = [];
    },
    selectPathway(pathwayObj, core) {
      for(let gene of pathwayObj["genes"]) {
        if(core && gene["core"]) {
          this.submitGene(gene["gene"]);
        } else if (!core){
          this.submitGene(gene["gene"]);
        }
      }
    },
    getGeneTooltip(geneObj) {
      return "Gene: " + geneObj["gene"] + "\n" + "Location: " + geneObj["location"] + "\n" + "Description: " + geneObj["description"];
    }
  }
}
</script>

<style scoped lang="scss">
@import './../style/variables.scss';
.genes-title {
  margin-bottom: 5px;
}
.gene-selections {
  span {
    display: block;
  }
}
.gene-col-container {
  display: flex;
  .gene-col {
    width: 50%;
    .gene-col-title {
      margin-top: 5px;
      margin-bottom: 5px;
    }
  }
}
.gene-item + .gene-item:before {
  content: ", ";
}
.pathway-group {
  padding-left: 1rem;
}
.pathway {
  padding-left: 1rem;
  margin-top: 1rem;
}
.pathway-genes {
  padding-left: 1rem;
}
.current-selections {
  display: inline-block;
}
</style>
