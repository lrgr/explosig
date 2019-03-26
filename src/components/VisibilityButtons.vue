<template>
    <div>
        <div class="plot-toggle-wrapper">
            <button @click="toggleNormalizedPlots">Toggle Normalized Exposure Plots</button>
        </div>
        <div class="plot-toggle-wrapper">
            <button @click="toggleCosineSimilarityPlots">Toggle Cosine Similarity Plots</button>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

import { HistoryEvent } from 'vueplotlib';
import { PLOT_GROUPS, EVENT_TYPE_VISIBILITY, EVENT_SUBTYPE_VISIBILITY } from './../vdp/Visibility';

export default {
    name: 'VisibilityButtons',
    computed: {
        ...mapGetters([
            'windowHeight', 
            'windowWidth',
            'getConfig',
            'getVisibility',
            'getStack',
            'getData',
            'getScale'
        ])
    },
    methods: {
        toggleNormalizedPlots() {
            let prevHiddenPlots = this.getVisibility().hiddenPlots;
            let nextHiddenPlots;
            if(prevHiddenPlots.includes(PLOT_GROUPS.NORMALIZED_EXPOSURES)) {
                // remove normalized exposures plots from hidden to show
                nextHiddenPlots = Array.from(prevHiddenPlots);
                nextHiddenPlots.splice(prevHiddenPlots.indexOf(PLOT_GROUPS.NORMALIZED_EXPOSURES), 1);
            } else {
                // add normalized exposures plots to hidden to hide
                nextHiddenPlots = [PLOT_GROUPS.NORMALIZED_EXPOSURES, ...prevHiddenPlots];
            }
            this.getVisibility().updateHiddenPlots(nextHiddenPlots);
            this.getStack().push(new HistoryEvent(
                EVENT_TYPE_VISIBILITY, 
                EVENT_SUBTYPE_VISIBILITY, 
                "N/A", 
                "updateHiddenPlots", 
                [nextHiddenPlots]
            ));
        },
        toggleCosineSimilarityPlots() {
            let prevHiddenPlots = this.getVisibility().hiddenPlots;
            let nextHiddenPlots;
            if(prevHiddenPlots.includes(PLOT_GROUPS.COSINE_SIMILARITY)) {
                // remove cosine similarity plots from hidden to show
                nextHiddenPlots = Array.from(prevHiddenPlots);
                nextHiddenPlots.splice(prevHiddenPlots.indexOf(PLOT_GROUPS.COSINE_SIMILARITY), 1);
            } else {
                // add cosine similarity plots to hidden to hide
                nextHiddenPlots = [PLOT_GROUPS.COSINE_SIMILARITY, ...prevHiddenPlots];
            }
            this.getVisibility().updateHiddenPlots(nextHiddenPlots);
            this.getStack().push(new HistoryEvent(
                EVENT_TYPE_VISIBILITY, 
                EVENT_SUBTYPE_VISIBILITY, 
                "N/A", 
                "updateHiddenPlots", 
                [nextHiddenPlots]
            ));
        }
    }
}
</script>

<style scoped lang="scss">
@import './../style/variables.scss';

.plot-toggle-wrapper {
    width: 100%;
    text-align: center;
}

</style>
