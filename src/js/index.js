import * as d3 from 'd3';

const DATA_DIR = 'data';

class App {
  constructor(props) {
    this.data = null;
    this.margin = {
      top: 20,
      right: 20,
      bottom: 30,
      left: 40
    };
    this.width = 900 - this.margin.left - this.margin.right;
    this.height = 500 - this.margin.top - this.margin.bottom;

    this.state = {
      cancerType: null,
      currentSig: 0,
      sigMethod: 'nmf',
      nSigs: 30,
      nl: 2,
      nr: 2,
      tsb: true,
      independence: false,
      showExposures: false
    };

    this.container = d3.select('#main');
    this.loadDataset();
  }
  getSignatureDataset() {
    return '/' + DATA_DIR + '/sigs/' + this.state.sigMethod + '/nmf.csv'; 
  }
  loadDataset() {
    var outer = this;
    d3.csv(this.getSignatureDataset(), function(row) {
      var r = {};
      for(var k in row) {
        r[k] = +row[k];
        if(isNaN(r[k])) {
          r[k] = row[k];
        }
      }
      return r;
    }, function(error, data) {
      outer.data = data;
      outer.render(); 
    });
  }
  getCurrentSigData() {
    return this.data[this.state.currentSig];
  }
  render() {
    var g = this.container.append("svg")
      .attr("width", this.width + this.margin.left + this.margin.right)
      .attr("height", this.height + this.margin.top + this.margin.bottom)
    .append("g")
      .attr("transform",
            "translate(" + this.margin.left + "," + this.margin.top + ")");

    var currentSig = this.getCurrentSigData(); 
    var currentSigData = Object.entries(currentSig);
    
    var x = d3.scaleBand()
      .range([0, this.width])
      .padding(0.1);

    var y = d3.scaleLinear()
      .range([this.height, 0]);

    x.domain(currentSigData.map((d) => { return d[0]; }));
    y.domain([0, d3.max(currentSigData, (d) => { return d[1]; }) ]);

    g.selectAll(".bar")
      .data(currentSigData)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", (d) => { return x(d[0]); })
      .attr("width", x.bandwidth())
      .attr("y", (d) => { return y(d[1]); })
      .attr("height", (d) => { return this.height - y(d[1]); });
    

    console.log(currentSig);
  }
}

var app = new App();



