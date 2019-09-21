<template>
    <div class="sig-tooltip" :style="tooltipPositionAttribute">
        <div v-if="sigInfo !== undefined">
            {{ sigInfo.id }} ({{ sigInfo.mut_type}})<br>
            <em>{{ sigInfo.publication }}</em><br>

            <PlotContainer :key="('sig_tooltip_' + sigTooltipKey)"
                :pWidth="(tooltipWidth-70-10)"
                :pHeight="100"
                :pMarginTop="15"
                :pMarginLeft="70"
                :pMarginRight="10"
                :pMarginBottom="15"
            >
                <Axis 
                    slot="axisLeft"
                    variable="probability"
                    side="left"
                    :disableBrushing="true"
                    :getScale="getScale"
                    :getStack="getStack"
                />
                <BarPlot 
                    slot="plot"
                    data="signature"
                    :x="('cat_'+sigInfo.mut_type)"
                    y="probability"
                    :getData="getData"
                    :getScale="getScale"
                />
            </PlotContainer>

            {{ sigInfo.description }}
        </div>
    </div>
</template>

<script>
import API from './../api.js';
import { mapGetters } from 'vuex';

import VSpinner from './VSpinner.vue';

import { HistoryStack, EVENT_TYPES, EVENT_SUBTYPE_RESETS } from 'vueplotlib';
import { CategoricalScale, ContinuousScale, GenomeScale, DataContainer } from 'vueplotlib';
import { 
    SBS_SUPERCAT_COLORS, DBS_SUPERCAT_COLORS, INDEL_SUPERCAT_COLORS,
    SBS_SUPERCAT_MAP, DBS_SUPERCAT_MAP, INDEL_SUPERCAT_MAP,
    SBS_CATS, DBS_CATS, INDEL_CATS,
    getCategoryColors
} from './../categories.js';

export default {
    name: 'SignatureTooltip',
    props: ['hoveredSignature', 'hoveredViewportX', 'hoveredViewportY', 'tricountsMethod'],
    components: {
        VSpinner,
    },
    data() {
        return {
            allSignatures: [],
            loading: true,
            sigTooltipKey: 1,
            plotData: {},
            plotScales: {},
            stack: null,
        };
    },
    mounted() {
        API.fetchDataListing().then((listing) => {
            this.allSignatures = listing["signatures"];
        });

        /* Contexts scales for reconstruction and signature plots */
        this.plotScales["cat_SBS"] = new CategoricalScale("cat_SBS", "SBS Mutation Category", SBS_CATS, undefined, getCategoryColors(SBS_CATS, SBS_SUPERCAT_MAP, SBS_SUPERCAT_COLORS));

        this.plotScales["cat_DBS"] = new CategoricalScale("cat_DBS", "DBS Mutation Category", DBS_CATS, undefined, getCategoryColors(DBS_CATS, DBS_SUPERCAT_MAP, DBS_SUPERCAT_COLORS));

        this.plotScales["cat_INDEL"] = new CategoricalScale("cat_INDEL", "INDEL Mutation Category", INDEL_CATS, undefined, getCategoryColors(INDEL_CATS, INDEL_SUPERCAT_MAP, INDEL_SUPERCAT_COLORS));

        this.plotScales["probability"] = new ContinuousScale("probability", "Probability", [0.0, 0.2]);

        this.initStack();
    },
    watch: {
        hoveredSignature() {
            this.rerender();
        }
    },
    computed: {
        sigInfo() {
            if(this.hoveredSignature !== null) {
                return this.allSignatures.find(el => el.id === this.hoveredSignature);
            }
            return undefined;
        },
        tooltipPositionAttribute: function() {
            if(this.hoveredViewportX === null || this.hoveredViewportY === null) {
                return 'display: none;';
            } else {
                let transformString = "transform: translate(10%, -50%);";
                if(this.hoveredViewportX > this.windowWidth/2) {
                    transformString = "transform: translate(-110%, -50%);";
                }
                return 'left: ' + this.hoveredViewportX + 'px; top: ' + this.hoveredViewportY + 'px; ' + transformString;
            }
        },
        tooltipWidth() {
            return (0.4 * this.windowWidth);
        },
        ...mapGetters([
            'windowWidth'
        ])
    },
    methods: {
        rerender() {
            let sigInfo = this.sigInfo;
            if(sigInfo !== undefined) {
                // set up scales and data
                this.plotData["signature"] = new DataContainer("signature", sigInfo.id, API.fetchPlotSignature({
                    "signature": sigInfo.id,
                    "signature_index": 'None',
                    "mut_type": sigInfo.mut_type,
                    "tricounts_method": (this.tricountsMethod || "None")
                }));
                this.sigTooltipKey++;
            }
        },
        getData(key) {
            return this.plotData[key];
        },
        getScale(key) {
            return this.plotScales[key];
        },
        getStack() {
            return this.stack;
        },
        initStack() {
            // Initialize the history stack
            const stack = new HistoryStack(
                {
                    [EVENT_TYPES.SCALE]: this.getScale,
                    [EVENT_TYPES.DATA]: this.getData
                }, 
                { 
                    ...EVENT_SUBTYPE_RESETS 
                }
            );
            this.stack = stack;
        }
    }
}
</script>

<style scoped lang="scss">
@import './../style/variables.scss';
@import './../style/modal.scss';

.sig-tooltip {
    width: 40%;
    position: fixed;
    border: 1px solid rgb(205, 205, 205);
    background-color: rgba(255, 255, 255, 0.97);
    z-index: 100;
    padding: 0.25rem;
    border-radius: 3px;
}

</style>
