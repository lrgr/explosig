<template>
    <div>
        <div v-if="Object.keys(legend.data).length > 0">
        {{ legend.meta.title }}
        </div>
    </div>
</template>

<script>
import * as d3 from 'd3';

export default {
  name: 'Legend',
  props: ['legend'],
  data: function() {
      return {
          
      };
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

@import './../variables.scss';



</style>
