<script>
import { mapGetters } from 'vuex';
import { ResizeObserver } from 'vue-resize';
import debounce from 'lodash/debounce';

/**
 * Function that takes in array of VNodes and adds props from a provided props object.
 * @private
 * @param {array} slotArray Array of named slot VNodes.
 * @param {object} newProps Object mapping prop keys to values.
 * @return {array} The updated array of VNode with the added props.
 */
const addProp = function(slotArray, newProps) {
    if (slotArray) {
        slotArray = slotArray.map((vnode) => {
            if (vnode.componentOptions && vnode.componentOptions.propsData) {
                const newNode = vnode;
                for(let propName of Object.keys(newProps)) {
                    newNode.componentOptions.propsData[propName] = newProps[propName];
                }
                return newNode;
            }
            return vnode;
        });
        return slotArray
    }
    return [];
}
/**
 * This component is a container for a vue-declarative-plots PlotContainer component,
 * to make it vertically resizable.
 * Using the plotCode prop, it will check the current object of sizes for an existing pHeight prop.
 *  - If no pHeight is found in the Sizes object, it will use the passed pHeight.
 * When vertically resized, this component will managing updating the pHeight in the Sizes object,
 *  associating it with the plotCode key.
 * @prop {string} plotCode A unique code for this container
 * @prop {number} pWidth The plot width.
 * @prop {number} pHeight The plot height.
 * @prop {number} pMarginTop The plot top margin.
 * @prop {number} pMarginLeft The plot left margin.
 * @prop {number} pMarginRight The plot right margin.
 * @prop {number} pMarginBottom The plot bottom margin.
 * 
 */
export default {
    name: 'ResizablePlotContainer',
    props: {
        'plotCode': {
            type: String
        },
        'pWidth': {
            type: Number
        },
        'pHeight': {
            type: Number
        },
        'pMarginTop': {
            type: Number
        },
        'pMarginLeft': {
            type: Number
        },
        'pMarginRight': {
            type: Number
        },
        'pMarginBottom': {
            type: Number
        }
    },
    data() {
        return {
            currPlotHeight: 0,
            initialKey: 1
        }
    },
    created() {
        // Check for existing pHeight
        let props = Object.assign({}, this.$props);
        let pHeight = this.pHeight;
        let currPlotHeights = this.getSizes().plotHeights;
        if(currPlotHeights.hasOwnProperty(this.plotCode)) {
            pHeight = currPlotHeights[this.plotCode];
        } else {
            this.getSizes().updatePlotHeights({ [this.plotCode]: pHeight, ...currPlotHeights });
        }
        this.currPlotHeight = pHeight;
    },
    computed: {
        ...mapGetters([
            'getSizes'
        ])
    },
    methods: {
        resizeHandler() {
            let totalHeight = this.$el.offsetHeight;
            let pHeight = Math.max(0, totalHeight - this.pMarginTop - this.pMarginBottom - 6);
            this.currPlotHeight = pHeight;

            let currPlotHeights = Object.assign({}, this.getSizes().plotHeights);
            currPlotHeights[this.plotCode] = pHeight;
            this.getSizes().updatePlotHeights(currPlotHeights);

            this.rerender();
        },
        rerender() {
            this.initialKey++;
        },
        download() {
            return this.$slots.inner[0].componentInstance.download();
        }
    },
    render(h) {
        // Check for existing pHeight
        let pHeight = this.currPlotHeight;
        let props = Object.assign({}, this.$props);
        props["pHeight"] = pHeight;
        this.$slots.inner = addProp(this.$slots.inner, props);

        
        let children = ([]).concat(
            h('div', { key: this.initialKey }, this.$slots.inner), 
            h(ResizeObserver, {
                on: {
                    notify: this.resizeHandler
                }
            })
        );
        
        let classes = ['plot-container-resizable'];
        let styles = {
            width: (this.pMarginLeft + this.pWidth + this.pMarginRight) + 'px',
            height: (this.pMarginTop + pHeight + this.pMarginBottom + 6) + 'px'
        };
        return h('div', { class: classes, style: styles }, children);
    }
}
</script>

<style lang="scss">
.plot-container-resizable {
    box-sizing: border-box;
    resize: vertical;
    overflow-y: auto;
    overflow-x: hidden;
    position: relative;
}

.explorer-main {
    .plot-container-resizable {
        z-index: 6;
        .vdp-tooltip {
            z-index: 106;
        }
    }
}
.explorer-overview {
    .plot-container-resizable {
        z-index: 5;
        .vdp-tooltip {
            z-index: 105;
        }
    }
}
</style>