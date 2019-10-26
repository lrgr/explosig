<template>
    <div>
        <span class="explorer-control-title">Workflow</span>
        <button @click="importWorkflow">Import</button>
        <button @click="exportWorkflow">Export</button>

        <div class="modal" v-if="modalVisible">
            <div class="modal-inner">
                <span class="modal-close" @click="closeModal">Close</span>
                <div class="sharing-options-wrapper" v-if="workflowExportModalVisible">
                    <h3>Export Workflow</h3>
                    <WorkflowEditor />
                </div>
            </div>
        </div>
        <div class="modal-background" v-show="modalVisible" @click="closeModal"></div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import WorkflowEditor from './WorkflowEditor.vue';
import { getScaleHashCode } from '../helpers.js';


export default {
    name: 'WorkflowButtons',
    components: {
        WorkflowEditor,
    },
    data() {
        return {
            modalVisible: false,
            workflowExportModalVisible: false,
            workflowImportModalVisible: false,
        };
    },
    computed: {
        ...mapGetters([
            'getStack',
            'getScale'
        ])
    },
    methods: {
        closeModal() {
            this.modalVisible = false;
            this.workflowExportModalVisible = false;
            this.workflowImportModalVisible = false;
        },
        exportWorkflow() {
            this.modalVisible = true;
            this.workflowExportModalVisible = true;
        },
        isValidImport(data) {
            let result = (data.hasOwnProperty("schema") && data.hasOwnProperty("version") 
                          && data.hasOwnProperty("events") && data.hasOwnProperty("dependencies") 
                          && data.schema === "explosig-workflow" && data.version === 1);
            for(const dependencyVar of Object.keys(data.dependencies)) {
                result = result && data.dependencies[dependencyVar] === getScaleHashCode(this.getScale(dependencyVar));
            }
            return result;
        },
        processImportData(data) {
            if(this.isValidImport(data)) {
                // do import, workflow is valid
                const stack = this.getStack();
                stack.prune();
                stack.import(data.events);
            } else {
                alert("This workflow is invalid or has dependencies that are not satisfied by the current data selections.");
            }
        },
        importWorkflow() {
            const uploadInputNode = document.createElement('input');
            uploadInputNode.setAttribute('type', 'file');
            uploadInputNode.setAttribute('accept', 'application/json');
            document.body.appendChild(uploadInputNode); // required for firefox
            uploadInputNode.click();
            uploadInputNode.addEventListener('change', (event) => {
                if (!(window.File && window.FileReader && window.FileList && window.Blob)) {
                    console.log('Local file reading APIs are not fully supported in this browser.');
                    return;
                }
                const { files } = event.target;
                if (!files || files.length !== 1) {
                    console.log('Incorrect number of files selected.');
                    return;
                }
                const reader = new FileReader();
                reader.addEventListener('load', () => {
                    const { result } = reader;
                    try {
                        const importData = JSON.parse(result);
                        this.processImportData(importData);
                    } catch (e) {
                        console.log(e.message);
                    }
                }, false);
                reader.readAsText(files[0]);
            });
            uploadInputNode.remove();
        },
    }
}
</script>

<style scoped lang="scss">
@import './../style/variables.scss';
@import './../style/modal.scss';

.sharing-options-wrapper {
    padding: 1rem;
    overflow-y: scroll;
    height: 80vh;
    box-sizing: border-box;
    h3 {
        margin-top: 0;
    }
}
</style>
