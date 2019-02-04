<template>
    <div>
        <transition name="fade">
            <div class="featured-table-container" v-if="hasFeaturedItems">
                <h4>Alternatively, start with a configuration:</h4>
                <div class="featured-table">
                    <div class="row thead">
                        <span class="cell">Configuration</span>
                        <span class="cell">Reference</span>
                        <span class="cell">Publication</span>
                        <span class="cell"></span>
                    </div>
                    <div v-for="item of listing" :key="item['Export Code']" class="row tbody">
                        <span class="cell">{{ item['Description'] }}</span>
                        <span class="cell">{{ item['Name'] }}</span>
                        <span class="cell publication">{{ item['Publication'] }}</span>
                        <span class="cell"><a class="go" :href="('/#export-' + item['Export Code'])">Go</a></span>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script>
import API from './../api.js';
import VSpinner from './VSpinner.vue';

export default {
  name: 'IntroFeatured',
  components: {
      VSpinner
  },
  data() {
      return {
          listing: []
      };
  },
  mounted() {
      API.fetchFeaturedListing().then((listing) => {
          this.listing = listing;
      });
  },
  computed: {
      hasFeaturedItems() {
          return (this.listing.length > 0);
      }
  }
}
</script>

<style scoped lang="scss">
@import './../style/variables.scss';
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.featured-table-container {
    margin-left: 2rem;
    margin-right: 2rem;
    box-sizing: border-box;
    h4 {
        padding: 0px 10px;
    }
    .featured-table {
        border: 0px solid black;
        width: 100%;
        display: table;
        .row  {
            display: table-row;

            &:nth-child(2n) {
                background-color: #f5f5f5;
            }
            .cell {
                display: table-cell;
                padding: 10px 10px;
            }
            &.tbody {
                .go {
                    text-decoration: none;
                    padding: 0.3rem;
                    border-radius: 0.2rem;
                    background-color: $color-lgreen;
                    color: $color-darkgray;
                    border: 1px solid $color-gray;
                }
                .publication {
                    font-style: italic;
                }
            }
            &.thead span {
                font-weight: bold;
            }
        }
    }
}
</style>
