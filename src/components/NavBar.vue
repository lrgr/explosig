<template>
    <div>
        <div class="navbar">
            <span class="title">
                <a href="/">ExploSig</a>
            </span>
            <VSpinner v-if="isLoading" color="white" margin="0 0 0 20px" display="inline-block"/>
            <div class="right-button-group">
                <VButton :btn-inverse="true" @click="showDataPicker('samples')">Samples</VButton>
                <VButton :btn-inverse="true" @click="showDataPicker('signatures')">Signatures</VButton>
                <VButton :btn-inverse="true" @click="showDataPicker('genes')">Genes</VButton>
                <VButton :btn-inverse="true" @click="showDataPicker('clinical')">Clinical</VButton>
            </div>
        </div>
        
        <div class="modal" v-show="modalVisible">
            <div class="modal-inner">
                <span class="modal-close" @click="closeModal">Close</span>
                <DataPicker ref="dataPicker" @update="closeModal"></DataPicker>
            </div>
        </div>
        <div class="modal-background" v-show="modalVisible" @click="closeModal"></div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';


// child components
import DataPicker from './DataPicker.vue';
import VButton from './VButton.vue';
import VSpinner from './VSpinner.vue';


export default {
  name: 'NavBar',
  data: function() { 
        return {
            modalVisible: false,
            selectedDataPicker: null
        };
  },
  components: {
      DataPicker,
      VButton,
      VSpinner
  },
  computed: {
      ...mapGetters([
          'isLoading'
      ])
  },
  methods: {
      showDataPicker: function(selection) {
          this.$refs.dataPicker.setDataPicker(selection);
          this.modalVisible = true;
      },
      closeModal: function() {
          this.modalVisible = false;
      }
  }
}
</script>

<style scoped lang="scss">

@import './../style/variables.scss';
@import './../style/modal.scss';


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
    a {
        text-decoration: none;
        color: $color-white;
    }
}
.right-button-group {
    float: right;
    margin: 0.3rem 0.5rem;
}
span.btn {
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


</style>
