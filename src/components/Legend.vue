<template>
    <div class="legend-wrapper">
        <div class="legend" v-if="legendInfo != null && legendInfo.data.length > 0">
            <span class="legend-key">{{ legendInfo.meta.title }}</span>
            <div v-for="item in legendInfo.data" :key="item.name">
                <span class="item-color" :style="{ backgroundColor: item.color, border: border(item.color) }"></span><span class="item-name">{{ item.name }}</span>
            </div>
        </div>
        
    </div>
</template>

<script>
import * as d3 from 'd3';
import { LegendListBus } from './../buses.js'

export default {
  name: 'Legend',
  props: ['legendKey'],
  data: function() {
      return {
          legendInfo: null
      };
  },
  methods: {
      border(itemColor) {
          if(this.legendKey == "clinicalVariables" && itemColor == "#FFF") {
              return '2px solid #000000';
          } else {
              return 'none';
          }
      }
  },
  mounted: function() {
      let vm = this;
      // subscribe using legendKey
      LegendListBus.$on(vm.legendKey, function(updatedLegendInfo) {
          vm.legendInfo = updatedLegendInfo;
      });
  }
  
}
</script>

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
            box-sizing: border-box;
        }
        .item-name {
            font-size: 0.8rem;
            margin-left: 0.5rem;
            display: inline-block;
        }
    }
}

</style>
