<template>
    <div class="plot-options">
        <div class="tab" v-if="currentTab === 'signatures'">
            <h3>Presets</h3>
            <div class="option-group">
                <div v-for="preset in sigPresets" :key="preset.name" class="preset-buttons">
                    <button v-on:click="showPreset = preset.name">{{ preset.name }}</button>
                    <div v-if="preset.name === showPreset" class="preset-sub-buttons">
                        <div v-for="cancerType in Object.keys(preset.preset)" :key="cancerType">
                            <button v-on:click="options.signatures = preset.preset[cancerType]">{{ cancerType }}</button>
                        </div>
                    </div>
                </div>
                <Spinner v-if="loading" class="spinner"></Spinner>
            </div>
            <h3>Signatures</h3>
            <div class="option-group">
                <div v-for="signature in signatures" :key="signature">
                    <input type="checkbox" :value="signature" :id="signature" name="signatures" v-model="options.signatures">
                    <label :for="signature">{{ signature }}</label>
                </div>
                <Spinner v-if="loading" class="spinner"></Spinner>
            </div>
        </div>
        <div class="tab" v-if="currentTab === 'samples'">
            <h3>Samples</h3>
            <button class="inline" v-on:click="toggleSamples()">Toggle All</button>
            <div class="option-group">
                <div v-for="source in sources" :key="source">
                    <input type="checkbox" :value="source" :id="source" name="sources" v-model="options.sources">
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
              signatures: null,
              sources: []
          },
          signatures: [],
          sources: [],
          sigPresets: [],
          showPreset: null
      };
  },
  mounted: function() {
      this.dataListing();
  },
  methods: {
      dataListing: function() {
          var vm = this;
          API.fetchDataListing().then(function(listing) {
              vm.sources = listing.sources;
              vm.signatures = listing.sigs;
              vm.sigPresets = listing.sig_presets;
              vm.loading = false;
          });
      },
      toggleSources: function() {
          if(this.options.sources.length == this.sources.length) {
              this.options.sources = [];
          } else {
              this.options.sources = this.sources;
          }
      },
      toggleSignatures: function() {
          if(this.options.signatures.length == this.signatures.length) {
              this.options.signatures = [];
          } else {
              this.options.signatures = this.signatures;
          }
      }
  },
  watch: {
      options: {
        handler: function(val) {
          this.$emit('unsaved', val);
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
            display: inline-block;
        }
        button.inline {
            display: inline-block;
        }
        .option-group {
            margin-bottom: 1.5rem;
            div {
                margin-bottom: 0.2rem;
                label {
                    margin-left: 0.5rem;
                }
            }
            .preset-buttons {
                > button {
                    display: inline-block;
                }
                .preset-sub-buttons {
                    > div {
                        display: inline-block;
                    }
                }
            }
            .spinner {
                margin-bottom: 3rem;
            }
        }
    }
    
}

</style>
