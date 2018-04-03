<template>
    <div class="plot-options">
        <div class="tab tab-signatures" v-if="currentTab === 'signatures'">
            <h3>Signatures</h3>
        </div>
        <div class="tab tab-samples" v-if="currentTab === 'samples'">
            <h3>Samples</h3>
        </div>
        <div class="tab tab-clinical" v-if="currentTab === 'clinical'">
            <h3>Clinical</h3>
        </div>
        
        <Spinner v-if="loading"></Spinner>
    </div>
</template>

<script>
import Spinner from './Spinner.vue'

export default {
  name: 'PlotOptions',
  components: {
    Spinner
  },
  props: ['currentTab'],
  data: function() {
      return {
          loading: false
      };
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

@import './../variables.scss';

.plot-picker {
    height: 100%;
    width: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    h2 {
        flex-shrink: 0;
    }
    ul {
        box-sizing: border-box;
        flex-grow: 1;
        list-style-type: none;
        padding-left:0;
        list-style: none;
        li {
            &:hover {
                color: $color-gray;
            }
            cursor: pointer;
            margin: 1rem;
        }
        
        
    }
    
}

</style>
