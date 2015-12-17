var hat = require('hat');

function convert(geojson) {
    var layers = [];
    var sourceId = hat();
    for (var i = 0; i < geojson.features.length; i++) {
        if (!geojson.features[i].properties) geojson.features[i].properties = {};
        geojson.features[i].properties._id = hat();

        var feature = geojson.features[i];
        if (feature.geometry.type === 'LineString') {
            var layer = _makeLayer(feature, sourceId, 'LineString');
            layers.push(layer);

        } else if (feature.geometry.type === 'Polygon') {
            var inside = _makeLayer(feature, sourceId, 'Polygon');
            layers.push(inside);

            // Background: https://github.com/mapbox/simplespec-to-gl-style/issues/2
            // `type: fill` does not support stroke properties
            var outside = _makeLayer(feature, sourceId, 'LineString');
            layers.push(outside);
        } else {
            return new Error('Unsupported geometry type');
        }
    }

    var sources = _makeSource(geojson, sourceId);

    var style = {
        version: 8,
        sources: sources,
        layers: layers,
        glyphs:'mapbox://fonts/mapbox/{fontstack}/{range}.pbf'
    };

    return style;
}

function _makeLayer(feature, sourceId, geometry) {
    var layer;
    if (geometry === 'LineString') {
        layer = {
            type: 'line',
            source: sourceId,
            id: feature.properties._id,
            paint: {
                'line-color': 'stroke' in feature.properties ? feature.properties.stroke : '#555555',
                'line-opacity': 'stroke-opacity' in feature.properties ? feature.properties['stroke-opacity'] : 1.0,
                'line-width': 'stroke-width' in feature.properties ? feature.properties['stroke-width'] : 2
            },
            filter: [
                '==',
                '_id',
                feature.properties._id
            ]
        };
    } else if (geometry === 'Polygon') {
        layer = {
            type: 'fill',
            source: sourceId,
            id: feature.properties._id,
            paint: {
                'fill-color': 'fill' in feature.properties ? feature.properties.fill : '#555555',
                'fill-opacity': 'fill-opacity' in feature.properties ? feature.properties['fill-opacity'] : 0.5
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

function _makeSource(geojson, sourceId) {
    var sources = {
        [sourceId]: {
            type: 'geojson',
            data: geojson
        }
    };
    return sources;
}

module.exports = convert;
