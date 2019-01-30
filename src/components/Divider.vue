<template>
    <div>
        <div class="explorer-divider" :style="{ 'height': (windowHeight-73) + 'px', 'left': offsetLeft + 'px' }" @dragstart="dragStart" @dragend="dragEnd" draggable="true"></div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { IMUSE_COLUMNS } from '../vdp/Sizes';

export default {
  name: 'Divider',
  props: ['side'],
  computed: {
      offsetLeft() {
          let result = this.windowWidth * this.getSizes().columns[IMUSE_COLUMNS.MAIN];
          if(this.side === "right") {
              result += this.windowWidth * this.getSizes().columns[IMUSE_COLUMNS.OVERVIEW];
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
            columns[IMUSE_COLUMNS.MAIN] = Math.min(columns[IMUSE_COLUMNS.MAIN] + columns[IMUSE_COLUMNS.OVERVIEW], Math.max(0, newProportionMain));

            let newProportionOverview = 1.0 - columns[IMUSE_COLUMNS.LEGEND] - newProportionMain;
            columns[IMUSE_COLUMNS.OVERVIEW] = newProportionOverview;
          } else {
            let newProportionLegend = (this.windowWidth - clientX) / this.windowWidth;
            columns[IMUSE_COLUMNS.LEGEND] = Math.min(columns[IMUSE_COLUMNS.LEGEND] + columns[IMUSE_COLUMNS.OVERVIEW], Math.max(0, newProportionLegend));

            let newProportionOverview = 1.0 - columns[IMUSE_COLUMNS.MAIN] - newProportionLegend;
            columns[IMUSE_COLUMNS.OVERVIEW] = newProportionOverview;
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
    cursor: col-resize;
    z-index: 6;

    transition: border-left 0.1s;

    &:hover {
        border-left: 5px solid silver;
    }
}
</style>
