<template>
    <div class="plot-options">
        <div v-show="signaturesVisible" class="main-options">
            <div class="main-options-left">
                <h3>Signatures</h3>
                <button class="inline" v-on:click="toggleSignatures()">Toggle All</button>
                <div class="option-group">
                    <div v-for="signature in signatures" :key="signature">
                        <input type="checkbox" :value="signature" :id="signature" name="signatures" v-model="options.signatures">
                        <label :for="signature">{{ signature }}</label>
                    </div>
                    <Spinner v-if="loading" class="spinner"></Spinner>
                </div>
            </div>
            <div class="main-options-right">
                <h3>Presets</h3>
                <div class="option-group">
                    <div v-for="preset in sigPresets" :key="preset.name" class="preset-buttons">
                        <p>{{ preset.name }}</p>
                        <div class="preset-sub-buttons">
                            <div v-for="cancerType in Object.keys(preset.preset)" :key="cancerType">
                                <button v-on:click="options.signatures = preset.preset[cancerType]">{{ cancerType }}</button>
                            </div>
                        </div>
                    </div>
                    <Spinner v-if="loading" class="spinner"></Spinner>
                </div>
            </div>
        </div>
        <div v-show="samplesVisible" class="main-options">
            <div class="main-options-left">
                <h3>Samples</h3>
                <button class="inline" v-on:click="toggleSources()">Toggle All</button>
                <div class="option-group">
                    <div v-for="source in sources" :key="source">
                        <input type="checkbox" :value="source" :id="source" name="sources" v-model="options.sources">
                        <label :for="source">{{ source }}</label>
                    </div>
                    <Spinner v-if="loading" class="spinner"></Spinner>
                </div>
            </div>
        </div>
        <div class="actions-bar">
            <span class="button button-secondary" v-on:click="emitUpdate()">Update</span>
            <span class="button" v-on:click="showSamples()" v-bind:class="{ 'button-selected': this.samplesVisible }">Samples</span>
            <span class="button" v-on:click="showSignatures()"  v-bind:class="{ 'button-selected': this.signaturesVisible }">Signatures</span>
        </div>
    </div>
</template>

<script>
import { DataOptionsBus, globalDataOptions } from './../buses/data-options-bus.js';
import Spinner from './Spinner.vue'
import API from './../api.js'

export default {
  name: 'DataPicker',
  components: {
    Spinner
  },
  data: function() {
      return {
          loading: true,
          signaturesVisible: true,
          samplesVisible: false,
          options: globalDataOptions,
          signatures: [],
          sources: [],
          sigPresets: []
      };
  },
  mounted: function() {
        var vm = this;
        API.fetchDataListing().then(function(listing) {
            vm.sources = listing.sources;
            vm.signatures = listing.sigs;
            vm.sigPresets = listing.sig_presets;
            vm.loading = false;
        });
  },
  methods: {
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
      },
      showSignatures: function() {
          this.signaturesVisible = true;
          this.samplesVisible = false;
      },
      showSamples: function() {
          this.signaturesVisible = false;
          this.samplesVisible = true;
      },
      emitUpdate: function() {
        DataOptionsBus.$emit('updateDataOptions');
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">

@import './../variables.scss';

.plot-options {
    display: flex;
    flex-direction: column;
    height: 100%;
   .main-options {
        flex-grow: 1;
        overflow-y: scroll;
        padding: 1rem;
        display: flex;
        flex-direction: row;
        .main-options-left, .main-options-right {
            flex-basis: 50%;
        }
        h3 {
            margin-right: 0.5rem;
            margin-bottom: 0.3rem;
            margin-top: 0.3rem;
            margin-left: 0rem;
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
                p {
                    text-transform: uppercase;
                    margin-bottom: 0;
                }
                .preset-sub-buttons {
                    padding-left: 1rem;
                    > div {
                        display: inline-block;
                        margin-right: 0.2rem;
                        button {
                            width: 80px;
                        }
                    }
                }
            }
            .spinner {
                margin-bottom: 3rem;
            }
        }
   }

   .actions-bar {
        padding: 1rem;
        .button {
            float: right;
            margin: 0rem 0rem 0rem 1rem;
        }
   }
    
}

</style>
