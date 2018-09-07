import * as d3 from 'd3';
import { getHashCode } from './helpers';
import { MUT_TYPES } from './constants';

import Signature from './classes/Signature';
import Project from './classes/Project';
import SignatureGroup from './classes/SignatureGroup';
import CancerType from './classes/CancerType';

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
            })
            .then(function(allData) {
                let signatures = {};
                for(let mutType of MUT_TYPES) {
                    signatures[mutType] = allData['sigs'][mutType].map((sigData) => {
                        return new Signature(
                            sigData['name'],
                            sigData['description'],
                            sigData['index'],
                            sigData['publication'],
                            mutType
                        );
                    });
                }
                let projects = {};
                for(var projID of Object.keys(allData['projects'])) {
                    let projData = allData['projects'][projID];
                    projects[projID] = new Project(
                        projID,
                        projData['name'],
                        projData['num_donors'],
                        projData['source'],
                        projData['has_clinical'],
                        projData['has_extended'],
                        projData['has_counts']
                    );
                }
                let sigGroups = [];
                for(let sigGroupData of allData['sigs_per_cancer_type']) {
                    let sigGroup = new SignatureGroup(
                        sigGroupData['id'], 
                        sigGroupData['group']
                    );
                    for(let cancerTypeData of sigGroupData['cancer-types']) {
                        let cancerType = new CancerType(
                            cancerTypeData['id'], 
                            cancerTypeData['name'],
                            cancerTypeData['signatures']
                        );
                        sigGroup.addCancerType(cancerType);
                    }
                    sigGroups.push(sigGroup);
                }
                return {
                    'sigs': signatures,
                    'projects': projects,
                    'sigs_per_cancer_type': sigGroups
                };
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

    static fetchGeneEventTrack(dataOptions) {
        let url = API.api_base + "genome-event-track";
        
        return fetch(url, { method: "POST", body: JSON.stringify(dataOptions) })
            .then(function(response) {
                return response.json();
            });
    }

    // Fetches with cacheing

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