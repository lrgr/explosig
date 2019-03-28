<template>
    <div>
        <div class="data-picker-main" :style="{ 'height': (windowHeight*0.8 - 64) + 'px' }">
            <SignaturesPicker 
                v-show="signaturesVisible" 
                @choose-sbs="updateSignaturesSbs"
                @choose-dbs="updateSignaturesDbs"
                @choose-indel="updateSignaturesIndel"
                @choose-sig-group="updateSignaturesGroup"
                @choose-auto-selected="updateSignaturesAutoSelected"
                :selectedMapping="chosenSignaturesGroupMapping"
             />
            <SamplesPicker 
                v-show="samplesVisible" 
                @choose="updateSamples" 
                @choose-num="updateSamplesNum" 
                @choose-mappings="updateSamplesOncotreeMappings" 
                @choose-tricounts-method="updateTricountsMethod"
            />
            <GenesPicker 
                v-show="genesVisible" 
                @choose="updateGenes" 
                :selectedSamples="chosenSamples" 
            />
            <ClinicalPicker 
                v-show="clinicalVisible" 
                @choose="updateClinicalVariables" 
            />
        </div>
        <div class="actions-bar">
            <span class="action-text">
                {{ getSelectedText() }}
            </span>
            <VButton 
                @click="emitUpdate"
            >
                Update
            </VButton>
            <VButton 
                @click="setDataPicker('clinical')" 
                :btn-secondary="true" 
                :btn-selected="this.clinicalVisible"
            >
                Clinical
            </VButton>
            <VButton 
                @click="setDataPicker('genes')" 
                :btn-secondary="true" 
                :btn-selected="this.genesVisible"
            >
                Genes
            </VButton>
            <VButton 
                @click="setDataPicker('signatures')" 
                :btn-secondary="true" 
                :btn-selected="this.signaturesVisible"
            >
                Signatures
            </VButton>
            <VButton 
                @click="setDataPicker('samples')" 
                :btn-secondary="true" 
                :btn-selected="this.samplesVisible"
            >
                Samples
            </VButton>
            <div class="clearfix"></div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

import SignaturesPicker from './SignaturesPicker.vue';
import SamplesPicker from './SamplesPicker.vue';
import GenesPicker from './GenesPicker.vue';
import ClinicalPicker from './ClinicalPicker.vue';

import VButton from './VButton.vue';

