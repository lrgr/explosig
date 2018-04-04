<template>
    <div>
        <p>Hello</p>
    </div>
</template>

<script>
import API from './../../api.js'


export default {
  name: 'SignatureGenomeBinsPlot',
  props: ['dataOptions'],
  data: function() { 
        return {
            
        };
  },
  methods: {
      updatePlot: function() {
          console.log(this.dataOptions);
          API.fetchGenomeSignatureBins(this.dataOptions).then(function(response) {
              console.log(response);
          })
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

@import './../../variables.scss';


</style>
