<template>
    <div>
        <!-- buggy; using dummy element for now -->
        <div class="explorer-divider" :style="{ 'height': (windowHeight-73) + 'px', 'left': offsetLeft + 'px' }"></div>
        <!--<div class="explorer-divider" :style="{ 'height': (windowHeight-73) + 'px', 'left': offsetLeft + 'px' }" @dragstart="dragStart" @dragend="dragEnd" draggable="true"></div>-->
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { EXPLORER_COLUMNS } from '../vdp/Sizes';

export default {
  name: 'Divider',
  props: ['side'],
  computed: {
      offsetLeft() {
          let result = this.windowWidth * this.getSizes().columns[EXPLORER_COLUMNS.MAIN];
          if(this.side === "right") {
              result += this.windowWidth * this.getSizes().columns[EXPLORER_COLUMNS.OVERVIEW];
          }
          return result + this.addOffsetLeft;
      },
      ...mapGetters([
          'getSizes',
          'windowWidth',
          'windowHeight'
      ])
  },
  methods: {
      dragStart(e) {
          // Do nothing. Required by firefox.
          e.dataTransfer.setData('Text', 'dragstart');
      },
      dragEnd(e) {
          let columns = Object.assign({}, this.getSizes().columns);
          let clientX = e.screenX;
          if(this.side === "left") {
            let newProportionMain = clientX / this.windowWidth;
            columns[EXPLORER_COLUMNS.MAIN] = Math.min(columns[EXPLORER_COLUMNS.MAIN] + columns[EXPLORER_COLUMNS.OVERVIEW], Math.max(0, newProportionMain));

            let newProportionOverview = 1.0 - columns[EXPLORER_COLUMNS.LEGEND] - newProportionMain;
            columns[EXPLORER_COLUMNS.OVERVIEW] = newProportionOverview;
          } else {
            let newProportionLegend = (this.windowWidth - clientX) / this.windowWidth;
            columns[EXPLORER_COLUMNS.LEGEND] = Math.min(columns[EXPLORER_COLUMNS.LEGEND] + columns[EXPLORER_COLUMNS.OVERVIEW], Math.max(0, newProportionLegend));

            let newProportionOverview = 1.0 - columns[EXPLORER_COLUMNS.MAIN] - newProportionLegend;
            columns[EXPLORER_COLUMNS.OVERVIEW] = newProportionOverview;
          }
          this.getSizes().updateColumns(columns);
      }
  }
}
</script>

<style scoped lang="scss">

@import './../style/variables.scss';

.explorer-divider {
    position: fixed;
    width: 5px;
    box-sizing: border-box;
    border-left: 1px solid silver;
    opacity: 0.5;
    z-index: 6;

    /* TODO: uncomment when I have a chance to fix bugs */
    /* 
    cursor: col-resize;
    transition: border-left 0.1s;

    &:hover {
        border-left: 5px solid silver;
    }
    */
}
</style>
