<template>
    <div>
        <SignaturesPicker v-show="signaturesVisible" @choose="updateSignatures" />
        <SamplesPicker v-show="samplesVisible" @choose="updateSamples" />
        <div class="actions-bar">
            <span class="button button-secondary" @click="$emit('update')">Update</span>
            <span class="button" v-on:click="setDataPicker('samples')" v-bind:class="{ 'button-selected': this.samplesVisible }">Samples</span>
            <span class="button" v-on:click="setDataPicker('signatures')"  v-bind:class="{ 'button-selected': this.signaturesVisible }">Signatures</span>
        </div>
    </div>
</template>

<script>
import SignaturesPicker from './SignaturesPicker.vue';
import SamplesPicker from './SamplesPicker.vue';

export default {
  name: 'DataPicker',
  components: {
    SignaturesPicker,
    SamplesPicker
  },
  data: function() {
      return {
          innerDataPicker: null,
          chosenSignatures: [],
          chosenSamples: []
      };
  },
  computed: {
      samplesVisible: function() {
          return this.innerDataPicker == 'samples';
      },
      signaturesVisible: function() {
          return this.innerDataPicker == 'signatures';
      }
  },
  methods: {
      setDataPicker(selection) {
          this.innerDataPicker = selection;
      },
      updateSignatures() {

      },
      updateSamples() {
          
      }
  }
}
</script>

<style scoped lang="scss">

@import './../style/variables.scss';

.actions-bar {
    padding: 1rem;
    .button {
        float: right;
        margin: 0rem 0rem 0rem 1rem;
    }
}

</style>
