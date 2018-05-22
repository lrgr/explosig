<template>
    <div>
        <div class="navbar">
            <span class="title">iMuSE<span class="title-extra">: Interactive Mutation Signature Explorer</span></span>
            <div class="right-button-group">
                <span class="button button-inverse" v-on:click="showDataPicker()">Data</span>
                <span class="button button-inverse" v-on:click="showPlotPicker()">+ Plot</span>
            </div>
        </div>
        
        <div class="modal" v-show="modalVisible">
            <div class="modal-inner">
                <span class="modal-close" v-on:click="closeModal()">Close</span>
                <PlotPicker v-show="plotPickerVisible" v-on:closePlotPicker="closeModal()"></PlotPicker>
                <DataPicker v-show="dataPickerVisible"></DataPicker>
            </div>
        </div>
        <div class="modal-background" v-show="modalVisible" v-on:click="closeModal()"></div>
  </div>
</template>

<script>
import { DataOptionsBus } from './../buses.js';

// child components
import DataPicker from './DataPicker.vue'
import PlotPicker from './PlotPicker.vue'

export default {
  name: 'NavBar',
  data: function() { 
        return {
            modalVisible: false,
            plotPickerVisible: false,
            dataPickerVisible: false
        };
  },
  components: {
      PlotPicker,
      DataPicker
  },
  mounted: function() {
      var vm = this;
      DataOptionsBus.$on('updateDataOptions', function() {
          vm.closeModal();
      });
  },
  methods: {
      showPlotPicker: function() {
          this.modalVisible = true;
          this.plotPickerVisible = true;
      },
      showDataPicker: function() {
          this.modalVisible = true;
          this.dataPickerVisible = true;
      },
      closeModal: function() {
          this.modalVisible = false;
          this.dataPickerVisible = false;
          this.plotPickerVisible = false;
      }
  }
}
</script>

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
@media (max-width: 698px) {
  span.title > .title-extra {
      display: none;
  }
}
.right-button-group {
    float: right;
    margin: 0.3rem 0.5rem;
}
span.button {
    margin: 0rem 0.5rem;
}

.plus-plot {
    background-color: $color-lgreen;
    width: 50%;
    margin-left: 25%;
    margin-top: 10vh;
    text-align: center;
    padding: 8rem 0;
    border-radius: 1rem;
    cursor: pointer;
    span {
        font-size: 3rem;
        color: $color-darkgray;
    }
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
    position: fixed;
    background-color: $color-white;
    
    .modal-inner {
        box-sizing: border-box;
        height: 100%;

        .modal-close {
            position: absolute;
            right: 2rem;
            top: 1rem;
            cursor: pointer;
            user-select: none;
        }
    }
}
</style>
