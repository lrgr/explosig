<template>
    <div>
        <div class="plot-info">
            <h4 class="plot-info-title">{{ title }}</h4>
            <button @click="modalVisible = true">?</button>
        </div>

        <div class="modal" v-show="modalVisible">
            <div class="modal-inner">
                <span class="modal-close" @click="closeModal">Close</span>
                <div class="plot-info-modal">
                    <h3>Plot info</h3><span class="plot-info-modal-title">{{ title }}</span>
                    
                    <slot name="info"></slot>
                </div>
            </div>
        </div>
        <div class="modal-background" v-show="modalVisible" @click="closeModal"></div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    name: 'PlotInfo',
    props: ['title'],
    data: function() { 
        return {
            modalVisible: false
        };
  },
  methods: {
      closeModal: function() {
          this.modalVisible = false;
      }
  }
}
</script>

<style scoped lang="scss">
@import './../style/variables.scss';
@import './../style/modal.scss';

.plot-info {
    width: 95%;
    margin-left: 2.5%;
    margin-bottom: 5px;
    padding: 5px;
    text-align: center;
    h4 {
        display: inline-block;
        margin: 0;
    }
    button {
        float: right;
        background-color: $color-gray;
        border: none;
        color: white;
        text-align: center;
        text-decoration: none;
        display: inline-block;
        font-size: 14px;
        border-radius: 3px;
        cursor: pointer;
    }
}
.plot-info-modal {
    padding: 1rem;
    h3 {
        margin-top: 0;
        margin-bottom: 0;
        display: inline-block;
    }
    .plot-info-modal-title {
        margin-left: 0.5rem;
    }
}
</style>
