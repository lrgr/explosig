<template>
    <div class="sample-axis-num-samples-container">
        <div class="sample-axis-num-samples">
            {{ numSamples }} of {{ numSamplesTotal }}<br> Selected
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

let uuid = 0;
export default {
  name: 'NumSamples',
  beforeCreate() {
        this.uuid = this.$options.name + uuid.toString();
        uuid += 1;
  },
  data() {
      return {
          numSamples: 0,
          numSamplesTotal: 0
      };
  },
  mounted() {
      return this.getScale("sample_id").onUpdate(this.uuid, this.updateNumSamples);
  },
  methods: {
      updateNumSamples() {
        this.numSamples = this.getScale("sample_id").domainFiltered.length;
        this.numSamplesTotal = this.getScale("sample_id").domain.length;
      }
  },
  computed: {
      ...mapGetters([
          'getScale'
      ])
  }
}
</script>

<style scoped lang="scss">
@import './../style/variables.scss';
.sample-axis-num-samples-container {
    position: relative;
    .sample-axis-num-samples {
        width: 130px;
        position: absolute;
        margin-top: 35px;
        padding-left: 10px;
        text-align: right;
        font-size: 12px;
        z-index: 2;

    }
}

</style>
