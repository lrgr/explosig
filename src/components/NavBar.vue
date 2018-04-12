<template>
    <div>
        <div class="navbar">
            <span class="title">Mutation Visualizations</span>
            <div class="right-button-group">
                <span class="button" v-on:click="openOptions = 'DataPicker'">Signatures</span>
                <span class="button" v-on:click="openOptions = 'DataPicker'">Samples</span>
                <span class="button button-inverse" v-on:click="openOptions = 'PlotPicker'">+ Plot</span>
            </div>
        </div>
        
        <div class="modal" v-show="openOptions !== null">
            <div class="modal-inner">
                <span class="modal-close" v-on:click="openOptions = null">Close</span>
                <component :is="openOptions"></component>
            </div>
        </div>
        <div class="modal-background" v-show="openOptions !== null" v-on:click="openOptions = null"></div>
  </div>
</template>

<script>
import DataPicker from './DataPicker.vue'
import PlotPicker from './PlotPicker.vue'

export default {
  name: 'NavBar',
  data: function() { 
        return {
            openOptions: null
        };
  },
  components: {
      PlotPicker,
      DataPicker
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

@import './../variables.scss';

.navbar {
    width: 100%;
    background-color: $color-gray;
    padding: 0.5rem 0rem;
}

span.title {
    text-decoration: none;
    color: $color-white;
    font-size: 1.5rem;
    margin: 0 1rem;
}
.right-button-group {
    float: right;
    margin: 0.3rem 0.5rem;
}
span.button {
    margin: 0rem 0.5rem;
}
.modal-background {
    z-index: 1;
    top: 0;
    left: 0;
    position: fixed;
    width: 100%;
    height: 100vh;
    background-color: black;
    opacity: 0.4;
}
.modal {
    z-index: 2;
    top: 10vh;
    left: 10%;
    height: 80vh;
    width: 80%;
    position: absolute;
    background-color: $color-white;
    
    .modal-inner {
        box-sizing: border-box;
        height: 100%;

        .modal-close {
            position: absolute;
            right: 2rem;
            top: 1rem;
            cursor: pointer;
        }
    }
}
</style>
