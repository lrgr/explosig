<template>
    <div>
        <div id="inactivating-events-dropdown">
            <div class="dropdown-input-wrapper">
                <input 
                    type="text" 
                    placeholder="Gene" 
                    name="gene_id" 
                    autocomplete="off" 
                    v-model="geneInput"
                    @keydown.up="geneAutocompleteDec"
                    @keydown.down="geneAutocompleteInc"
                    @keyup.enter="geneAutocompleteEnter"
                    @keyup.escape="reset"
                    />
            </div>
            <div>
                <span 
                    v-for="(geneId, index) in geneAutocompleteList" 
                    :key="geneId" 
                    :class="[index === geneAutocompleteIndex ? 'selected-gene' : '']"
                    @click="geneAutocompleteSelect(geneId)"
                    @mouseover="geneAutocompleteIndex = index"
                >
                    {{ geneId }}
                </span>
            </div>
        </div>
    </div>
</template>

<script>
import API from './../api.js';
import { mapGetters } from 'vuex';

export default {
    name: 'GeneAutocomplete',
    props: ['submitGene', 'selectedSamples'],
    data: function () {
        return {
            geneInput: "",
            geneAutocompleteList: [],
            geneAutocompleteIndex: null
        };
    },
    computed: {
        ...mapGetters([
            'getConfig'
        ])
    },
    watch: {
        geneInput: function(val) {
            if(val.length >= 1) {
                API.fetchAutocompleteGene(val, this.selectedSamples)
                    .then((geneArray) => {
                        let oldListLength = this.geneAutocompleteList.length;
                        this.geneAutocompleteList = geneArray;
                        if(this.geneAutocompleteList.length === 0) {
                            this.geneAutocompleteIndex = null;
                        } else {
                            if(this.geneAutocompleteIndex === null) {
                                this.geneAutocompleteIndex = 0;
                            } else if(this.geneAutocompleteList.length < oldListLength && this.geneAutocompleteIndex >= this.geneAutocompleteList.length) {
                                this.geneAutocompleteIndex = this.geneAutocompleteList.length - 1;
                            }
                        }
                    });
            }
        },
    },
    methods: {
        reset() {
            this.geneAutocompleteList = [];
            this.geneAutocompleteIndex = null;
            this.geneInput = "";
        },
        geneAutocompleteInc(event) {
            event.preventDefault()
            if(this.geneAutocompleteIndex < (this.geneAutocompleteList.length - 1)) {
                this.geneAutocompleteIndex += 1;
            }
        },
        geneAutocompleteDec(event) {
            event.preventDefault()
            if(this.geneAutocompleteIndex > 0) {
                this.geneAutocompleteIndex -= 1;
            }
        },
        geneAutocompleteEnter() {
            this.geneAutocompleteSelect(this.geneAutocompleteList[this.geneAutocompleteIndex]);
        },
        geneAutocompleteSelect(geneId) {
            this.submitGene(geneId)
            this.reset();
        }
    }
}
</script>

<style scoped lang="scss">

@import './../style/variables.scss';


#inactivating-events-button {
    position: relative;
    right: 0;
    text-align: right;
    button {
        margin-top: 0.5em;
        margin-right: 0.5em;
    }
}

#inactivating-events-dropdown {
    border-bottom: 1px solid gray;
    background-color: white;
    .dropdown-input-wrapper {
        padding: 0.5em;
    }
    div > span {
        display: block;
        padding: 0.5em;
        border-top: 1px solid #ddd;
        cursor: pointer;
        &.selected-gene {
            background-color: #ddd;
        }
    }
    input {
        position: relative;
    }
    button {
        padding: 2px 4px;
        position: relative;
    }
}


</style>
