import { json as d3_json } from 'd3-fetch';
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
        return null;
    }

    static request(pr, url, body) {
        const hashCode = getHashCode(url, body);
        let stored = API.checkStored(hashCode);
        if(stored === null) {
            // Use the promise that was passed in
            stored = d3_json(...pr);
            globalPlotData[hashCode] = stored;
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

        return d3_json(url, { method: "POST", body: withToken(undefined, token) });
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
        return d3_json(url, { method: "POST", body: JSON.stringify(body) });
    }

    /**
     * Make a log out request.
     * @throws Will throw 403 if not authenticated.
     * @returns {Promise} The response.
     */
    static logout() {
        const url = API.api_base + "logout";

        return d3_json(url, { method: "POST", body: withToken(undefined, API.token) });
    }

    static getSharingState(slug) {
        let url = API.api_base + "sharing-get";
        const body = { "slug": slug };
        return d3_json(url, { method: "POST", body: withToken(body, API.token) });
    }

    static setSharingState(state) {
        let url = API.api_base + "sharing-set";

        const body = { "state": JSON.stringify(state) };
        return d3_json(url, { method: "POST", body: withToken(body, API.token) });
    }


    static fetchDataListing() {
        let url = API.api_base + "data-listing";
        
        return API.request(
            [url, { method: "POST", body: withToken(undefined, API.token) }],
            url,
            {}
        );
    }

    static fetchFeaturedListing() {
        let url = API.api_base + "featured-listing";
        
        return API.request(
            [url, { method: "POST", body: withToken(undefined, API.token) }],
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
			[url, { method: "POST", body: withToken(body, API.token) }],
            url,
            body
        );
    }

    // Fetches with cacheing

    static fetchPlotGeneMutTrack(body) {
        let url = API.api_base + "plot-gene-mut-track";

        return API.request(
                [url, { method: "POST", body: withToken(body, API.token) }],
                url,
                body
            );
    }

    static fetchPlotGeneExpTrack(body) {
        let url = API.api_base + "plot-gene-exp-track";

        return API.request(
                [url, { method: "POST", body: withToken(body, API.token) }],
                url,
                body
            );
    }

    static fetchPlotGeneCNATrack(body) {
        let url = API.api_base + "plot-gene-cna-track";

        return API.request(
                [url, { method: "POST", body: withToken(body, API.token) }],
                url,
                body
            );
    }

    static fetchPathwaysListing() {
        let url = API.api_base + "pathways-listing";
        
        return API.request(
            [url, { method: "POST", body: withToken(undefined, API.token) }],
            url,
            {}
        );
    }

    static fetchScaleGeneAlterations() {
        let url = API.api_base + "scale-gene-alterations";
        
        return API.request(
            [url, { method: "POST", body: withToken(undefined, API.token) }],
            url,
            {}
        );
    }

    static fetchPlotClinical(body) {
        let url = API.api_base + "plot-clinical";

        return API.request(
                [url, { method: "POST", body: withToken(body, API.token) }],
                url,
                body
            );
    }

    static fetchScaleClinical(body) {
        let url = API.api_base + "scale-clinical";

        return API.request(
                [url, { method: "POST", body: withToken(body, API.token) }],
                url,
                body
            );
    }

    static fetchPlotSamplesMeta(body) {
        let url = API.api_base + "plot-samples-meta";

        return API.request(
            [url, { method: "POST", body: withToken(body, API.token) }],
            url,
            body
        );
    }
    static fetchPlotCounts(body) {
        let url = API.api_base + "plot-counts";

        return API.request(
            [url, { method: "POST", body: withToken(body, API.token) }],
            url,
            body
        );
    }

    static fetchPlotExposures(body) {
        let url = API.api_base + "plot-exposures";

        return API.request(
            [url, { method: "POST", body: withToken(body, API.token) }],
            url,
            body
        );
    }

    static fetchPlotExposuresNormalized(body) {
        let url = API.api_base + "plot-exposures-normalized";

        return API.request(
			[url, { method: "POST", body: withToken(body, API.token) }],
            url,
            body
        );
    }

    static fetchPlotCountsPerCategorySingleSample(body) {
        let url = API.api_base + "plot-counts-per-category-single-sample";

        return API.request(
			[url, { method: "POST", body: withToken(body, API.token) }],
            url,
            body
        );
    }

    static fetchPlotReconstructionSingleSample(body) {
        let url = API.api_base + "plot-reconstruction-single-sample";

        return API.request(
			[url, { method: "POST", body: withToken(body, API.token) }],
            url,
            body
        );
    }

    static fetchPlotReconstructionErrorSingleSample(body) {
        let url = API.api_base + "plot-reconstruction-error-single-sample";

        return API.request(
			[url, { method: "POST", body: withToken(body, API.token) }],
            url,
            body
        );
    }

    static fetchPlotReconstructionCosineSimilaritySingleSample(body) {
        let url = API.api_base + "plot-reconstruction-cosine-similarity-single-sample";

        return API.request(
			[url, { method: "POST", body: withToken(body, API.token) }],
            url,
            body
        );
    }

    static fetchPlotReconstructionCosineSimilarity(body) {
        let url = API.api_base + "plot-reconstruction-cosine-similarity";

        return API.request(
			[url, { method: "POST", body: withToken(body, API.token) }],
            url,
            body
        );
    }

    static fetchPlotSignature(body) {
        let url = API.api_base + "plot-signature";
        
        return API.request(
			[url, { method: "POST", body: withToken(body, API.token) }],
            url,
            body
        );
    }

    static fetchScaleSamples(body) {
        let url = API.api_base + "scale-samples";
        
        return API.request(
			[url, { method: "POST", body: withToken(body, API.token) }],
            url,
            body
        );
    }


    static fetchScaleExposuresNormalized(body) {
        let url = API.api_base + "scale-exposures-normalized";
        
        return API.request(
			[url, { method: "POST", body: withToken(body, API.token) }],
            url,
            body
        );
    }

    static fetchScaleContexts(body) {
        let url = API.api_base + "scale-contexts";
        
        return API.request(
			[url, { method: "POST", body: withToken(body, API.token) }],
            url,
            body
        );
    }


    static fetchPlotExposuresSingleSample(body) {
        let url = API.api_base + "plot-exposures-single-sample";
        
        return API.request(
			[url, { method: "POST", body: withToken(body, API.token) }],
            url,
            body
        );
    }

    
    static fetchClustering(body) {
        let url = API.api_base + "clustering";
        
        return API.request(
			[url, { method: "POST", body: withToken(body, API.token) }],
            url,
            body
        );
    }

    static fetchPlotSurvival(body) {
        let url = API.api_base + "plot-survival";
        
        return API.request(
			[url, { method: "POST", body: withToken(body, API.token) }],
            url,
            body
        );
    }
    
  
}