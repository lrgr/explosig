import * as d3 from 'd3';

export default class API {
    static api_base = process.env.VUE_APP_API_BASE;

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

        return d3.json(url, { method: "POST", body: JSON.stringify(dataOptions) });
    }
    static fetchKataegis(dataOptions) {
        var url = API.api_base + "kataegis";

        return d3.json(url, { method: "POST", body: JSON.stringify(dataOptions) });
    }

    static fetchRainfall(rainfallOptions) {
        var url = API.api_base + "kataegis-rainfall";

        return d3.csv(url, { method: "POST", body: JSON.stringify(rainfallOptions) });
    }

    static fetchExposures(dataOptions) {
        var url = API.api_base + "exposures";

        return d3.json(url, { method: "POST", body: JSON.stringify(dataOptions) });
    }

    static fetchSingleDonorExposures(dataOptions) {
        var url = API.api_base + "exposures-single-donor";
        
        return d3.json(url, { method: "POST", body: JSON.stringify(dataOptions) });
    }

    static fetchChromosomes() {
        var url = API.api_base + "chromosomes";

        return fetch(url, { method: "POST" })
        .then(function(response) {
            return response.json();
        });
    }

    static fetchSignature(dataOptions) {
        var url = API.api_base + "signature";
        
        return d3.json(url, { method: "POST", body: JSON.stringify(dataOptions) });
    }

    static fetchSamplesWithSignatures(dataOptions) {
        var url = API.api_base + "samples-with-signatures";
        
        return d3.json(url, { method: "POST", body: JSON.stringify(dataOptions) });
    }

    static fetchSingleDonorGenomeSignatureBins(dataOptions) {
        var url = API.api_base + "signature-genome-bins-single-donor";
        dataOptions['regionWidth'] = 5000000;

        return d3.json(url, { method: "POST", body: JSON.stringify(dataOptions) });
    }

    static fetchKaryotype() {
        var url = API.api_base + "karyotype";

        return d3.csv(url, { method: "POST" });
    }
}