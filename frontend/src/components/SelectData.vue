<template>
    <div>
        <h2>Data</h2>

        <p>Currently, the following datasets are available for visualization:</p>
        <Spinner v-if="loading"></Spinner>
    </div>
</template>

<script>
import Spinner from './Spinner.vue'

export default {
  name: 'SelectData',
  components: {
    Spinner
  },
  data: function() {
      return {
          loading: true
      };
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

@import './../variables.scss';


</style>
