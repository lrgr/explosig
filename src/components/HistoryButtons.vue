<template>
    <div>
        <button @click="goBack" :disabled="!canGoBack">Back</button>
        <button @click="goForward" :disabled="!canGoForward">Forward</button>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    name: 'HistoryButtons',
    computed: {
        canGoBack() {
            return this.getStack().canGoBack()
        },
        canGoForward() {
            return this.getStack().canGoForward()
        },
        ...mapGetters([
            'getStack'
        ])
    },
    methods: {
        goBack() {
            this.getStack().goBack()
        },
        goForward() {
            this.getStack().goForward()
        }
    }
}
</script>

<style scoped lang="scss">
@import './../style/variables.scss';

</style>
