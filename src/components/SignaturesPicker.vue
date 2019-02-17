<template>
    <div>
      <h3 class="signatures-title">Select signatures</h3>
      <span id="preset-source">
        <label>Filter signatures by source: </label>
        <select v-model="selectedCancerTypeMapGroup">
            <option value="*" :selected="'*' === selectedCancerTypeMapGroup ? 'selected' : ''">*</option>
            <option v-for="pctg in cancerTypeMapGroups" :key="pctg" :value="pctg" :selected="pctg === selectedCancerTypeMapGroup ? 'selected' : ''">{{ pctg }}</option>
        </select>
      </span>
      <span id="tricounts-source">
        <label>Trinucleotide normalization method: </label>
        <select v-model="selectedTricountsMethod">
            <option value="None" :selected="'None' === selectedTricountsMethod ? 'selected' : ''">None</option>
            <option v-for="tcm in tricountsMethods" :key="tcm" :value="tcm" :selected="tcm === selectedTricountsMethod ? 'selected' : ''">{{ tcm }}</option>
        </select>
      </span>
      <SignatureTooltip 
        :hoveredSignature="hoveredSignature" 
        :hoveredViewportX="hoveredViewportX"
        :hoveredViewportY="hoveredViewportY"
        :tricountsMethod="selectedTricountsMethod"
      />
      <div id="signaturePicker"></div>
      <VSpinner v-if="loading" class="spinner"/>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { mouse as d3_mouse, event as d3_event } from 'd3';
import { select as d3_select } from 'd3-selection';
import { scaleBand as d3_scaleBand } from 'd3-scale';
import { set as d3_set } from 'd3-collection';
import { axisTop as d3_axisTop, axisLeft as d3_axisLeft } from 'd3-axis';
import API from '../api.js';
import VSpinner from './VSpinner.vue';
import SignatureTooltip from './SignatureTooltip.vue';

