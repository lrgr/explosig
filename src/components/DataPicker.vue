<template>
    <div>
        <div class="data-picker-main" :style="{ 'height': (windowHeight*0.8 - 64) + 'px' }">
            <SignaturesPicker 
                v-show="signaturesVisible" 
                @choose-sbs="updateSignaturesSbs"
                @choose-dbs="updateSignaturesDbs"
                @choose-indel="updateSignaturesIndel"
             />
            <SamplesPicker v-show="samplesVisible" @choose="updateSamples" />
            <GenesPicker v-show="genesVisible" @choose="updateGenes" />
            <ClinicalPicker v-show="clinicalVisible" @choose="updateClinicalVariables" />
        </div>
        <div class="actions-bar">
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
                @click="setDataPicker('samples')" 
                :btn-secondary="true" 
                :btn-selected="this.samplesVisible"
            >
                Samples
            </VButton>
            <VButton 
                @click="setDataPicker('signatures')" 
                :btn-secondary="true" 
                :btn-selected="this.signaturesVisible"
            >
                Signatures
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
          chosenSamples: [],
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
    updateGenes(chosenGenes) {
        this.chosenGenes = chosenGenes;
    },
    updateClinicalVariables(chosenClinicalVariables) {
        this.chosenClinicalVariables = chosenClinicalVariables;
    },
    emitUpdate() {
        // Update samples/signatures in config
        this.getConfig().updateConfig(
            this.chosenSamples.slice(), 
            this.chosenSignaturesSbs.slice(), 
            this.chosenSignaturesDbs.slice(), 
            this.chosenSignaturesIndel.slice(), 
            this.chosenGenes.slice(), 
            this.chosenClinicalVariables.slice()
        );
        // Notify parent to close modal
        this.$emit('update');
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

</style>
