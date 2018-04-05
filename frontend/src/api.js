import * as d3 from 'd3';

export default class API {
    static api_base = 'http://localhost:8000/';
    static fetchDataListing() {
        var url = API.api_base + "data-listing";
        return fetch(url, { method: "POST" })
        .then(function(response) {
            return response.json();
        });
    }
    static fetchGenomeSignatureBins(dataOptions) {
        var url = API.api_base + "signature-genome-bins";
        dataOptions['regionWidth'] = 1000000;
        dataOptions['chromosome'] = '1';
        console.log(JSON.stringify(dataOptions));
        return d3.csv(url, { method: "POST", body: JSON.stringify(dataOptions) }, function(d) {
            var row = {name: d[""], vals: d};
            delete row.vals[""];
            return row;
        });
    }
    static fetchKataegis(dataOptions) {
        var url = API.api_base + "kataegis";
        dataOptions['chromosome'] = '1';
        console.log(JSON.stringify(dataOptions));
        return d3.csv(url, { method: "POST", body: JSON.stringify(dataOptions) });
    }

    static fetchChromosomes() {
        var url = API.api_base + "chromosomes";
        return fetch(url, { method: "POST" })
        .then(function(response) {
            return response.json();
        });
    }
}