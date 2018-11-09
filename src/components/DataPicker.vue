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
        </div>
        <div class="actions-bar">
            <VButton 
                @click="emitUpdate"
            >
                Update
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
import VButton from './VButton.vue';

export default {
  name: 'DataPicker',
  components: {
    SignaturesPicker,
    SamplesPicker,
    VButton
  },
  data: function() {
      return {
          innerDataPicker: null,
          chosenSignaturesSbs: [],
          chosenSignaturesDbs: [],
          chosenSignaturesIndel: [],
          chosenSamples: []
      };
  },
  computed: {
    samplesVisible: function() {
        return this.innerDataPicker == 'samples';
    },
    signaturesVisible: function() {
        return this.innerDataPicker == 'signatures';
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
    emitUpdate() {
        // Update samples/signatures in config
        this.getConfig().updateConfig(
            this.chosenSamples.slice(), 
            this.chosenSignaturesSbs.slice(), 
            this.chosenSignaturesDbs.slice(), 
            this.chosenSignaturesIndel.slice(), 
            [], 
            []
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
