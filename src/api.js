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

    static promiseAll() {
        return Promise.all(Object.values(globalPlotData))
    }

    // Fetches without cacheing
    static fetchDataListing() {
        let url = API.api_base + "data-listing";
        
        return fetch(url, { method: "POST" })
            .then(function(response) {
                return response.json();
            });
    }

    static fetchAutocompleteGene(partialGeneId, projects) {
        let url = API.api_base + "autocomplete-gene";

        let body = {
            "gene_id_partial": partialGeneId,
            "projects": projects
        };
        
        return API.request(
            d3.json(url, { method: "POST", body: JSON.stringify(body) }),
            url,
            body
        );
    }

    // Fetches with cacheing

    static fetchGeneEventTrack(dataOptions) {
        let url = API.api_base + "plot-gene-event-track";

        return API.request(
                d3.json(url, { method: "POST", body: JSON.stringify(dataOptions) }),
                url,
                dataOptions
            );
    }

    static fetchClinicalVariableList() {
        let url = API.api_base + "clinical-variable-list";
        
        return API.request(
            d3.json(url, { method: "POST" }),
            url,
            {}
        );
    }

    static fetchScaleGeneAlterations() {
        let url = API.api_base + "scale-gene-alterations";
        
        return API.request(
            d3.json(url, { method: "POST" }),
            url,
            {}
        );
    }

    static fetchClinicalTrack(dataOptions) {
        let url = API.api_base + "plot-clinical-track";

        return API.request(
                d3.json(url, { method: "POST", body: JSON.stringify(dataOptions) }),
                url,
                dataOptions
            );
    }

    static fetchScaleClinicalTrack(dataOptions) {
        let url = API.api_base + "scale-clinical-track";

        return API.request(
                d3.json(url, { method: "POST", body: JSON.stringify(dataOptions) }),
                url,
                dataOptions
            );
    }

    static getSharingState(slug) {
        let url = API.api_base + "sharing-get";

        return d3.json(url, { method: "POST", body: JSON.stringify({"slug": slug}) });
    }

    static setSharingState(state) {
        let url = API.api_base + "sharing-set";

        return d3.json(url, { method: "POST", body: JSON.stringify({"state": JSON.stringify(state) }) });
    }

   /* 
   static fetchKaryotype() {
        let url = API.api_base + "karyotype";

        return API.request(
            d3.csv(url, { method: "POST" }),
            url,
            null
        );
    }
    */

   /* 
   static fetchGenomeSignatureBins(dataOptions) {
        let url = API.api_base + "signature-genome-bins";
        dataOptions['regionWidth'] = 5000000;

        return API.request(
                d3.json(url, { method: "POST", body: JSON.stringify(dataOptions) }),
                url,
                dataOptions
            );
    }
    */
    /*
    static fetchKataegis(dataOptions) {
        let url = API.api_base + "kataegis";

        return API.request(
                d3.json(url, { method: "POST", body: JSON.stringify(dataOptions) }),
                url,
                dataOptions
            );
    }
    */
    /*
    static fetchRainfall(dataOptions) {
        let url = API.api_base + "kataegis-rainfall";

        return API.request(
            d3.csv(url, { method: "POST", body: JSON.stringify(dataOptions) }),
            url,
            dataOptions
        );
    }
    */
    static fetchPlotSamplesMeta(dataOptions) {
        let url = API.api_base + "plot-samples-meta";

        return API.request(
            d3.json(url, { method: "POST", body: JSON.stringify(dataOptions) }),
            url,
            dataOptions
        );
    }
    static fetchPlotCounts(dataOptions) {
        let url = API.api_base + "plot-counts";

        return API.request(
            d3.json(url, { method: "POST", body: JSON.stringify(dataOptions) }),
            url,
            dataOptions
        );
    }

    static fetchPlotExposures(dataOptions) {
        let url = API.api_base + "plot-exposures";

        return API.request(
            d3.json(url, { method: "POST", body: JSON.stringify(dataOptions) }),
            url,
            dataOptions
        );
    }

    static fetchPlotExposuresNormalized(dataOptions) {
        let url = API.api_base + "plot-exposures-normalized";

        return API.request(
            d3.json(url, { method: "POST", body: JSON.stringify(dataOptions) }),
            url,
            dataOptions
        );
    }



    static fetchPlotCountsPerCategorySingleSample(dataOptions) {
        let url = API.api_base + "plot-counts-per-category-single-sample";

        return API.request(
            d3.json(url, { method: "POST", body: JSON.stringify(dataOptions) }),
            url,
            dataOptions
        );
    }

    static fetchPlotReconstructionSingleSample(dataOptions) {
        let url = API.api_base + "plot-reconstruction-single-sample";

        return API.request(
            d3.json(url, { method: "POST", body: JSON.stringify(dataOptions) }),
            url,
            dataOptions
        );
    }

    static fetchScaleReconstructionSingleSample(dataOptions) {
        let url = API.api_base + "scale-reconstruction-single-sample";

        return API.request(
            d3.json(url, { method: "POST", body: JSON.stringify(dataOptions) }),
            url,
            dataOptions
        );
    }

    static fetchPlotReconstructionErrorSingleSample(dataOptions) {
        let url = API.api_base + "plot-reconstruction-error-single-sample";

        return API.request(
            d3.json(url, { method: "POST", body: JSON.stringify(dataOptions) }),
            url,
            dataOptions
        );
    }

    static fetchScaleReconstructionErrorSingleSample(dataOptions) {
        let url = API.api_base + "scale-reconstruction-error-single-sample";

        return API.request(
            d3.json(url, { method: "POST", body: JSON.stringify(dataOptions) }),
            url,
            dataOptions
        );
    }

    static fetchPlotReconstructionCosineSimilaritySingleSample(dataOptions) {
        let url = API.api_base + "plot-reconstruction-cosine-similarity-single-sample";

        return API.request(
            d3.json(url, { method: "POST", body: JSON.stringify(dataOptions) }),
            url,
            dataOptions
        );
    }

    static fetchPlotReconstructionCosineSimilarity(dataOptions) {
        let url = API.api_base + "plot-reconstruction-cosine-similarity";

        return API.request(
            d3.json(url, { method: "POST", body: JSON.stringify(dataOptions) }),
            url,
            dataOptions
        );
    }


    /*
    static fetchSingleDonorExposures(dataOptions) {
        let url = API.api_base + "exposures-single-donor";
        
        return API.request(
            d3.json(url, { method: "POST", body: JSON.stringify(dataOptions) }),
            url,
            dataOptions
        );
    }
    */
    /*
    static fetchSignature(dataOptions) {
        let url = API.api_base + "signature";
        
        return API.request(
            d3.json(url, { method: "POST", body: JSON.stringify(dataOptions) }),
            url,
            dataOptions
        );
    }
    */

    static fetchScaleSamples(dataOptions) {
        let url = API.api_base + "scale-samples";
        
        return API.request(
            d3.json(url, { method: "POST", body: JSON.stringify(dataOptions) }),
            url,
            dataOptions
        );
    }

    static fetchScaleCounts(dataOptions) {
        let url = API.api_base + "scale-counts";
        
        return API.request(
            d3.json(url, { method: "POST", body: JSON.stringify(dataOptions) }),
            url,
            dataOptions
        );
    }

    static fetchScaleCountsSum(dataOptions) {
        let url = API.api_base + "scale-counts-sum";
        
        return API.request(
            d3.json(url, { method: "POST", body: JSON.stringify(dataOptions) }),
            url,
            dataOptions
        );
    }

    static fetchScaleExposures(dataOptions) {
        let url = API.api_base + "scale-exposures";
        
        return API.request(
            d3.json(url, { method: "POST", body: JSON.stringify(dataOptions) }),
            url,
            dataOptions
        );
    }

    static fetchScaleExposuresSum(dataOptions) {
        let url = API.api_base + "scale-exposures-sum";
        
        return API.request(
            d3.json(url, { method: "POST", body: JSON.stringify(dataOptions) }),
            url,
            dataOptions
        );
    }

    static fetchScaleExposuresNormalized(dataOptions) {
        let url = API.api_base + "scale-exposures-normalized";
        
        return API.request(
            d3.json(url, { method: "POST", body: JSON.stringify(dataOptions) }),
            url,
            dataOptions
        );
    }

    static fetchScaleContexts(dataOptions) {
        let url = API.api_base + "scale-contexts";
        
        return API.request(
            d3.json(url, { method: "POST", body: JSON.stringify(dataOptions) }),
            url,
            dataOptions
        );
    }


    static fetchPlotExposuresSingleSample(dataOptions) {
        let url = API.api_base + "plot-exposures-single-sample";
        
        return API.request(
            d3.json(url, { method: "POST", body: JSON.stringify(dataOptions) }),
            url,
            dataOptions
        );
    }

    static fetchScaleExposuresSingleSample(dataOptions) {
        let url = API.api_base + "scale-exposures-single-sample";
        
        return API.request(
            d3.json(url, { method: "POST", body: JSON.stringify(dataOptions) }),
            url,
            dataOptions
        );
    }
    
    /*
    static fetchSingleDonorGenomeSignatureBins(dataOptions) {
        let url = API.api_base + "signature-genome-bins-single-donor";
        dataOptions['regionWidth'] = 5000000;

        return API.request(
            d3.json(url, { method: "POST", body: JSON.stringify(dataOptions) }),
            url,
            dataOptions
        );
    }
    */
    static fetchClustering(dataOptions) {
        let url = API.api_base + "clustering";
        
        return API.request(
            d3.json(url, { method: "POST", body: JSON.stringify(dataOptions) }),
            url,
            dataOptions
        );
    }
    
  
}