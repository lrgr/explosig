<template>
    <div class="explorer" :style="{ 'height': (windowHeight-49) + 'px' }">
       <div class="explorer-main explorer-col">Main</div>
       <div class="explorer-overview explorer-col">Overview</div>
       <div class="explorer-legend explorer-col">Legend</div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'Explorer',
  computed: {
      ...mapGetters(['windowHeight'])
  }
}
</script>

<style scoped lang="scss">
@import './../style/variables.scss';

.explorer {
    display: flex;
    flex-direction: row;
    .explorer-col {
        overflow-y: scroll;
    }
    .explorer-main {
        flex-grow: 5;
        background-color: lightblue;
    }
    .explorer-overview {
        flex-grow: 3;
        background-color: lightcoral;
    }
    .explorer-legend {
        flex-grow: 2;
        background-color: bisque;
    }
}
</style>
