<template>
    <div class="plot-options">
        <div class="tab" v-if="currentTab === 'signatures'">
            <h3>Signature Sources</h3>
            <div class="option-group">
                <div v-for="source in sigSources" :key="source">
                    <input type="radio" :value="source" :id="source" name="sigSources" v-model="options.sigSource">
                    <label :for="source">{{ source }}</label>
                </div>
                <Spinner v-if="loading" class="spinner"></Spinner>
            </div>
            <h3>Activity</h3>
            <div class="option-group">
                <div v-for="level in activityLevels" :key="level">
                    <input type="radio" :value="level" :id="level" name="activityLevels" v-model="options.activityLevel">
                    <label :for="level">{{ level }}</label>
                </div>
                <Spinner v-if="loading" class="spinner"></Spinner>
            </div>
        </div>
        <div class="tab" v-if="currentTab === 'samples'">
            <h3>Samples</h3>
            <div class="option-group">
                <div v-for="source in ssmSources" :key="source">
                    <input type="checkbox" :value="source" :id="source" name="ssmSources" v-model="options.ssmSources">
                    <label :for="source">{{ source }}</label>
                </div>
                <Spinner v-if="loading" class="spinner"></Spinner>
            </div>
        </div>
        <div class="tab" v-if="currentTab === 'clinical'">
            <h3>Clinical</h3>
            <div class="option-group">
                <div v-for="source in donorSources" :key="source">
                    <input type="checkbox" :value="source" :id="source" name="donorSources" v-model="options.donorSources">
                    <label :for="source">{{ source }}</label>
                </div>
                <Spinner v-if="loading" class="spinner"></Spinner>
            </div>
        </div>
    </div>
</template>

<script>
import Spinner from './Spinner.vue'
import API from './../api.js'

export default {
  name: 'PlotOptions',
  components: {
    Spinner
  },
  props: ['currentTab'],
  data: function() {
      return {
          loading: true,
          options: {
              sigSource: null,
              ssmSources: [],
              donorSources: [],
              activityLevel: null
          },
          sigSources: [],
          ssmSources: [],
          donorSources: [],
          activityLevels: [],
          activity: 'active'
      };
  },
  mounted: function() {
      this.dataListing();
  },
  methods: {
      dataListing: function() {
          var vm = this;
          API.fetchDataListing().then(function(listing) {
              vm.sigSources = Object.keys(listing.sigs);
              vm.ssmSources = listing.ssm;
              vm.donorSources = listing.donor;
              vm.activityLevels = ["all", "active"];
              vm.loading = false;
          });
      }
  },
  watch: {
      options: {
        handler: function(val) {
          this.$emit('unsaved', true);
        },
        deep: true
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

@import './../variables.scss';

.plot-options {
    .tab {
        height: 100%;
        padding: 1rem;
        box-sizing: border-box;
        overflow-y: scroll;
        h3 {
            margin: 0.3rem;
        }
        .option-group {
            margin-bottom: 1.5rem;
            div {
                margin-bottom: 0.2rem;
                label {
                    margin-left: 0.5rem;
                }
            }
            .spinner {
                margin-bottom: 3rem;
            }
        }
    }
    
}

</style>
