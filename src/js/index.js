import * as d3 from "d3";
import StateMachine from "javascript-state-machine/dist/state-machine";

var svg = d3.select('#main').append('svg');

var fsm = new StateMachine({
  init: 'solid',
  transitions: [
    { name: 'melt', from: 'solid', to: 'liquid' },
    { name: 'freeze', from: 'liquid', to: 'solid' }
  ],
  methods: {
    onInit: function() { console.log('I initialized'); },
    onMelt: function() { console.log('I melted'); },
    onFreeze: function() { console.log('I froze'); }
  }
});


