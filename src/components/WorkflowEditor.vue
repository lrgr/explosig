<template>
    <div>
        <div v-if="stackElements.length == 0">
            No workflows are available because the history stack is currently empty. Try again after performing plot interactions.
        </div>
        <div v-if="stackElements.length > 0">
            <p>
                To convert the current history of interactions to a <a href="https://github.com/lrgr/explosig/wiki/Workflows" target="_blank">workflow</a>, define the variable dependencies.
            </p>
            <div>
                This workflow depends on:<br/>
                <input type="checkbox" id="workflow-dependency-samples" value="samples" v-model="workflowDependencies"/>
                    <label for="workflow-dependency-samples">Samples</label><br/>
                <input type="checkbox" id="workflow-dependency-signatures" value="signatures" v-model="workflowDependencies"/> 
                    <label for="workflow-dependency-signatures">Signatures</label><br/>
                <input type="checkbox" id="workflow-dependency-genes" value="genes" v-model="workflowDependencies"/> 
                    <label for="workflow-dependency-genes">Genes</label><br/>
                <input type="checkbox" id="workflow-dependency-clinical" value="clinical_variables" v-model="workflowDependencies"/> 
                    <label for="workflow-dependency-clinical">Clinical Variables</label>
            </div>
            <p>
                <button @click="downloadWorkflow">Download Workflow</button>
                <button @click="workflowVisible = !workflowVisible" :style="{'float': 'right'}">{{ workflowVisible ? 'Hide workflow' : 'Show workflow' }} </button>
            </p>
            <table class="workflow-event-table" v-if="workflowVisible">
                <thead>
                    <tr>
                        <th>type</th>
                        <th>subtype</th>
                        <th>id</th>
                        <th>action</th>
                        <th>params</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(e, index) in stackElementsFilteredAndReversed" :key="index" class="workflow-event">
                        <td>{{ e.type }}</td>
                        <td>{{ e.subtype }}</td>
                        <td>{{ e.id }}</td>
                        <td>{{ e.action }}</td>
                        <td>{{ JSON.stringify(e.params) }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import API from '../api.js';
import { getScaleHashCode } from '../helpers.js';

import { EVENT_TYPE_STRATIFY } from './../vdp/Stratification.js';
import { EVENT_TYPE_SAMPLES } from './../vdp/Samples.js';


import { mapGetters } from 'vuex';

export default {
  name: 'WorkflowEditor',
  data() {
      return {
          workflowVisible: true,
          workflowDependencies: []
      };
  },
  computed: {
      stackElementsFiltered() {
            const idsToRemove = new Set();
            if(!this.workflowDependencies.includes("samples")) {
                idsToRemove.add("sample_id");
                idsToRemove.add("sample_meta");
            }
            if(!this.workflowDependencies.includes("signatures")) {
                idsToRemove.add("sig_SBS");
                idsToRemove.add("sig_DBS");
                idsToRemove.add("sig_INDEL");
            }
            if(!this.workflowDependencies.includes("clinical_variables")) {
                this.getScale("clinical_variable").domain.forEach((clinicalVariable) => {
                    idsToRemove.add(clinicalVariable);
                });
            }
            if(!this.workflowDependencies.includes("genes")) {
                idsToRemove.add("gene_mut");
                idsToRemove.add("gene_exp");
                idsToRemove.add("gene_cna");
                this.getScale("gene_mut").domain.forEach((geneName) => {
                    idsToRemove.add("gene_mut_" + geneName);
                    idsToRemove.add("gene_exp_" + geneName);
                    idsToRemove.add("gene_cna_" + geneName);
                });
            }

            return this.stackElements.slice().filter((e) => {
                return (
                    // keep if event variable ID not in the list of IDs to remove
                    !idsToRemove.has(e.id)
                    // keep if stratify event but signatures are also dependency 
                     && !(e.type === EVENT_TYPE_STRATIFY && (
                         !this.workflowDependencies.includes("signatures")
                          || (e.params[0][0].s === "clinical_data" && !this.workflowDependencies.includes("clinical_variables"))
                          || (e.params[0][0].s.startsWith("gene_") && !this.workflowDependencies.includes("genes"))
                        ))
                    // keep if sample filter event but samples are also dependency 
                     && !(e.type === EVENT_TYPE_SAMPLES && !this.workflowDependencies.includes("samples"))
                );
            });
      },
      stackElements() {
          return this.getStack().export();
      },
      stackElementsFilteredAndReversed() {
          return this.stackElementsFiltered.slice().reverse();
      },
      ...mapGetters([
          'getStack',
          'getScale'
      ])
  },
  methods: {
      downloadWorkflow() {
        const workflowObject = {
            schema: "explosig-workflow",
            version: 1.0,
            dependencies: {},
            events: this.stackElementsFiltered,
        };

        if(this.workflowDependencies.includes("samples")) {
            workflowObject.dependencies["sample_id"] = getScaleHashCode(this.getScale("sample_id"));
        }
        if(this.workflowDependencies.includes("signatures")) {
            workflowObject.dependencies["sig_SBS"] = getScaleHashCode(this.getScale("sig_SBS"));
            workflowObject.dependencies["sig_DBS"] = getScaleHashCode(this.getScale("sig_DBS"));
            workflowObject.dependencies["sig_INDEL"] = getScaleHashCode(this.getScale("sig_INDEL"));
        }
        if(this.workflowDependencies.includes("clinical_variables")) {
            workflowObject.dependencies["clinical_variable"] = getScaleHashCode(this.getScale("clinical_variable"));
        }
        if(this.workflowDependencies.includes("genes")) {
            workflowObject.dependencies["gene_mut"] = getScaleHashCode(this.getScale("gene_mut"));
            workflowObject.dependencies["gene_exp"] = getScaleHashCode(this.getScale("gene_exp"));
            workflowObject.dependencies["gene_cna"] = getScaleHashCode(this.getScale("gene_cna"));
        }
  
        const exportName = "explosig-workflow";
        const fileExtension = "json";
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(workflowObject));
        
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", exportName + "." + fileExtension);
        document.body.appendChild(downloadAnchorNode); // required for firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
      }
  }
}
</script>

<style scoped lang="scss">
@import './../style/variables.scss';

.workflow-event-table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 3px 15px;
}
.workflow-event {
    border-bottom: 10px solid white;

    td {
        background-color: $color-lgreen;
        padding-left: 10px;
        padding-right: 10px;

        &:first-child {
            border-top-left-radius: 10px;
            border-bottom-left-radius: 10px;
        }
        &:nth-last-child(2) {
            font-family: monospace;
        }
        &:last-child {
            border-top-right-radius: 10px;
            border-bottom-right-radius: 10px;

            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
            max-width: 200px;
            font-family: monospace;
        }
    }
}

</style>
