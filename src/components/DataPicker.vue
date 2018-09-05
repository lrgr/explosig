<template>
    <div class="plot-options">
        <div v-show="signaturesVisible" class="main-options">
            <div class="option-group">
                <h3>Signatures</h3>
                <button class="inline" v-on:click="toggleSignatures()">Toggle All</button>
                <span id="preset-source">
                    <label>Source: </label>
                    <select v-model="options.signatureGroup">
                        <option 
                            v-for="sigGroup in signatureGroups" 
                            :key="sigGroup.id" 
                            :value="sigGroup.id" 
                            :selected="sigGroup.id == options.signatureGroup.id ? 'selected' : ''"
                        >
                            {{ sigGroup.name }}
                        </option>
                    </select>
                </span>
                <div id="signaturePicker" v-show="!loading">
                    <div id="signaturePickerCheckboxes">
                        <div v-for="signature in allSignaturesFlat" :key="signature.name" class="tooltip" :style="{ height: rowHeight + 'px'}">
                            <label :for="signature.name" :data-tooltip="signature.description + ' (' + signature.publication + ')'" :style="{ lineHeight: rowHeight + 'px'}">{{ signature.name }}</label>
                            <input type="checkbox" :value="signature.name" :id="signature.name" name="signatures" v-model="options.signatures">
                        </div>
                    </div>
                    <!-- svg here -->
                </div>
                <Spinner v-if="loading" class="spinner"></Spinner>
            </div>
        </div>
        <div v-show="samplesVisible" class="main-options">
            <div>
                <h3>Samples</h3>
                <button class="inline" v-on:click="toggleSources()">Toggle All</button>
                <div class="option-group">
                    <table>
                    <tr v-for="(sourceData, sourceName) in allDatasets" :key="sourceName">
                        <td>
                        <input type="checkbox" :value="sourceName" :id="sourceName" name="sources" v-model="options.projects">
                        <label :for="sourceName" class="sample-label">{{ sourceName }}</label>
                        </td>
                        <td class="cell-gray">{{ sourceData.name }}</td>
                        <td class="cell-gray">({{ sourceData.numDonors }} donors)</td>
                    </tr>
                    </table>
                    <Spinner v-if="loading" class="spinner"></Spinner>
                </div>
            </div>
        </div>
        <div class="actions-bar">
            <span class="button button-secondary" v-on:click="emitUpdate()">Update</span>
            <span class="button" v-on:click="setDataPicker('samples')" v-bind:class="{ 'button-selected': this.samplesVisible }">Samples</span>
            <span class="button" v-on:click="setDataPicker('signatures')"  v-bind:class="{ 'button-selected': this.signaturesVisible }">Signatures</span>
        </div>
    </div>
</template>

<script>
import * as d3 from 'd3';
import { mapGetters } from 'vuex';
import { DataOptionsBus } from './../buses.js';
import API from './../api.js';
import { MUT_TYPES } from './../constants.js';

// child components
import Spinner from './Spinner.vue';

