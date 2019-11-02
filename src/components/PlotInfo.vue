<template>
    <div class="plot-info-container">
        <div 
            class="plot-info" 
            :style="{'width': (showTitle ? '100%' : 'auto'), 'position': (showTitle ? 'relative' : 'absolute')}"
        >
            <h4 v-if="showTitle">{{ title }}</h4>
            <button @click="modalVisible = true">?</button>
        </div>

        <div class="modal" v-show="modalVisible">
            <div class="modal-inner">
                <span class="modal-close" @click="closeModal">Close</span>
                <div class="plot-info-modal">
                    <h3>Plot Info</h3><span class="plot-info-modal-title">{{ title }}</span>
                    
                    <slot name="info"></slot>
                </div>
            </div>
        </div>
        <div class="modal-background" v-show="modalVisible" @click="closeModal"></div>
    </div>
</template>

<script>

export default {
    name: 'PlotInfo',
    props: {
        'title': {
            type: String
        }, 
        'showTitle': {
            type: Boolean,
            default: false
        }
    },
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

.plot-info-container {
    position: relative;
    .plot-info {
        margin-bottom: 5px;
        text-align: center;
        button {
            float: left;
            margin-left: 15px;
            background-color: $color-gray;
            border: none;
            color: white;
            text-align: center;
            text-decoration: none;
            display: inline-block;
            font-size: 14px;
            border-radius: 3px;
            cursor: pointer;
            user-select: none;
        }
        h4 {
            margin-bottom: 0;
        }
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
