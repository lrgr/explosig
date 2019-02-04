<template>
    <div>
        <span class="explorer-control-title">Export</span>
        <button @click="exportData">Data</button>
        <button @click="exportHistory" :disabled="isExporting">URL</button>

        <div class="modal" v-if="modalVisible">
            <div class="modal-inner">
                <span class="modal-close" @click="closeSharingModal">Close</span>
                <div class="sharing-options-wrapper" v-if="historyModalVisible">
                    <h3>Export URL</h3>
                    <p>Share the current ExploSig state and history via the following URL:</p>
                    <div class="sharing-url" v-if="currSlug.length > 0">
                        <pre>http://explosig.lrgr.io/#export-{{ currSlug }}</pre>
                    </div>
                    <VSpinner v-if="isExporting" class="spinner" />
                </div>
                <div class="sharing-options-wrapper" v-if="dataModalVisible">
                    <h3>Export Data</h3>
                    <table>
                        <tr v-for="dataKey of getDataKeys()" :key="dataKey">
                            <td>{{ getData(dataKey).name }}</td>
                            <td><button @click="downloadData(dataKey, 'JSON')">JSON</button></td>
                            <td><button @click="downloadData(dataKey, 'CSV')" v-if="dataIsArray(dataKey)">CSV</button></td>
                            <td><button @click="downloadData(dataKey, 'TSV')" v-if="dataIsArray(dataKey)">TSV</button></td>
                        </tr>
                    </table>
                    <br/>
                </div>
            </div>
        </div>
        <div class="modal-background" v-show="modalVisible" @click="closeSharingModal"></div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { parse as json2csv } from 'json2csv';
import API from './../api.js';

import VSpinner from './VSpinner.vue';

export default {
    name: 'SharingButtons',
    components: {
        VSpinner,
    },
    data() {
        return {
            currSlug: "",
            isExporting: false,
            modalVisible: false,
            historyModalVisible: false,
            dataModalVisible: false
        };
    },
    computed: {
        ...mapGetters([
            'getConfig',
            'getScale',
            'getData',
            'getStack',
            'getStratification',
            'getDataKeys'
        ])
    },
    methods: {
        closeSharingModal() {
            this.modalVisible = false;
            this.historyModalVisible = false;
            this.dataModalVisible = false;

            this.currSlug = "";
        },
        exportHistory() {
            this.isExporting = true
            this.modalVisible = true;
            this.historyModalVisible = true;
            
            let state = {
                "history": this.getStack().export(),
                "config": this.getConfig().export()
            };
            API.setSharingState(state).then((dataSet) => {
                this.isExporting = false;
                this.currSlug = dataSet.slug;
            });
        },
        exportData() {
            this.modalVisible = true;
            this.dataModalVisible = true;
        },
        dataIsArray(dataKey) {
            return Array.isArray(this.getData(dataKey).data);
        },
        downloadData(dataKey, fileType) {
            const dataArray = this.getData(dataKey).dataCopy;
            const exportName = this.getData(dataKey).id;
            let dataStr, fileExtension;
            if(fileType === 'JSON') {
                fileExtension = "json";
                dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(dataArray));
            } else if(fileType === 'CSV' || fileType === 'TSV') {
                if(Array.isArray(dataArray) && dataArray.length > 0) {
                    let delimiter;
                    if(fileType === 'CSV') {
                        fileExtension = "csv";
                        delimiter = ',';
                    } else {
                        fileExtension = "tsv";
                        delimiter = '\t';
                    }
                    try {
                        const csv = json2csv(dataArray, { fields: Object.keys(dataArray[0]), delimiter: delimiter });
                        dataStr = "data:text/" + fileExtension + ";charset=utf-8," + encodeURIComponent(csv);
                    } catch (err) {
                        console.error(err);
                    }
                }
            }
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
@import './../style/modal.scss';

.sharing-options-wrapper {
    padding: 1rem;
    overflow-y: scroll;
    height: 80vh;
    box-sizing: border-box;
    h3 {
        margin-top: 0;
    }
    .sharing-url {
        background-color: $color-lgreen;
        padding: 0.2rem;
        font-size: 1.1rem;
        text-align: center;
        border: 1px solid $color-gray;
        color: $color-darkgray;
        border-radius: 3px;
    }
}

</style>
