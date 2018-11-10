<template>
    <div>
        <span class="explorer-control-title">Sharing</span>
        <button @click="showShareModal">Share</button>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    name: 'ShareButtons',
    computed: {
        ...mapGetters([
            'getStack'
        ])
    },
    methods: {
        showShareModal() {
            
        }
    }
}
</script>

<style scoped lang="scss">
@import './../style/variables.scss';
</style>
