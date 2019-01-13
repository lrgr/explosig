import * as d3 from 'd3';
import Vue from 'vue';
import store from './store';
import App from './components/App.vue';
import {
  PlotContainer,
  SortOptions,
  Axis,
  GenomeAxis,
  DendrogramAxis,
  StackedBarPlot,
  BarPlot,
  ScatterPlot,
  BoxPlot,
  MultiBoxPlot,
  TrackPlot,
  MultiTrackPlot,
  HierarchicalMultiTrackPlot,
  StratifiedBoxPlot,
  StratifiedScatterPlot,
  GenomeScatterPlot,
  GenomeTrackPlot,
  GenomeMultiTrackPlot,
  GenomeStackedBarPlot,
  CategoricalLegend,
  ContinuousLegend
} from 'vue-declarative-plots';

Vue.config.productionTip = false

Vue.component(PlotContainer.name, PlotContainer);
Vue.component(SortOptions.name, SortOptions);
Vue.component(Axis.name, Axis);
Vue.component(GenomeAxis.name, GenomeAxis);
Vue.component(DendrogramAxis.name, DendrogramAxis);
Vue.component(StackedBarPlot.name, StackedBarPlot);
Vue.component(BarPlot.name, BarPlot);
Vue.component(ScatterPlot.name, ScatterPlot);
Vue.component(BoxPlot.name, BoxPlot);
Vue.component(MultiBoxPlot.name, MultiBoxPlot);
Vue.component(TrackPlot.name, TrackPlot);
Vue.component(MultiTrackPlot.name, MultiTrackPlot);
Vue.component(HierarchicalMultiTrackPlot.name, HierarchicalMultiTrackPlot);
Vue.component(StratifiedBoxPlot.name, StratifiedBoxPlot);
Vue.component(StratifiedScatterPlot.name, StratifiedScatterPlot);
Vue.component(GenomeScatterPlot.name, GenomeScatterPlot);
Vue.component(GenomeTrackPlot.name, GenomeTrackPlot);
Vue.component(GenomeMultiTrackPlot.name, GenomeMultiTrackPlot);
Vue.component(GenomeStackedBarPlot.name, GenomeStackedBarPlot);
Vue.component(CategoricalLegend.name, CategoricalLegend);
Vue.component(ContinuousLegend.name, ContinuousLegend);

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')


