import * as d3 from 'd3';

export default class API {
    //static api_base = 'http://localhost:8000/';
    static api_base = 'https://afternoon-garden-99891.herokuapp.com/';

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
        console.log(JSON.stringify(dataOptions));

        return d3.csv(url, { method: "POST", body: JSON.stringify(dataOptions) }, function(d) {
            var row = {name: d[""], vals: d};
            delete row.vals[""];
            return row;
        });
    }
    static fetchKataegis(dataOptions) {
        var url = API.api_base + "kataegis";
        console.log(JSON.stringify(dataOptions));

        return d3.json(url, { method: "POST", body:JSON.stringify(dataOptions) });
    }

    static fetchExposures(dataOptions) {
        var url = API.api_base + "exposures";
        console.log(JSON.stringify(dataOptions));

        return d3.csv(url, { method: "POST", body:JSON.stringify(dataOptions) }, function(d) {
            var row = {
                'donor_id': d[""],
                'clinical': {
                    'alcohol_binary': d["Alcohol Binary"],
                    'tobacco_binary': d["Tobacco Binary"],
                    'tobacco_Intensity': d["Tobacco Intensity"]
                },
                'proj_id': d["proj_id"]
            }
            delete d[""];
            delete d["Alcohol Binary"];
            delete d["Tobacco Binary"];
            delete d["Tobacco Intensity"];
            delete d["proj_id"];
            row["exposures"] = d;
            return row;
        });
    }

    static fetchChromosomes() {
        var url = API.api_base + "chromosomes";
        return fetch(url, { method: "POST" })
        .then(function(response) {
            return response.json();
        });
    }
}