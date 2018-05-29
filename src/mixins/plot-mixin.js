import { mapGetters } from 'vuex';

export default {
    props: ['plotID', 'showInfo'],
    data: function() {
        return {
            loading: false,
            plotData: null,
            svg: null,
            tooltipPosition: {
                left: null,
                top: null
            },
            options: {}
        };
    },
    computed: {
        plotElemID: function() {
            return 'plot_' + this.plotID;
        },
        plotSelector: function() {
            return "#" + this.plotElemID;
        },
        tooltipElemID: function() {
            return 'tooltip_' + this.plotID;
        },
        tooltipPositionAttribute: function() {
            if(this.tooltipPosition.left == null || this.tooltipPosition.top == null) {
                return 'display: none;';
            } else {
                return 'left: ' + this.tooltipPosition.left + 'px; top: ' + this.tooltipPosition.top + 'px;';
            }
        },
        ...mapGetters([
            'windowWidth',
            'selectedDatasets',
            'selectedSignatures',
            'selectedClinicalVariables',
            'selectedChromosome',
            'showAllChromosomes',
            'currentModeOptions'
        ])
    },
    watch: {
        windowWidth: function () {
            this.drawPlot();
        },
        options: {
            handler: function () {
                this.drawPlot();
            },
            deep: true
        }
    },
    methods: {
        tooltipHide: function() {
            this.tooltipPosition.left = null;
            this.tooltipPosition.top = null;
        },
        updatePlot: function() {
            // stub
        },
        drawPlot: function() {
            // stub
        }
    }
}