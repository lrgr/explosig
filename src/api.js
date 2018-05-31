import * as d3 from 'd3';

export default class API {
    //static api_base = 'http://localhost:8000/';
    static api_base = 'https://imuse-server.lrgr.io/';

    static fetchDataListing() {
        var url = API.api_base + "data-listing";
        
        return fetch(url, { method: "POST" })
        .then(function(response) {
            return response.json();
        });
    }
    static fetchGenomeSignatureBins(dataOptions) {
        var url = API.api_base + "signature-genome-bins";
        dataOptions['regionWidth'] = 5000000;
        //console.log(JSON.stringify(dataOptions));

        return d3.json(url, { method: "POST", body: JSON.stringify(dataOptions) });
    }
    static fetchKataegis(dataOptions) {
        var url = API.api_base + "kataegis";
        //console.log(JSON.stringify(dataOptions));

        return d3.json(url, { method: "POST", body: JSON.stringify(dataOptions) });
    }

    static fetchRainfall(rainfallOptions) {
        var url = API.api_base + "kataegis-rainfall";
        //console.log(JSON.stringify(rainfallOptions));

        return d3.csv(url, { method: "POST", body: JSON.stringify(rainfallOptions) });
    }

    static fetchExposures(dataOptions) {
        var url = API.api_base + "exposures";
        //console.log(JSON.stringify(dataOptions));

        return d3.json(url, { method: "POST", body: JSON.stringify(dataOptions) });
    }

    static fetchSingleDonorExposures(dataOptions) {
        var url = API.api_base + "exposures-single-donor";
        //console.log(JSON.stringify(dataOptions));
        
        return d3.json(url, { method: "POST", body: JSON.stringify(dataOptions) });
    }

    static fetchChromosomes() {
        var url = API.api_base + "chromosomes";

        return fetch(url, { method: "POST" })
        .then(function(response) {
            return response.json();
        });
    }

    static fetchKaryotype() {
        var url = API.api_base + "karyotype";

        return d3.csv(url, { method: "POST" });
    }
}