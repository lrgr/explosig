<template>
    <div class="legend-wrapper">
        <div class="legend" v-if="legendInfo != null && legendInfo.data.length > 0">
            <span class="legend-key">{{ legendInfo.meta.title }}</span>
            <div v-for="item in legendInfo.data" :key="item.name">
                <span class="item-color" :style="{ backgroundColor: item.color }"></span><span class="item-name">{{ item.name }}</span>
            </div>
        </div>
        
    </div>
</template>

<script>
import { LegendListBus } from './../buses.js'
import * as d3 from 'd3';

export default {
  name: 'Legend',
  props: ['legendKey'],
  data: function() {
      return {
          legendInfo: null
      };
  },
  mounted: function() {
      // subscribe using legendKey
      let vm = this;
      LegendListBus.$on(vm.legendKey, function(updatedLegendInfo) {
          vm.legendInfo = updatedLegendInfo;
      });
  }
  
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

@import './../variables.scss';
.legend-wrapper {
    width: 100%;
    display: block;
    position: relative;
    .legend {
        margin-top: 1rem;
        margin-left: 1rem;
        box-sizing: border-box;
        .legend-key {
            display: inline-block;
        }
        .item-color {
            width: 1rem;
            height: 0.5rem;
            display: inline-block;
        }
        .item-name {
            font-size: 0.8rem;
            margin-left: 0.5rem;
            display: inline-block;
        }
    }
}

</style>
