import * as d3 from 'd3';
import { getHashCode } from './helpers';

const globalPlotData = {};

const withToken = (body, token) => {
    return JSON.stringify({
        token: token,
        ...body
    });
}

export default class API {
    static api_base = process.env.VUE_APP_API_BASE;
    static token = '';

    // Cache helpers
    static checkStored(hashCode) {
        if(globalPlotData[hashCode] !== undefined) {
            return Promise.resolve(globalPlotData[hashCode]);
        }
    }

    static request(pr, url, body) {
        let hashCode = getHashCode(url, body);
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

    /**
     * Check if authenticated.
     * @param {string} token
     * @throws Will throw 403 if not authenticated.
     * @returns {Promise} The response.
     */
    static checkToken(token) {
        const url = API.api_base + "check-token";

        return d3.json(url, { method: "POST", body: withToken(undefined, token) });
    }

    /**
     * Attempt to log in.
     * @param {string} password
     * @throws Will throw 403 if not authenticated.
     * @returns {Promise} The response.
     */
    static login(password) {
        const url = API.api_base + "login";
        const body = { password: password };
        return d3.json(url, { method: "POST", body: JSON.stringify(body) });
    }

    /**
     * Make a log out request.
     * @throws Will throw 403 if not authenticated.
     * @returns {Promise} The response.
     */
    static logout() {
        const url = API.api_base + "logout";

        return d3.json(url, { method: "POST", body: withToken(undefined, API.token) });
    }

    static fetchDataListing() {
        let url = API.api_base + "data-listing";
        
        return API.request(
            d3.json(url, { method: "POST", body: withToken(undefined, API.token) }),
            url,
            {}
        );
    }

    static fetchFeaturedListing() {
        let url = API.api_base + "featured-listing";
        
        return API.request(
            d3.json(url, { method: "POST", body: withToken(undefined, API.token) }),
            url,
            {}
        );
    }

    static fetchAutocompleteGene(partialGeneId, projects) {
        let url = API.api_base + "autocomplete-gene";

        let body = {
            "gene_id_partial": partialGeneId,
            "projects": projects
        };
        
        return API.request(
            d3.json(url, { method: "POST", body: withToken(body, API.token) }),
            url,
            body
        );
    }

    // Fetches with cacheing

    static fetchPlotGeneMutTrack(body) {
        let url = API.api_base + "plot-gene-mut-track";

        return API.request(
                d3.json(url, { method: "POST", body: withToken(body, API.token) }),
                url,
                body
            );
    }

    static fetchPlotGeneExpTrack(body) {
        let url = API.api_base + "plot-gene-exp-track";

        return API.request(
                d3.json(url, { method: "POST", body: withToken(body, API.token) }),
                url,
                body
            );
    }

    static fetchPlotGeneCNATrack(body) {
        let url = API.api_base + "plot-gene-cna-track";

        return API.request(
                d3.json(url, { method: "POST", body: withToken(body, API.token) }),
                url,
                body
            );
    }

    static fetchClinicalVariableList() {
        let url = API.api_base + "clinical-variable-list";
        
        return API.request(
            d3.json(url, { method: "POST", body: withToken(undefined, API.token) }),
            url,
            {}
        );
    }

    static fetchPathwaysListing() {
        let url = API.api_base + "pathways-listing";
        
        return API.request(
            d3.json(url, { method: "POST", body: withToken(undefined, API.token) }),
            url,
            {}
        );
    }

    static fetchScaleGeneAlterations() {
        let url = API.api_base + "scale-gene-alterations";
        
        return API.request(
            d3.json(url, { method: "POST", body: withToken(undefined, API.token) }),
            url,
            {}
        );
    }

    static fetchPlotClinical(body) {
        let url = API.api_base + "plot-clinical";

        return API.request(
                d3.json(url, { method: "POST", body: withToken(body, API.token) }),
                url,
                body
            );
    }

    static fetchScaleClinical(body) {
        let url = API.api_base + "scale-clinical";

        return API.request(
                d3.json(url, { method: "POST", body: withToken(body, API.token) }),
                url,
                body
            );
    }

    static getSharingState(slug) {
        let url = API.api_base + "sharing-get";
        const body = { "slug": slug };
        return d3.json(url, { method: "POST", body: withToken(body, API.token) });
    }

    static setSharingState(state) {
        let url = API.api_base + "sharing-set";

        const body = { "state": JSON.stringify(state) };
        return d3.json(url, { method: "POST", body: withToken(body, API.token) });
    }

    static fetchPlotSamplesMeta(body) {
        let url = API.api_base + "plot-samples-meta";

        return API.request(
            d3.json(url, { method: "POST", body: withToken(body, API.token) }),
            url,
            body
        );
    }
    static fetchPlotCounts(body) {
        let url = API.api_base + "plot-counts";

        return API.request(
            d3.json(url, { method: "POST", body: withToken(body, API.token) }),
            url,
            body
        );
    }

    static fetchPlotExposures(body) {
        let url = API.api_base + "plot-exposures";

        return API.request(
            d3.json(url, { method: "POST", body: withToken(body, API.token) }),
            url,
            body
        );
    }

    static fetchPlotExposuresNormalized(body) {
        let url = API.api_base + "plot-exposures-normalized";

        return API.request(
            d3.json(url, { method: "POST", body: withToken(body, API.token) }),
            url,
            body
        );
    }

    static fetchPlotCountsPerCategorySingleSample(body) {
        let url = API.api_base + "plot-counts-per-category-single-sample";

        return API.request(
            d3.json(url, { method: "POST", body: withToken(body, API.token) }),
            url,
            body
        );
    }

    static fetchPlotReconstructionSingleSample(body) {
        let url = API.api_base + "plot-reconstruction-single-sample";

        return API.request(
            d3.json(url, { method: "POST", body: withToken(body, API.token) }),
            url,
            body
        );
    }

    static fetchScaleReconstructionSingleSample(body) {
        let url = API.api_base + "scale-reconstruction-single-sample";

        return API.request(
            d3.json(url, { method: "POST", body: withToken(body, API.token) }),
            url,
            body
        );
    }

    static fetchPlotReconstructionErrorSingleSample(body) {
        let url = API.api_base + "plot-reconstruction-error-single-sample";

        return API.request(
            d3.json(url, { method: "POST", body: withToken(body, API.token) }),
            url,
            body
        );
    }

    static fetchScaleReconstructionErrorSingleSample(body) {
        let url = API.api_base + "scale-reconstruction-error-single-sample";

        return API.request(
            d3.json(url, { method: "POST", body: withToken(body, API.token) }),
            url,
            body
        );
    }

    static fetchPlotReconstructionCosineSimilaritySingleSample(body) {
        let url = API.api_base + "plot-reconstruction-cosine-similarity-single-sample";

        return API.request(
            d3.json(url, { method: "POST", body: withToken(body, API.token) }),
            url,
            body
        );
    }

    static fetchPlotReconstructionCosineSimilarity(body) {
        let url = API.api_base + "plot-reconstruction-cosine-similarity";

        return API.request(
            d3.json(url, { method: "POST", body: withToken(body, API.token) }),
            url,
            body
        );
    }

    static fetchPlotSignature(body) {
        let url = API.api_base + "plot-signature";
        
        return API.request(
            d3.json(url, { method: "POST", body: withToken(body, API.token) }),
            url,
            body
        );
    }

    static fetchScaleSamples(body) {
        let url = API.api_base + "scale-samples";
        
        return API.request(
            d3.json(url, { method: "POST", body: withToken(body, API.token) }),
            url,
            body
        );
    }

    static fetchScaleCounts(body) {
        let url = API.api_base + "scale-counts";
        
        return API.request(
            d3.json(url, { method: "POST", body: withToken(body, API.token) }),
            url,
            body
        );
    }

    static fetchScaleCountsSum(body) {
        let url = API.api_base + "scale-counts-sum";
        
        return API.request(
            d3.json(url, { method: "POST", body: withToken(body, API.token) }),
            url,
            body
        );
    }

    static fetchScaleExposures(body) {
        let url = API.api_base + "scale-exposures";
        
        return API.request(
            d3.json(url, { method: "POST", body: withToken(body, API.token) }),
            url,
            body
        );
    }

    static fetchScaleExposuresSum(body) {
        let url = API.api_base + "scale-exposures-sum";
        
        return API.request(
            d3.json(url, { method: "POST", body: withToken(body, API.token) }),
            url,
            body
        );
    }

    static fetchScaleExposuresNormalized(body) {
        let url = API.api_base + "scale-exposures-normalized";
        
        return API.request(
            d3.json(url, { method: "POST", body: withToken(body, API.token) }),
            url,
            body
        );
    }

    static fetchScaleContexts(body) {
        let url = API.api_base + "scale-contexts";
        
        return API.request(
            d3.json(url, { method: "POST", body: withToken(body, API.token) }),
            url,
            body
        );
    }


    static fetchPlotExposuresSingleSample(body) {
        let url = API.api_base + "plot-exposures-single-sample";
        
        return API.request(
            d3.json(url, { method: "POST", body: withToken(body, API.token) }),
            url,
            body
        );
    }

    static fetchScaleExposuresSingleSample(body) {
        let url = API.api_base + "scale-exposures-single-sample";
        
        return API.request(
            d3.json(url, { method: "POST", body: withToken(body, API.token) }),
            url,
            body
        );
    }
    
    static fetchClustering(body) {
        let url = API.api_base + "clustering";
        
        return API.request(
            d3.json(url, { method: "POST", body: withToken(body, API.token) }),
            url,
            body
        );
    }

    static fetchPlotSurvival(body) {
        let url = API.api_base + "plot-survival";
        
        return API.request(
            d3.json(url, { method: "POST", body: withToken(body, API.token) }),
            url,
            body
        );
    }
    
  
}