export default {
  name: 'DataPicker',
  components: {
    Spinner
  },
  data: function() {
      return {
          innerDataPicker: null,
          loading: true,
          options: {
            projects: [],
            signatures: [],
            signatureGroup: 'COSMIC'
          },
          rowHeight: 0,
          svg: null,
          margin: {
            top: 130,
            right: 30,
            bottom: 10,
            left: 100
          }
      };
  },
  mounted: function() {
        var vm = this;
        API.fetchDataListing().then(function(listing) {
            vm.$store.commit('setAllSignatures', listing['sigs']);
            vm.$store.commit('setAllDatasets', listing['projects']);
            vm.$store.commit('setSignatureGroups', listing['sigs_per_cancer_type']);

            vm.options.signatures = vm.selectedSignaturesFlat.map((el) => el.name);
            vm.options.projects = vm.selectedDatasets;
            
            vm.loading = false;

            vm.drawPlot();
        });
  },
  watch: {
      windowWidth: function () {
        this.drawPlot();
      },
      options: {
          deep: true,
          handler: function() {
              this.drawPlot();
          }
      }
  },
  computed: {
      samplesVisible: function() {
          return this.innerDataPicker == 'samples';
      },
      signaturesVisible: function() {
          return this.innerDataPicker == 'signatures';
      },
      height: function () {
        return 604 - this.margin.top - this.margin.bottom;
      },
      width: function() {
          return this.windowWidth*0.8 - this.margin.left - this.margin.right - 60;
      },
      ...mapGetters([
        'allSignatures',
        'allSignaturesFlat',
        'allDatasets',
        'signatureGroups',
        'selectedSignatures',
        'selectedSignaturesFlat',
        'selectedDatasets',
        'windowWidth'
      ])
  },
  methods: {
      toggleSources: function() {
          if(this.options.projects.length == Object.keys(this.allDatasets).length) {
              this.options.projects = [];
          } else {
              this.options.projects = Object.keys(this.allDatasets);
          }
      },
      toggleSignatures: function() {
        if(this.options.signatures.length == this.allSignaturesFlat.length) {
            this.options.signatures = [];
        } else {
            this.options.signatures = this.allSignaturesFlat.map((x) => x.name);
        }
      },
      setDataPicker: function(selection) {
          this.innerDataPicker = selection;
      },
      emitUpdate: function() {
        let signatures = this.options.signatures.map((sigName) => {
            return this.allSignaturesFlat.find(el => (el.name === sigName));
        })
        this.$store.commit('setSelectedSignaturesFlat', signatures);
        this.$store.commit('setSelectedDatasets', this.options.projects);
        DataOptionsBus.$emit('updateDataOptions');
      },
      drawPlot: function () {
            var vm = this;

            if(vm.signatureGroups.length == 0) {
                return;
            }


            var sigGroup = vm.signatureGroups.find((el) => (el.id == vm.options.signatureGroup));
            var cancerTypes = sigGroup.cancerTypes;
            
            let allSignaturesFlat = vm.allSignaturesFlat;
            let sigNames = allSignaturesFlat.map((el) => el.name);
            let cancerTypeNames = cancerTypes.map((el) => el.name);

            let mutTypeRowColors = {
                'SBS': '#8acb88',
                'DBS': '#3e6990',
                'INDEL': '#f39b6d'
            };


            // axis scales
            var x = d3.scaleBand()
                .domain(Array.from(Array(cancerTypeNames.length).keys()))
                .range([0, vm.width]);
            
            
            let yStep = 10.8888889;
            vm.rowHeight = yStep * 0.705;
            let totalHeight = yStep*sigNames.length;

            var y = d3.scaleBand()
                .domain(sigNames)
                .range([0, totalHeight]);

            // append svg
            d3.select("#signaturePicker").select("svg").remove();

            vm.svg = d3.select("#signaturePicker")
                .append("svg")
                .attr("width", this.width + this.margin.left + this.margin.right)
                .attr("height", totalHeight + this.margin.top + this.margin.bottom)
                .append("g")
                .attr("transform",
                    "translate(" + vm.margin.left + "," + vm.margin.top + ")");
            
            vm.svg.selectAll(".signatureRow")
                .data(allSignaturesFlat)
            .enter().append("g")
                .attr("class", "signatureRow")
                .append("rect")
                    .attr("width", vm.width)
                    .attr("height", yStep)
                    .attr("x", 0)
                    .attr("y", (d) => y(d.name))
                    .attr("fill", (d) => mutTypeRowColors[d.mutType])
                    .attr("fill-opacity", (d, i) => {
                        return (i % 2 == 0 ? 0.2 : 0);
                    });
            
            vm.svg.selectAll(".cancerTypeColumn")
                .data(cancerTypes)
            .enter().append("g")
                .attr("class", "cancerTypeColumn")
                .attr("transform", (d, i) => "translate(" + x(i) + ",0)")
                    .selectAll(".perCancerTypeCell")
                    .data((d) => d.signaturesFlat)
                .enter().append("rect")
                    .attr("class", "perCancerTypeCell")
                    .attr("x", 0)
                    .attr("width", x.step()-2)
                    .attr("height", yStep-2)
                    .attr("y", (d) => y(d))
                    .attr("fill", "#575761");

            // x Axis container
            let xAxis = vm.svg.append("g");
            
            // x Axis ticks
            xAxis.call(d3.axisTop(x).tickSizeOuter(0).tickSizeInner(4).tickFormat((d) => cancerTypeNames[d]))
                .selectAll("text")	
                    .style("text-anchor", "end")
                    .style("cursor", "pointer")
                    .attr("dx", "-0.6em")
                    .attr("dy", "0.3em")
                    .attr("transform", "rotate(45)")
                    .on("click", (d) => {
                        vm.options.signatures = cancerTypes[d].signaturesFlat;  
                    })
                    .on("mouseover", (d) => {
                        vm.svg.selectAll(".perCancerTypeCell")
                            .transition()
                                .attr("fill-opacity", 0.4);
                        d3.select(vm.svg.selectAll(".cancerTypeColumn").nodes()[d])
                            .selectAll(".perCancerTypeCell")
                            .transition()
                                .attr("fill-opacity", 1);
                    })
                    .on("mouseleave", () => {
                        vm.svg.selectAll(".perCancerTypeCell")
                            .transition()
                                .attr("fill-opacity", 1);
                    });
            
      }
  }
}
</script>

<style scoped lang="scss">

@import './../style/variables.scss';

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
        #preset-source {
            margin-left: 10px;
        }
        .sample-label {
            cursor: pointer;
        }
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
        h3 {
            margin-right: 0.5rem;
            margin-bottom: 0.3rem;
            margin-top: 0.3rem;
            margin-left: 0rem;
            display: inline-block;
        }
        #signaturePicker {
            position: relative;
            overflow-x: hidden;
            overflow-y: hidden;
            #signaturePickerCheckboxes {
                position: absolute;
                top: 125px;
                width: 100px;
                text-align: right;
                .tooltip {
                    label {
                        font-size: 11px;
                    }
                    input[type=checkbox] {
                        transform: scale(0.8);
                    }
                }
            }
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
  margin-left: 23px;
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
  white-space: normal;
}

/* Triangle hack to make tooltip look like a speech bubble */
[data-tooltip]:after {
  position: absolute;
  top: 3px;
  left: 100%;
  margin-left: 18px;
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
