<template>
    <div>
        <div v-if="stackElements.length == 0">
            No workflows are available because the history stack is currently empty. Try again after performing plot interactions.
        </div>
        <div v-if="stackElements.length > 0">
            <p>
                Convert the current ExploSig state and history to a <a href="https://github.com/lrgr/explosig/wiki/Workflows" target="_blank">workflow</a>:
                <select v-model="workflowFilter">
                    <option
                        value="samples" 
                        :selected="workflowFilter === 'samples' ? 'selected' : ''"
                    >
                        sample&ndash;agnostic
                    </option>
                    <option
                        value="signatures" 
                        :selected="workflowFilter === 'signatures' ? 'selected' : ''"
                    >
                        signature&ndash;agnostic
                    </option>
                    <option
                        value="samples-and-signatures" 
                        :selected="workflowFilter === 'samples-and-signatures' ? 'selected' : ''"
                    >
                        sample&ndash; &amp; signature&ndash; agnostic
                    </option>
                </select>
                &nbsp;
                <button @click="downloadWorkflow">Download</button>
            </p>
            <p>
                <button @click="workflowVisible = !workflowVisible">{{ workflowVisible ? 'Hide workflow' : 'Show workflow' }} </button>
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

import { mapGetters } from 'vuex';

export default {
  name: 'WorkflowEditor',
  data() {
      return {
          workflowVisible: false,
          workflowFilter: "samples"
      };
  },
  computed: {
      stackElementsFiltered() {
            const idsToRemove = new Set();
            if(this.workflowFilter.includes("samples")) {
                idsToRemove.add("sample_id");
                idsToRemove.add("sample_meta");
            }
            if(this.workflowFilter.includes("signatures")) {
                idsToRemove.add("sig_SBS");
                idsToRemove.add("sig_DBS");
                idsToRemove.add("sig_INDEL");
            }
            // TODO: filter out stratifications if signature-agnostic
            return this.stackElements.slice().filter((e) => !idsToRemove.has(e.id));
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
            type: this.workflowFilter,
            hashes: {
                "sample_id": getScaleHashCode(this.getScale("sample_id")),
                "sig_SBS": getScaleHashCode(this.getScale("sig_SBS")),
                "sig_DBS": getScaleHashCode(this.getScale("sig_DBS")),
                "sig_INDEL": getScaleHashCode(this.getScale("sig_INDEL")),
            },
            events: this.stackElementsFiltered,
        };
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
