<template>
    <div class="plot-options">
        <div v-show="signaturesVisible" class="main-options">
            <div class="main-options-left">
                <h3>Signatures</h3>
                <button class="inline" v-on:click="toggleSignatures()">Toggle All</button>
                <div class="option-group">
                    <div v-for="signature in sortedSignatures" :key="signature.name" class="tooltip">
                        <input type="checkbox" :value="signature.name" :id="signature.name" name="signatures" v-model="options.signatures">
                        <label :for="signature.name" :data-tooltip="signature.description + ' (' + signature.publication + ')'">{{ signature.name }}</label>
                    </div>
                    <Spinner v-if="loading" class="spinner"></Spinner>
                </div>
            </div>
            <div class="main-options-right">
                <h3>Per-Cancer Presets</h3>
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
            <div>
                <h3>Samples</h3>
                <button class="inline" v-on:click="toggleSources()">Toggle All</button>
                <div class="option-group">
                    <table>
                    <tr v-for="(sourceData, sourceName) in sources" :key="sourceName">
                        <td>
                        <input type="checkbox" :value="sourceName" :id="sourceName" name="sources" v-model="options.sources">
                        <label :for="sourceName">{{ sourceName }}</label>
                        </td>
                        <td class="cell-gray">{{ sourceData.name }}</td>
                        <td class="cell-gray">({{ sourceData.num_donors }} donors)</td>
                    </tr>
                    </table>
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
import { DataOptionsBus, globalDataOptions, globalMeta } from './../buses/data-options-bus.js';
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
          meta: globalMeta,
          signatures: {},
          sources: {},
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
            
            // Convert signatures object to array, sort by index, save to global variable
            var sigArray = [];
            let sigNames = Object.keys(listing.sigs);
            for(var i = 0; i < sigNames.length; i++) {
                var sig = listing.sigs[sigNames[i]];
                sig['name'] = sigNames[i];
                sigArray.push(sig);
            }
            sigArray = sigArray.sort((a, b) => (a.index - b.index));
            vm.meta['signatures'] = sigArray;
        });
  },
  computed: {
      sortedSignatures: function() {
        return this.meta['signatures'];
      }
  },
  methods: {
      toggleSources: function() {
          if(this.options.sources.length == Object.keys(this.sources).length) {
              this.options.sources = [];
          } else {
              this.options.sources = Object.keys(this.sources);
          }
      },
      toggleSignatures: function() {
          if(this.options.signatures.length == Object.keys(this.signatures).length) {
              this.options.signatures = [];
          } else {
              this.options.signatures = Object.keys(this.signatures);
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
        overflow-y: auto;
        padding: 1rem;
        display: flex;
        flex-direction: row;
        table, th, td {
            border: 0px solid black;
        }
        table {
            th, td {
                padding: 5px;
            }
            .cell-gray {
                color: $color-gray;
            }
            border-collapse: collapse;
        }
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


/* Add this attribute to the element that needs a tooltip */
[data-tooltip] {
  position: relative;
  z-index: 2;
  cursor: pointer;
}

/* Hide the tooltip content by default */
[data-tooltip]:before,
[data-tooltip]:after {
  visibility: hidden;
  opacity: 0;
  pointer-events: none;
}

/* Position tooltip above the element */
[data-tooltip]:before {
  position: absolute;
  top: 0%;
  left: 100%;
  margin-bottom: 5px;
  margin-left: 10px;
  padding: 7px;
  width: 360px;
  -webkit-border-radius: 3px;
  -moz-border-radius: 3px;
  border-radius: 3px;
  background-color: #000;
  background-color: hsla(0, 0%, 20%, 0.9);
  color: #fff;
  content: attr(data-tooltip);
  text-align: center;
  font-size: 14px;
  line-height: 1.2;
  display: inline-block;
}

/* Triangle hack to make tooltip look like a speech bubble */
[data-tooltip]:after {
  position: absolute;
  top: 6px;
  left: 100%;
  margin-left: 5px;
  width: 0;
  border-right: 5px solid #000;
  border-right: 5px solid hsla(0, 0%, 20%, 0.9);
  border-bottom: 5px solid transparent;
  border-top: 5px solid transparent;
  content: " ";
  font-size: 0;
  line-height: 0;
}

/* Show tooltip content on hover */
[data-tooltip]:hover:before,
[data-tooltip]:hover:after {
  visibility: visible;
  opacity: 1;
}

</style>
