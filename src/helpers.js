export const getTranslation = function(t) {
    // Reference: https://stackoverflow.com/questions/38224875/replacing-d3-transform-in-d3-v4

    // Dummy g element for calculations
    var g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    // Set the transform attribute to the provided string value.
    g.setAttributeNS(null, "transform", t);
    var matrix = g.transform.baseVal.consolidate().matrix;
    // As per definition values e and f are the ones for the translation.
    return [matrix.e, matrix.f];
};

export const getUUID = function() {
    // https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};