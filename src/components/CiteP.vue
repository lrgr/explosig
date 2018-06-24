<template>
    <span>[<span v-for="(num, index) in nums" :key="num"><a :href="'#bib-' + num ">{{ num }}</a><span v-if="index != nums.length-1">, </span></span>]</span>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'CiteP',
  props: ['code'],
  data: function() {
      return {
          nums: []
      };
  },
  computed: {
      ...mapGetters([
          'citationNumber'
      ])
  },
  mounted: function() {
      let codes = this.code.split(",");
      for(let code of codes) {
        this.$store.commit('addCitation', code);
        this.nums.push(this.citationNumber(code));
      }
      this.nums.sort();
  }
}
</script>

<style scoped lang="scss">

@import './../style/variables.scss';
a {
    text-decoration: none;
}

</style>