export default {
  name: 'DataPicker',
  components: {
    SignaturesPicker,
    SamplesPicker,
    GenesPicker,
    ClinicalPicker,
    VButton
  },
  data: function() {
      return {
          innerDataPicker: null,
          chosenSignaturesSbs: [],
          chosenSignaturesDbs: [],
          chosenSignaturesIndel: [],
          chosenSignaturesGroup: "COSMIC",
          chosenSignaturesGroupMapping: null,
          chosenSignaturesAutoSelected: false,
          chosenTricountsMethod: "None",
          chosenSamples: [],
          chosenSamplesNum: 0,
          chosenGenes: [],
          chosenClinicalVariables: []
      };
  },
  computed: {
    samplesVisible: function() {
        return this.innerDataPicker == 'samples';
    },
    signaturesVisible: function() {
        return this.innerDataPicker == 'signatures';
    },
    genesVisible: function() {
        return this.innerDataPicker == 'genes';
    },
    clinicalVisible: function() {
        return this.innerDataPicker == 'clinical';
    },
    ...mapGetters([
        'windowHeight',
        'getConfig'
    ])
  },
  methods: {
    setDataPicker(selection) {
        this.innerDataPicker = selection;
    },
    updateSignaturesSbs(chosenSignatures) {
        this.chosenSignaturesSbs = chosenSignatures;
    },
    updateSignaturesDbs(chosenSignatures) {
        this.chosenSignaturesDbs = chosenSignatures;
    },
    updateSignaturesIndel(chosenSignatures) {
        this.chosenSignaturesIndel = chosenSignatures;
    },
    updateSamples(chosenSamples) {
        this.chosenSamples = chosenSamples;
    },
    updateSamplesNum(chosenSamplesNum) {
        this.chosenSamplesNum = chosenSamplesNum;
    },
    updateSamplesOncotreeMappings(chosenSamplesOncotreeMappings) {
        // Filter by the currently-selected "signature group" e.g. COSMIC
        // Then, if only one oncotree code mapping exists for the selected projects, 
        // set the chosenSignaturesGroupMapping code to that single mapping.
        let singleMapping = undefined;
        let groupMappings = chosenSamplesOncotreeMappings.filter(el => el.sig_group === this.chosenSignaturesGroup);
        for(let mapping of groupMappings) {
            if(singleMapping === undefined || singleMapping.oncotree_code === mapping.oncotree_code) {
                singleMapping = mapping;
            } else {
                this.chosenSignaturesGroupMapping = null;
                return;
            }
        }
        if(singleMapping !== undefined) {
            this.chosenSignaturesGroupMapping = singleMapping;
        } else {
            this.chosenSignaturesGroupMapping = null;
        }
    },
    updateSignaturesGroup(chosenSignaturesGroup) {
        this.chosenSignaturesGroup = chosenSignaturesGroup;
    },
    updateSignaturesAutoSelected(chosenSignaturesAutoSelected) {
        this.chosenSignaturesAutoSelected = chosenSignaturesAutoSelected;
    },
    updateGenes(chosenGenes) {
        this.chosenGenes = chosenGenes;
    },
    updateClinicalVariables(chosenClinicalVariables) {
        this.chosenClinicalVariables = chosenClinicalVariables;
    },
    updateTricountsMethod(chosenTricountsMethod) {
        this.chosenTricountsMethod = chosenTricountsMethod;
    },
    emitUpdate() {
        // Update samples/signatures in config
        this.getConfig().updateConfig(
            this.chosenSamples.slice(), 
            this.chosenSignaturesSbs.slice(), 
            this.chosenSignaturesDbs.slice(), 
            this.chosenSignaturesIndel.slice(), 
            this.chosenGenes.slice(), 
            this.chosenClinicalVariables.slice(),
            this.chosenTricountsMethod
        );
        // Notify parent to close modal
        this.$emit('update');
    },
    getSelectedText() {
        if(this.samplesVisible) {
            return (this.chosenSamples.length  + ' stud' + (this.chosenSamples.length === 1 ? 'y' : 'ies') + ' selected (' + this.chosenSamplesNum + ' samples)');
        }
        if(this.signaturesVisible) {
            let totalSignatures = (this.chosenSignaturesSbs.length + this.chosenSignaturesDbs.length + this.chosenSignaturesIndel.length);
            return totalSignatures + ' signature' + (totalSignatures === 1 ? '' : 's') + ' ' + (this.chosenSignaturesAutoSelected ? 'auto-' : '') + 'selected (' + this.chosenSignaturesSbs.length + ' SBS, ' + this.chosenSignaturesDbs.length + ' DBS, ' + this.chosenSignaturesIndel.length  + ' INDEL)';
        }
        return '';
    }
  }
}
</script>

<style scoped lang="scss">
@import './../style/variables.scss';
.data-picker-main {
    padding: 0 1rem;
    overflow-y: scroll;
}
.actions-bar {
    padding: 1rem;
    .btn {
        float: right;
        margin: 0rem 0rem 0rem 1rem;
    }
}

@media (max-width: 1015px) {
  .actions-bar {
    .action-text {
        font-size: 14px;
    }
    .btn {
        margin: 0rem 0rem 0rem 0.3rem;
        font-size: 11px;
    }
  }
}

@media (max-width: 700px) {
  .actions-bar {
    .action-text {
        display: none;
    }
  }
}

@media (max-width: 490px) {
  .actions-bar {
    .btn {
        margin: 0rem 0rem 0rem 0.1rem;
        font-size: 11px;
    }
  }
}

</style>
