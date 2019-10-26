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
    // Reference: https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
};

export const getHashCode = function(s, obj) {
    if(obj !== undefined && obj != null) {
        s += JSON.stringify(obj);
    }
    // Reference: https://gist.github.com/hyamamoto/fd435505d29ebfa3d9716fd2be8d42f0
    var h = 0, l = s.length, i = 0;
    if ( l > 0 )
        while (i < l)
        h = (h << 5) - h + s.charCodeAt(i++) | 0;
    return h.toString();
};

export const getScaleHashCode = function(scale) {
    return getHashCode(JSON.stringify(scale.domain.slice().sort()));
};

export const getRetinaRatio = function(c) {
    let devicePixelRatio = window.devicePixelRatio || 1;
    let backingStoreRatio = [
        c.webkitBackingStorePixelRatio,
        c.mozBackingStorePixelRatio,
        c.msBackingStorePixelRatio,
        c.oBackingStorePixelRatio,
        c.backingStorePixelRatio,
        1
    ].reduce(function(a, b) { return a || b });

    return devicePixelRatio / backingStoreRatio;
}