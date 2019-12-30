<script>
import { mapGetters } from 'vuex';

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
        return slotArray;
    }
    return [];
}

/**
 * This component is a container for a vueplotlib PlotContainer component,
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

        }
    },
    computed: {
        ...mapGetters([
            'getSizes'
        ])
    },
    methods: {

    },
    render(h) {
        let props = Object.assign({}, this.$props);
        this.$slots.inner = addProp(this.$slots.inner, props);
        
        let children = ([]).concat(
            h('div', {}, this.$slots.inner)
        );
        
        let classes = ['plot-container-resizable'];
        return h('div', { class: classes }, children);
    }
}
</script>

<style lang="scss">
.plot-container-resizable {
    box-sizing: border-box;
    overflow-y: hidden;
    overflow-x: hidden;
    position: relative;
}

.explorer-main {
    .plot-container-resizable {
        z-index: 5;
        .vdp-tooltip {
            z-index: 105;
        }
    }
    .plot-info {
        z-index: 6;
    }
}
.explorer-overview {
    .plot-container-resizable {
        z-index: 7;
        .vdp-tooltip {
            z-index: 106;
        }
    }
    .plot-info {
        z-index: 8;
    }
}
</style>