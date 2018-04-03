
export default class API {
    static api_base = 'http://localhost:8000/';
    static fetchDataListing() {
        var url = API.api_base + "data-listing";
        return fetch(url, { method: "POST", mode: 'cors' })
        .then(function(response) {
            return response.json();
        });
    }
}