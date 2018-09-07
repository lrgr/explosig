import * as d3 from 'd3';
import { getHashCode } from './helpers';

const globalPlotData = {};

export default class API {
    static api_base = process.env.VUE_APP_API_BASE;

    // Cache helpers
    static checkStored(hashCode) {
        if(globalPlotData[hashCode] !== undefined) {
            return Promise.resolve(globalPlotData[hashCode]);
        }
    }

    static request(pr, url, dataOptions) {
        let hashCode = getHashCode(url, dataOptions);
        var stored = API.checkStored(hashCode);
        if(stored == null) {
            // Use the promise that was passed in
            stored = pr;
            globalPlotData[hashCode] = pr;
        }
        return stored;
    }

    // Fetches without cacheing
    static fetchDataListing() {
        let url = API.api_base + "data-listing";
        
        return fetch(url, { method: "POST" })
            .then(function(response) {
                return response.json();
            });
    }

    static fetchAutocompleteGene(partialGeneId) {
        let url = API.api_base + "autocomplete-gene";

        let body = {
            "gene_id_partial": partialGeneId
        };
        
        return fetch(url, { method: "POST", body: JSON.stringify(body) })
            .then(function(response) {
                return response.json();
            });
    }

    // Fetches with cacheing
    static fetchChromosomes() {
        let url = API.api_base + "chromosomes";

        return API.request(
            fetch(url, { method: "POST" })
                .then(function(response) {
                    return response.json();
                }), 
            url,
            null
        );
    }

    static fetchKaryotype() {
        let url = API.api_base + "karyotype";

        return API.request(
            d3.csv(url, { method: "POST" }),
            url,
            null
        );
    }

    static fetchGenomeSignatureBins(dataOptions) {
        let url = API.api_base + "signature-genome-bins";
        dataOptions['regionWidth'] = 5000000;

        return API.request(
                d3.json(url, { method: "POST", body: JSON.stringify(dataOptions) }),
                url,
                dataOptions
            );
    }
    static fetchKataegis(dataOptions) {
        let url = API.api_base + "kataegis";

        return API.request(
                d3.json(url, { method: "POST", body: JSON.stringify(dataOptions) }),
                url,
                dataOptions
            );
    }

    static fetchRainfall(dataOptions) {
        let url = API.api_base + "kataegis-rainfall";

        return API.request(
            d3.csv(url, { method: "POST", body: JSON.stringify(dataOptions) }),
            url,
            dataOptions
        );
    }

    static fetchExposures(dataOptions) {
        let url = API.api_base + "exposures";

        return API.request(
            d3.json(url, { method: "POST", body: JSON.stringify(dataOptions) }),
            url,
            dataOptions
        );
    }

    static fetchSingleDonorExposures(dataOptions) {
        let url = API.api_base + "exposures-single-donor";
        
        return API.request(
            d3.json(url, { method: "POST", body: JSON.stringify(dataOptions) }),
            url,
            dataOptions
        );
    }

    static fetchSignature(dataOptions) {
        let url = API.api_base + "signature";
        
        return API.request(
            d3.json(url, { method: "POST", body: JSON.stringify(dataOptions) }),
            url,
            dataOptions
        );
    }

    static fetchSamplesWithSignatures(dataOptions) {
        let url = API.api_base + "samples-with-signatures";
        
        return API.request(
            d3.json(url, { method: "POST", body: JSON.stringify(dataOptions) }),
            url,
            dataOptions
        );
    }

    static fetchSingleDonorGenomeSignatureBins(dataOptions) {
        let url = API.api_base + "signature-genome-bins-single-donor";
        dataOptions['regionWidth'] = 5000000;

        return API.request(
            d3.json(url, { method: "POST", body: JSON.stringify(dataOptions) }),
            url,
            dataOptions
        );
    }

    static fetchClustering(dataOptions) {
        let url = API.api_base + "clustering";
        
        return API.request(
            d3.json(url, { method: "POST", body: JSON.stringify(dataOptions) }),
            url,
            dataOptions
        );
    }

    
}