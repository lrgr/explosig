<template>
    <div>
        <span class="explorer-control-title">Session</span>
        <button @click="startSession">Start</button>
        <button @click="connectSession">Connect</button>

        <div class="modal" v-if="modalVisible">
            <div class="modal-inner">
                <span class="modal-close" @click="closeSessionModal">Close</span>
                <div class="start-session-options-wrapper" v-if="startSessionModalVisible">
                    <h3>Session</h3>
                    <p>Use the following session ID to access the current session:</p>
                    <div class="conn-id" v-if="currSessionID.length > 0">
                        <pre>{{ currSessionID }}</pre>
                    </div>
                    <VSpinner v-if="isLoading" class="spinner" />
                </div>
            </div>
        </div>
        <div class="modal-background" v-show="modalVisible" @click="closeSessionModal"></div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import API from './../api.js';

import VSpinner from './VSpinner.vue';

export default {
    name: 'SessionButtons',
    components: {
        VSpinner,
    },
    data() {
        return {
            currSessionID: "",
            isLoading: false,
            modalVisible: false,
            startSessionModalVisible: false,
            connectSessionModalVisible: false
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
        closeSessionModal() {
            this.modalVisible = false;
            this.startSessionModalVisible = false;
            this.connectSessionModalVisible = false;
        },
        startSession() {
            this.isLoading = true;
            this.modalVisible = true;
            this.startSessionModalVisible = true;

            if(this.currSessionID.length === 0) {
                // No session ID exists yet, so request one.
                let state = {
                    "config": this.getConfig().export()
                };
                API.startSession(state).then((data) => {
                    this.isLoading = false;
                    this.currSessionID = data['session_id'];

                    API.connectSession(this.currSessionID);
                });
            } else {
                // Already have a session ID.
                this.isLoading = false;
            }
        },
        connectSession() {
            this.modalVisible = true;
            this.connectSessionModalVisible = true;

        }
    }
}
</script>

<style scoped lang="scss">
@import './../style/variables.scss';
@import './../style/modal.scss';

.start-session-options-wrapper {
    padding: 1rem;
    overflow-y: scroll;
    height: 80vh;
    box-sizing: border-box;
    h3 {
        margin-top: 0;
    }
    .conn-id {
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
