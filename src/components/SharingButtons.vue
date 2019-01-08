<template>
    <div>
        <span class="explorer-control-title">Share</span>
        <button @click="exportHistory" :disabled="isExporting">Export</button>

        <div class="modal" v-if="modalVisible">
            <div class="modal-inner">
                <span class="modal-close" @click="closeSharingModal">Close</span>
                <div class="sharing-options-wrapper">
                    <h3>Share</h3>
                    <p>Share the current iMuSE state and history via the following URL:</p>
                    <div class="sharing-url" v-if="currSlug.length > 0">
                        <pre>http://imuse.lrgr.io/#export-{{ currSlug }}</pre>
                    </div>
                    <VSpinner v-if="isExporting" class="spinner" />
                </div>
            </div>
        </div>
        <div class="modal-background" v-show="modalVisible" @click="closeSharingModal"></div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import API from './../api.js';

import VSpinner from './VSpinner.vue';

import { CONTINUOUS_CLINICAL_VARS } from './../constants.js';

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

        };
    },
    computed: {
        ...mapGetters([
            'getConfig',
            'getScale',
            'getData',
            'getStack',
            'getStratification'
        ])
    },
    methods: {
        closeSharingModal() {
            this.modalVisible = false;
            this.currSlug = "";
        },
        exportHistory() {
            this.isExporting = true
            this.modalVisible = true;
            
            let state = {
                "history": this.getStack().export(),
                "config": this.getConfig().export()
            };
            API.setSharingState(state).then((dataSet) => {
                this.isExporting = false;
                this.currSlug = dataSet.slug;
            });
        }
    }
}
</script>

<style scoped lang="scss">
@import './../style/variables.scss';
@import './../style/modal.scss';

.sharing-options-wrapper {
    padding: 1rem;
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
