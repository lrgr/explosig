<template>
    <div class="mode-progress-wrapper">
        <div class="mode-option">
            <span class="title button button-mode-past">Overview</span>
        </div>
        <div class="mode-option">
            <span class="title button button-mode-selected">All Donors</span>
        </div>
        <div class="mode-option">
            <span class="title button button-mode-future">Single Donor</span>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';


export default {
  name: 'ModeProgress',
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
          'currentModeTitle',
          'hasPreviousMode'
      ])
  },
  methods: {
      goBack: function() {
          this.$store.commit('toPreviousMode');
      }
  }
}
</script>

<style scoped lang="scss">

@import './../variables.scss';

.mode-progress-wrapper {
    box-sizing: border-box;
    margin: 0;
    width: 100%;
    padding-top: 20px;
    border: 0px solid red;
    .mode-option {
        box-sizing: border-box;
        border: 0px solid $color-purple;
        display: inline-block;
        width: 33.33333%;
        margin: 0;
        position: relative;
        span.title {
            width: 8rem;
            margin: 0 auto;
            display: block;
            text-align: center;
        }
        &:not(:last-child)::after {
                content: "";
                top: 15px;
                display: block;
                position: absolute;
                right: -30%;
                border-radius: 2px;
                width: 60%;
                height: 5px;
                background-color: $color-purple;
            }
    }
}

</style>
