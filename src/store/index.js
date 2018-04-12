import Vue from 'vue'
import Vuex from 'vuex'
import plotOptions from './modules/plotOptions'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    plotOptions
  }
})