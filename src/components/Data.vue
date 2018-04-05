<template>
    <div>
        <h2>Data</h2>
        <button class="inline">Upload (coming soon)</button>
        <p>Currently, the following datasets are available for visualization:</p>
        <pre>{{ listingString }}</pre>
        <Spinner v-if="loading"></Spinner>
    </div>
</template>

<script>
import Spinner from './Spinner.vue'
import API from './../api.js'

export default {
  name: 'SelectData',
  components: {
    Spinner
  },
  data: function() {
      return {
          loading: false,
          listingString: {}
      };
  },
  mounted: function() {
      this.dataListing();
  },
  methods: {
      dataListing: function() {
          this.loading = true;
          var vm = this;
          API.fetchDataListing().then(function(listing) {
              vm.listingString = JSON.stringify(listing, null, 2);
              vm.loading = false;
          });
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

@import './../variables.scss';

h2 {
    margin: 0.3rem;
    display: inline-block;
}
button.inline {
    display: inline-block;
}

</style>
