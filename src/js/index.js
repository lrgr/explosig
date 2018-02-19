import * as d3 from 'd3';

const DATA_DIR = 'data';

function mod(n, m) {
  return ((n % m) + m) % m;
}

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
      showExposures: false,
      sigExpanded: false,
      showTooltip: true
    };

    this.container = d3.select('#main');
    this.loadDataset();
  }
  getSignatureDataset() {
    return './' + DATA_DIR + '/sigs/' + this.state.sigMethod + '/nmf.csv'; 
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
  getMutationTypes(currentSig) {
    var contextNames = Object.keys(currentSig);
    var mutationTypes = [];
    for(var contextName of contextNames) {
      var mutationType = contextName.substring(this.state.nl + 1, this.state.nl + 4);
      if(mutationTypes.length == 0) {
        mutationTypes.push([mutationType, 1]);
      } else {
        var previousType = mutationTypes[mutationTypes.length - 1][0];
        if(previousType == mutationType) {
          mutationTypes[mutationTypes.length - 1][1]++;
        } else {
          mutationTypes.push([mutationType, 1]);
        }
      }
    }
    return mutationTypes;
  }
  render() {

    var tooltip = d3.select("body").append("div")
      .attr("class", "tooltip");

    var outerG = this.container.append("svg")
      .attr("width", this.width + this.margin.left + this.margin.right)
      .attr("height", this.height + this.margin.top + this.margin.bottom)
    .append("g")
      .attr("transform",
            "translate(" + this.margin.left + "," + this.margin.top + ")");

    var g = outerG.append("g");

    var currentSig = this.getCurrentSigData(); 
    delete currentSig[""];
    var mutationTypes = this.getMutationTypes(currentSig);
    console.log(mutationTypes);
    var currentSigData = Object.entries(currentSig);
    
    var x = d3.scaleBand()
      .range([0, this.width]);

    var y = d3.scaleLinear()
      .range([this.height, 0]);

    x.domain(currentSigData.map((d) => { return d[0]; }));
    y.domain([0, d3.max(currentSigData, (d) => { return d[1]; }) ]);

    var mutationTypeGroups = g.selectAll(".mtype")
      .data(mutationTypes)
    .enter().append("g");
    
    mutationTypeGroups.append("rect")
      .attr("class", (_, i) => { return (i % 2 == 0 ? "mtype mtype-odd" : "mtype mtype-even"); })
      .attr("x", (d, i) => { return i * (d[1] * x.bandwidth()); })
      .attr("width", (d) => { return d[1] * x.bandwidth(); })
      .attr("y", 0)
      .attr("height", this.height);

    mutationTypeGroups.append("text")
      .text((d) => { return d[0]; })
      .attr("class", "mtype-text")
      .attr("text-anchor", "middle")
      .attr("x", (d, i) => { return i * (d[1] * x.bandwidth()) + (d[1] * x.bandwidth()/2); })
      .attr("y", this.height/2)
      .on("click", (click_d, click_i) => {
        
        var factor = 12;
        if(this.state.sigExpanded) {
          factor = 1;
          g.transition()
            .attr("transform", "");
        } else {
          g.transition()
            .attr("transform",
              "translate(-" + (click_i * click_d[1] * x.bandwidth() * 12) + ",0)");

        }

        g.selectAll(".bar")
          .transition()
          .attr("width", x.bandwidth() * factor)
          .attr("x", (d) => x(d[0]) * factor);
        
        g.selectAll(".mtype")
          .transition()
          .attr("width", (d) => d[1] * x.bandwidth() * factor)
          .attr("x", (d, i) => i * d[1] * x.bandwidth() * factor);
        g.selectAll(".mtype-text")
          .transition()
          .attr("x", (d, i) => i * (d[1] * x.bandwidth() * factor) + (d[1] * x.bandwidth() * factor / 2));

        this.state.sigExpanded = !this.state.sigExpanded;

      });

    g.selectAll(".bar")
      .data(currentSigData)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", (d) => { return x(d[0]); })
      .attr("width", x.bandwidth())
      .attr("y", (d) => { return y(d[1]); })
      .attr("height", (d) => { return this.height - y(d[1]); })
      .on("mouseover", (d) => {
        if(this.state.sigExpanded) {
          tooltip.html(d[0])
            .style("opacity", 0.9)
            .style("left", (d3.event.pageX + 11) + "px")
            .style("top", (d3.event.pageY) + "px");
        
          this.state.showTooltip = true;
        }
      })
      .on("mouseout", (d) => {
        this.state.showTooltip = false;
        setTimeout(() => {
          if(!this.state.showTooltip) {
            tooltip.style("opacity", 0); 
          }
        }, 400);
      });

    
    // append y axis
    outerG.append("g")
      .call(d3.axisLeft(y));

    console.log(currentSig);
  }
  nextSig() {
    this.changeSig(true);
  }
  prevSig() {
    this.changeSig(false);
  }
  changeSig(next) {
    this.clearMain();
    if(next) {
      this.state.currentSig = mod(this.state.currentSig+1, this.state.nSigs);
    } else {
      this.state.currentSig = mod(this.state.currentSig-1, this.state.nSigs);
    }
    this.loadDataset();
    this.updateSigNum();
  }
  updateSigNum() {
    var textEl = document.getElementById("currentSigNum");
    textEl.innerHTML = (this.state.currentSig + 1)
  }
  clearMain() {
    this.container.select("svg").remove();
  }
}

var app = new App();

window.app = app;

