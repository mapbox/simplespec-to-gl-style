var geojsonhint = require('geojsonhint');
var hat = require('hat');

function convert(geojson) {
    var check = geojsonhint.hint(geojson);
    if (check.length > 0) return check;

    var layers = [];
    for (var i = 0; i < geojson.features.length; i++) {
        if (!geojson.features[i].properties) geojson.features[i].properties = {};
        geojson.features[i].properties._id = hat();

        var layer = _makeLayer(geojson.features[i]);
        if (layer instanceof Error) return layer;
        layers.push(layer);
    }

    var sources = _makeSource(geojson);

    var style = {
        version: 8,
        sources: sources,
        layers: layers,
        glyphs:'mapbox://fonts/mapbox/{fontstack}/{range}.pbf'
    };

    return style;
}

function _makeLayer(feature) {
    if (feature.geometry.type !== 'LineString' && feature.geometry.type !== 'Polygon') return new Error('Unsupported geometry type');

    var layer;
    if (feature.geometry.type === 'LineString') {
        layer = {
            source: 'geojson',
            type: 'line',
            id: feature.properties._id,
            paint: {
                'line-color': feature.properties.stroke || '#ddd',
                'line-width': feature.properties['stroke-width'] || '#ddd',
                'line-opacity': feature.properties['stroke-opacity'] || 1
            },
            filter: [
                '==',
                '_id',
                feature.properties._id
            ]
        };
    } else if (feature.geometry.type === 'Polygon') {
        layer = {
            source: 'geojson',
            type: 'fill',
            id: feature.properties._id,
            paint: {
                'fill-color': feature.properties.fill  || '#ddd',
                'fill-opacity': feature.properties['fill-opacity'] || 1,
                'line-color': feature.properties.stroke || 1,
                'line-width': feature.properties['stroke-width'] || 1,
                'line-opactiy': feature.properties['stroke-opacity'] || 1
            },
            filter: [
                '==',
                '_id',
                feature.properties._id
            ]
        };
    }
    return layer;
}

function _makeSource(geojson) {
    var sources = {
        geojson: {
            type: 'geojson',
            data: geojson
        }
    };
    return sources;
}

module.exports = convert;
