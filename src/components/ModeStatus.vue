<template>
    <div class="mode-bar-wrapper">
        <div class="mode-bar">
            <span class="key">Mode</span>
            <span class="value">
            <select v-on:change="setMode($event.target.value)">
                <option v-for="mode in allModes" 
                    :key="mode.mode" 
                    :value="mode.mode"
                    :selected="mode.mode == currentMode" 
                    :disabled="mode.mode == 'single-donor' && currentMode != 'single-donor'">
                    {{ mode.title }}
                </option>
            </select>
            </span>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';


export default {
  name: 'ModeStatus',
  components: {

  },
  data: function() {
      return {
          
      };
  },
  computed: {
      ...mapGetters([
          'selectedPlots',
          'windowHeight',
          'allModes',
          'currentMode'
      ])
  },
  methods: {
      setMode(selectedMode) {
          let vm = this;
          let modeObj = {
              mode: selectedMode,
              title: vm.allModes.find((el) => (el.mode == selectedMode)).title,
              options: {}
          };
          this.$store.commit('setMode', modeObj);
      }
  }
}
</script>

<style scoped lang="scss">

@import './../variables.scss';

.mode-bar-wrapper {
    box-sizing: border-box;
    width: 100%;
    padding-top: 20px;
    padding-right: 20px;
    height: 58px;
    .mode-bar {
        width: 100%;
        border: 1px solid $color-purple;
        box-sizing: border-box;
        span.key {
            padding: 0.5rem 1rem;
            display: inline-block;
            background-color: $color-purple;
            color: $color-white;
        }
        span.value {
            display: inline-block;
            color: $color-darkgray;
            padding: 0.5rem 1rem;
            user-select: none;
            cursor: pointer;
        }
        span.back {
            cursor: pointer;
            padding: 0.5rem 1rem;
            float: right;
            user-select: none;
        }
    }
}



</style>
