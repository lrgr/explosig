<template>
    <div>
        <div :id="this.plotElemID" class="plot-component"></div>

        <div :id="this.tooltipElemID" class="tooltip" :style="this.tooltipPositionAttribute">
            <table>
                <tr v-if="tooltipInfo.type == 'signature'">
                    <th>Signature</th><td>{{ this.tooltipInfo.signature }}</td>
                </tr>
                <tr v-if="tooltipInfo.type == 'signature'">
                    <th>Exposure</th><td>{{ this.tooltipInfo.exposure }}</td>
                </tr>
                <tr v-if="tooltipInfo.type == 'clinical'">
                    <th>{{ tooltipInfo.clinicalKey }}</th><td>{{ tooltipInfo.clinicalValue }}</td>
                </tr>
            </table>
        </div>

        <div class="spinner-wrapper" v-if="loading">
            <Spinner class="spinner"></Spinner>
        </div>
        <div class="bottom-options">
            
        </div>

        <div class="plot-info" v-if="showInfo">
            <h3>Info</h3>
            <p>This plot displays exposures to selected signatures for the selected donor, along with clinical data such as alcohol and tobacco usage.</p>
        </div>
    </div>
</template>

<script>
import * as d3 from 'd3';
import plotMixin from './../../mixins/plot-mixin.js';
import API from './../../api.js';
import { getTranslation } from './../../helpers.js';
import { dispatch } from './plot-link.js';

// child components
import Spinner from './../Spinner.vue';

export default {
    name: 'SingleDonorExposuresPlot',
    mixins: [plotMixin],
    props: [],
    components: {
        Spinner
    },
    data: function () {
        return {
            margin: {
                top: 20,
                right: 30,
                bottom: 100,
                left: 90
            },
            tooltipInfo: {
                donorID: "",
                projID: "",
                type: "",
                signature: "",
                exposure: "",
                clinicalKey: "",
                clinicalValue: ""
            },
            options: {

            }
        };
    },
    computed: {
        height: function () {
            return 450 - this.margin.top - this.margin.bottom;
        },
        width: function() {
            return (this.windowWidth*0.8) - 40 - this.margin.left - this.margin.right;
        }
    },
    methods: {
        updatePlot: function () {
            let vm = this;
            vm.loading = true;
            let params = {
                "sources": vm.selectedDatasets,
                "signatures": vm.selectedSignatures
            };
            API.fetchSingleDonorExposures(params).then((data) => {
                vm.plotData = data;

                vm.drawPlot();
                vm.loading = false;

                vm.$store.dispatch('emitSignaturesLegend');
                vm.$store.dispatch('emitClinicalVariablesLegend');
            });
        },
        tooltip: function(signature, exposure, clinicalKey, clinicalValue) {
            if(signature != null || exposure != null) {
                this.tooltipInfo.type = 'signature';
                this.tooltipInfo.signature = signature || this.tooltipInfo.signature;
                this.tooltipInfo.exposure = exposure || this.tooltipInfo.exposure;
            } else if(clinicalKey != null || clinicalValue != null) {
                this.tooltipInfo.type = 'clinical';
                this.tooltipInfo.clinicalKey = clinicalKey;
                this.tooltipInfo.clinicalValue = clinicalValue;
            }
            this.tooltipPosition.left = d3.event.x;
            this.tooltipPosition.top = this.height + 30;
            
            dispatch.call("link-donor", null, this.tooltipInfo.donorID);
            dispatch.call("link-project", null, this.tooltipInfo.projID);
            dispatch.call("link-signature", null, this.tooltipInfo.signature);
        },
        tooltipDestroy: function() {
            this.tooltipHide();

            dispatch.call("link-donor-destroy");
        },
        drawPlot: function () {
            var vm = this;

            if(vm.plotData === null) {
                return;
            }
            
        }
    }
}
</script>

<style scoped lang="scss">

@import './../../variables.scss';
@import './plot-style.scss';

.plot-component {
    overflow-x: hidden;
    overflow-y: hidden;
}

.bottom-options {
    select:nth-of-type(2) {
        margin-right: 15px;
    }
}

</style>
