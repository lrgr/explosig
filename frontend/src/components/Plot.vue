<template>
    <div>
        <div class="options-bar">
            <span class="title">Plot Title</span>
            <div class="right-button-group">
                <span class="button" v-on:click="toggleTab('signatures')">Signatures</span>
                <span class="button" v-on:click="toggleTab('samples')">Samples</span>
                <span class="button" v-on:click="toggleTab('clinical')">Clinical</span>
                <span class="button button-inverse" v-if="plotOptions.unsaved">Save</span>
            </div>
        </div>

        <div class="plot">
            <div class="plot-options" v-show="plotOptions.show">
                <PlotOptions :currentTab="plotOptions.currentTab" v-on:unsaved="plotOptions.unsaved = true" />
            </div>
            <p>Hello</p>
        </div>


        
  </div>
</template>

<script>

import PlotOptions from './PlotOptions.vue'

export default {
  name: 'Plot',
  data: function() { 
        return {
            plotTitle: "test",
            plotOptions: {
                show: false,
                unsaved: false,
                currentTab: null
            }
        };
  },
  methods: {
        toggleTab: function(tabname) {
            if(this.plotOptions.currentTab == tabname && this.plotOptions.show) {
                this.plotOptions.show = false;
            } else {
                this.plotOptions.currentTab = tabname;
                this.plotOptions.show = true;
            }
        },

  },
  components: {
      PlotOptions
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

@import './../variables.scss';

.options-bar {
    width: 100%;
    background-color: $color-lgray;
    padding: 0.5rem 0rem;

    span.title {
        text-decoration: none;
        color: $color-white;
        font-size: 1.2rem;
        margin: 0 1rem;
    }
    .right-button-group {
        float: right;
        margin: 0.2rem 0.5rem;
    }
}

span.button {
    color: $color-white;
    background-color: $color-darkgray;
    margin: 0rem 0.4rem;
    padding: 0.1rem 0.3rem;
    font-size: 1rem;
    border-radius: 0.2rem;
    cursor: pointer;

    &.button-inverse {
        background-color: $color-lgreen;
        color: $color-darkgray;
    }
}
.plot {
    border: 1px solid $color-lgray;;
    height: 25rem;
    position:relative;

    .plot-options {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(255, 255, 255, 0.7);
    }
}
</style>
