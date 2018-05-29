<template>
    <div>
        <div class="title-wrapper">
            <span class="title-big" title="Donor ID">{{ currentModeOptions.donor_id }}</span>
            <span class="title-small" title="Project ID">{{ currentModeOptions.proj_id }}</span>
        </div>
        <Plot v-for="plot in singleDonorPlots" 
                    :key="plot.id" 
                    :plotType="plot.type"
                    :plotOptions="currentModeOptions"
                    :plotID="plot.id"
                    :plotTitle="plot.title"
                    :canRemove="false"
                    class="item"
        ></Plot>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

// child components
import Plot from './Plot.vue';


export default {
  name: 'SingleDonorPlots',
  components: {
      Plot
  },
  data: function() {
      return {
          singleDonorPlots: [
              {
                  'type': 'RainfallPlot',
                  'title': 'Rainfall',
                  'id': '123'
              }
          ]
      };
  },
  computed: {
      ...mapGetters([
          'currentModeOptions'
      ])
  },
  methods: {
      
  }
}
</script>

<style scoped lang="scss">

@import './../variables.scss';

.title-wrapper {
    margin-bottom: 0.5rem;
    .title-big {
        font-size: 26px;
        margin-right: 1rem;
    }
}

</style>