export default {
  name: 'SignaturesPicker',
  props: ['selectedMapping'],
  components: {
    VSpinner,
    SignatureTooltip
  },
  data: function() {
      return {
          selectedCancerTypeMapGroup: "COSMIC",
          hasClicked: false,
          autoSelected: false,
          autoSelectedBy: null,
          cancerTypeMapGroups: [],
          tricountsMethods: [],
          selectedTricountsMethod: "None",
          loading: true,
          allSignaturesSbs: [],
          allSignaturesDbs: [],
          allSignaturesIndel: [],
          selectedSignaturesSbs: [],
          selectedSignaturesDbs: [],
          selectedSignaturesIndel: [],
          cancerTypeMap: [],
          highlightXScale: null,
          hoveredSignature: null,
          hoveredViewportX: null,
          hoveredViewportY: null,
          svg: null,
          margin: {
            top: 140,
            right: 30,
            bottom: 10,
            left: 150
          }
      };
  },
  mounted: function() {
        const vm = this;
        API.fetchDataListing().then((listing) => {
            vm.allSignaturesSbs = listing["signatures"].filter(el => el["mut_type"] === "SBS");
            vm.allSignaturesDbs = listing["signatures"].filter(el => el["mut_type"] === "DBS");
            vm.allSignaturesIndel = listing["signatures"].filter(el => el["mut_type"] === "INDEL");

            vm.cancerTypeMap = listing["cancer_type_map"];
            vm.cancerTypeMapGroups = d3_set(listing["signatures"].map(el => el["group"])).values();

            vm.tricountsMethods = listing["tricounts_methods"];
            
            vm.loading = false;

            vm.drawPlot();
        });
  },
  beforeDestroy() {
    this.removePlot();
  },
  watch: {
      windowWidth() {
        this.drawPlot();
      },
      selectedCancerTypeMapGroup(val) {
        this.drawPlot();
        this.$emit('choose-sig-group', val);
        this.tryToAutoSelect(this.selectedMapping);
      },
      selectedTricountsMethod(val) {
          this.$emit('choose-tricounts-method', val)
      },
      selectedSignaturesSbs(val) {
          this.$emit('choose-sbs', val)
      },
      selectedSignaturesDbs(val) {
          this.$emit('choose-dbs', val)
      },
      selectedSignaturesIndel(val) {
          this.$emit('choose-indel', val)
      },
      autoSelectedBy(val) {
          this.$emit('choose-auto-selected', val !== null);
      },
      selectedMapping(val) {
        this.tryToAutoSelect(val);
      },
      hasClicked(val) {
        if(val) {
          this.autoSelectedBy = null;
          this.updateHighlights();
        }
      }
  },
  computed: {
      filteredSignaturesSbs() {
        if(this.selectedCancerTypeMapGroup === "*") {
          return this.allSignaturesSbs;
        } else {
          return this.allSignaturesSbs.filter(el => el["group"] === this.selectedCancerTypeMapGroup);
        }
      },
      filteredSignaturesDbs() {
        if(this.selectedCancerTypeMapGroup === "*") {
          return this.allSignaturesDbs;
        } else {
          return this.allSignaturesDbs.filter(el => el["group"] === this.selectedCancerTypeMapGroup);
        }
      },
      filteredSignaturesIndel() {
        if(this.selectedCancerTypeMapGroup === "*") {
          return this.allSignaturesIndel;
        } else {
          return this.allSignaturesIndel.filter(el => el["group"] === this.selectedCancerTypeMapGroup);
        }
      },
      width: function() {
          return this.windowWidth*0.8 - this.margin.left - this.margin.right - 60;
      },
      ...mapGetters([
        'windowWidth'
      ])
  },
  methods: {
      tryToAutoSelect(val) {
        // Watch the selected cancer type (oncotree code) mapping object. 
        // Auto-select by this code if no signatures have been chosen yet.
        if(
          val !== null && !this.hasClicked
        ) {
          const ctSigsAll = this.cancerTypeMap
            .filter(el => el.group === val.sig_group && el.oncotree_code === val.oncotree_code)
            .map(el => this.getSignature(el.signature));
          
          const ctSigsSbsNames = ctSigsAll.filter((el) => el[1] === "SBS").map(el => el[0].id);
          const ctSigsDbsNames = ctSigsAll.filter((el) => el[1] === "DBS").map(el => el[0].id);
          const ctSigsIndelNames = ctSigsAll.filter((el) => el[1] === "INDEL").map(el => el[0].id);

          this.selectedSignaturesSbs = ctSigsSbsNames;
          this.selectedSignaturesDbs = ctSigsDbsNames;
          this.selectedSignaturesIndel = ctSigsIndelNames;
          this.autoSelectedBy = val;
          this.updateHighlights();
        } else if(val === null && !this.hasClicked) {
          this.selectedSignaturesSbs = [];
          this.selectedSignaturesDbs = [];
          this.selectedSignaturesIndel = [];
          this.autoSelectedBy = null;
          this.updateHighlights();
        }
      },
      getSignature(name) {
        let sig;
        sig = this.allSignaturesSbs.find(el => el.id === name);
        if(sig !== undefined) {
          return [sig, "SBS"];
        }
        sig = this.allSignaturesDbs.find(el => el.id === name);
        if(sig !== undefined) {
          return [sig, "DBS"];
        }
        sig = this.allSignaturesIndel.find(el => el.id === name);
        if(sig !== undefined) {
          return [sig, "INDEL"];
        }
      },
      toggleSignature(name) {
        let [foundSig, foundSigType] = this.getSignature(name);

        let mapping = {
          "SBS": "selectedSignaturesSbs",
          "DBS": "selectedSignaturesDbs",
          "INDEL": "selectedSignaturesIndel"
        }
        for(let sigType of Object.keys(mapping)) {
          if(sigType === foundSigType) {
            let index = this[mapping[sigType]].findIndex((el) => el === name);
            if(index === -1) {
              this[mapping[sigType]].push(name);
              this[mapping[sigType]].sort((a, b) => {
                let aVal = this.getSignature(a)[0]["index"];
                let bVal = this.getSignature(b)[0]["index"];
                return aVal - bVal;
              });
            } else {
              this[mapping[sigType]].splice(index, 1);
            }
            return;
          }
        }
      },
      updateHighlights: function() {
        const vm = this;
        const sigNamesSelected = vm.selectedSignaturesSbs
          .concat(vm.selectedSignaturesDbs)
          .concat(vm.selectedSignaturesIndel);
        
        d3_select("#signaturePicker")
          .select("svg")
          .selectAll(".signatureRow")
          .select("rect")
          .attr("fill", (d, i) => {
            if(sigNamesSelected.includes(d)) {
              return "green";
            } else {
              return (i % 2 == 0 ? "#fff" : "#FFF");
            }
          })
        d3_select("#signaturePicker")
          .select("svg")
          .select(".signatureAxis")
          .selectAll("text")
          .attr("font-weight", (d, i) => {
            if(sigNamesSelected.includes(d)) {
              return "bold";
            } else {
              return "normal";
            }
          })


          if(this.autoSelectedBy !== null && this.highlightXScale !== null && this.autoSelectedBy.sig_group === this.selectedCancerTypeMapGroup) {
            let autoSelectedCode = this.autoSelectedBy.oncotree_code;
            let autoSelectedCancerType = this.cancerTypeMap.find(el => el.oncotree_code === autoSelectedCode).cancer_type;
            d3_select("#signaturePicker .cancer-type-highlight").select("rect")
              .attr("fill-opacity", 0.5)
              .attr("x", this.highlightXScale(autoSelectedCancerType));
          } else {
            d3_select("#signaturePicker .cancer-type-highlight").select("rect")
              .attr("fill-opacity", 0);
          }
      },
      removePlot: function() {
        d3_select("#signaturePicker").select("svg").remove();
      },
      drawPlot: function () {
            const vm = this;
            vm.removePlot();

            const rowHeight = 11;

            const filteredCancerTypeMap = vm.cancerTypeMap
              .filter(el => el["group"] === vm.selectedCancerTypeMapGroup)
            
            const cancerTypes = d3_set(filteredCancerTypeMap
              .map(el => el["cancer_type"])
            ).values();

            const x = d3_scaleBand()
              .domain(cancerTypes)
              .range([0, vm.width]);

            this.highlightXScale = x;

            const sigNamesSbs = vm.filteredSignaturesSbs.map((el) => el.id);
            const sigNamesDbs = vm.filteredSignaturesDbs.map((el) => el.id);
            const sigNamesIndel = vm.filteredSignaturesIndel.map((el) => el.id);

            const sigNames = sigNamesSbs.concat(sigNamesDbs).concat(sigNamesIndel);
            
            const totalNumSigs = sigNames.length;
            const totalHeight = totalNumSigs * rowHeight;

           
            const y = d3_scaleBand()
              .domain(sigNames)
              .range([0, totalHeight]);
            

            // append svg
            vm.svg = d3_select("#signaturePicker")
              .append("svg")
              .attr("width", this.width + this.margin.left + this.margin.right)
              .attr("height", totalHeight + this.margin.top + this.margin.bottom)
              .append("g")
              .attr("transform",
                  "translate(" + vm.margin.left + "," + vm.margin.top + ")");
            
            const container = vm.svg.append("g");

            const sigRows = container.selectAll(".signatureRow")
                .data(sigNames)
            .enter().append("g")
                .attr("class", "signatureRow");
            
            sigRows.append("rect")
              .style("cursor", "pointer")
              .attr("width", vm.width)
              .attr("height", rowHeight)
              .attr("x", 0)
              .attr("y", (d) => y(d))
              .attr("fill-opacity", 0.2)
              .on("click", (d) => {
                vm.toggleSignature(d);
                vm.updateHighlights();
                vm.hasClicked = true;
                // TODO: emit
              });
            
            container.selectAll(".signatureCell")
                .data(filteredCancerTypeMap)
            .enter().append("rect")
                .style("pointer-events", "none")
                .attr("class", "signatureCell")
                .attr("width", Math.max(x.bandwidth() - 4, 1))
                .attr("height", rowHeight - 4)
                .attr("x", (d) => x(d["cancer_type"]) + 2)
                .attr("y", (d) => y(d["signature"]) + 2)
                .attr("fill", "dimgray");
            
            const highlightY = container.append("g")
              .append("rect")
                .style("pointer-events", "none")
                .attr("width", vm.width)
                .attr("height", rowHeight)
                .attr("x", 0)
                .attr("y", 0)
                .attr("fill-opacity", 0)
                .attr("fill", "yellow");
            
            const highlightX = container.append("g")
              .attr("class", "cancer-type-highlight")
              .append("rect")
                .style("pointer-events", "none")
                .attr("width", x.bandwidth())
                .attr("height", totalHeight)
                .attr("x", 0)
                .attr("y", 0)
                .attr("fill-opacity", 0)
                .attr("fill", "yellow");
            
            sigRows.on("mouseover", (d) => {
              highlightY
                .attr("fill-opacity", 0.5)
                .attr("y", y(d));
              this.hoveredSignature = d;
              this.hoveredViewportX = d3_event.clientX;
              this.hoveredViewportY = d3_event.clientY;
            });

            container.on("mouseleave", (d) => {
              highlightY
                .attr("fill-opacity", 0);
              this.hoveredSignature = null;
              this.hoveredViewportX = null;
              this.hoveredViewportY = null;
            });

            
            // x-axis
            const xAxis = vm.svg.append("g");
            xAxis.call(d3_axisTop(x).tickSizeOuter(0).tickSizeInner(4))
              .selectAll("text")	
                .style("text-anchor", "end")
                .style("cursor", "pointer")
                .attr("dx", "-0.6em")
                .attr("dy", "0.3em")
                .attr("transform", "rotate(45)")
                .on("click", (d) => {
                    const ctSigsAllNames = filteredCancerTypeMap.filter(el => el["cancer_type"] === d).map(el => el["signature"]);
                    const ctSigsAll = ctSigsAllNames.map((name) => vm.getSignature(name));

                    const ctSigsSbsNames = ctSigsAll.filter((el) => el[1] === "SBS").map(el => el[0].id);
                    const ctSigsDbsNames = ctSigsAll.filter((el) => el[1] === "DBS").map(el => el[0].id);
                    const ctSigsIndelNames = ctSigsAll.filter((el) => el[1] === "INDEL").map(el => el[0].id);

                    vm.selectedSignaturesSbs = ctSigsSbsNames;
                    vm.selectedSignaturesDbs = ctSigsDbsNames;
                    vm.selectedSignaturesIndel = ctSigsIndelNames;
                    vm.updateHighlights();
                    vm.hasClicked = true;
                })
                .on("mouseover", (d) => {
                    highlightX
                      .attr("fill-opacity", 0.5)
                      .attr("x", x(d));
                })
                .on("mouseleave", () => {
                    highlightX
                      .attr("fill-opacity", 0);
                });
            
            // y-axis
            const yAxis = vm.svg.append("g")
              .attr("class", "signatureAxis");
            yAxis.call(d3_axisLeft(y).tickSizeOuter(0))
              .selectAll("text")	
                .style("cursor", "pointer")
                .on("click", (d) => {
                  vm.toggleSignature(d);
                  vm.updateHighlights();
                  // TODO: emit
                  vm.hasClicked = true;
                })
                .on("mouseover", (d) => {
                    highlightY
                      .attr("fill-opacity", 0.5)
                      .attr("y", y(d));
                })
                .on("mouseleave", () => {
                    highlightY
                      .attr("fill-opacity", 0);
                });

            vm.updateHighlights();
            
      }
  }
}
</script>

<style scoped lang="scss">
@import './../style/variables.scss';
.signatures-title {
  margin-bottom: 5px;
}
#tricounts-source {
  float: right;
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

</style>
