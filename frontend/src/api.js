
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
        dataOptions['regionWidth'] = 5000000;
        dataOptions['chromosome'] = '1';
        /* return fetch(url, { method: "POST", body: JSON.stringify(dataOptions) })
        .then(function(response) {
            return response.text();
        }); */
    }
}