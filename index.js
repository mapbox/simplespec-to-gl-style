var hat = require('hat');
var markerSize = {
    small: 0.5,
    medium: 0.75,
    large: 1
};

function convert(geojson) {
    var sourceId = hat();

    var style = {
        version: 8,
        sources: makeSource(geojson, sourceId),
        layers: addLayers(geojson, sourceId, []),
        glyphs: 'mapbox://fonts/mapbox/{fontstack}/{range}.pbf'
    };

    return style;
}

function addLayers(geojson, sourceId, layers) {
    switch (geojson.type) {
        case 'FeatureCollection':
            geojson.features.forEach(function(feature) { addLayers(feature, sourceId, layers); });
            break;
        default: throw new Error('unknown or unsupported GeoJSON type');
        case 'Feature':
            switch (geojson.geometry.type) {
                case 'Point':
                    if (!geojson.properties) geojson.properties = {};
                    geojson.properties._id = hat();
                    if ('marker-symbol' in geojson.properties) layers.push(makeLayer(geojson, sourceId, 'symbol-background'));
                    layers.push(makeLayer(geojson, sourceId, 'Point'));
                    break;
                case 'LineString':
                    if (!geojson.properties) geojson.properties = {};
                    geojson.properties._id = hat();
                    layers.push(makeLayer(geojson, sourceId, 'LineString'));
                    break;
                case 'Polygon':
                    if (!geojson.properties) geojson.properties = {};
                    geojson.properties._id = hat();
                    layers.push(makeLayer(geojson, sourceId, 'LineString'));
                    layers.push(makeLayer(geojson, sourceId, 'Polygon'));
                    break;
                default: throw new Error('unknown or unsupported GeoJSON geometry type');
            }
    }
    return layers;
}

function makeLayer(feature, sourceId, geometry) {
    var layer;
    if (geometry === 'symbol-background') { // Used for styling point background circle
        layer = {
            source: sourceId,
            id: hat(),
            type: 'circle',
            paint: {
                'circle-color': 'marker-color' in feature.properties ? feature.properties['marker-color'] : 'white',
                'circle-radius': 'marker-size' in feature.properties && markerSize[feature.properties['marker-size']] ? markerSize[feature.properties['marker-size']] * 10 : 10
            },
            filter: [
                '==',
                '_id',
                feature.properties._id
            ]
        };
    } else if (geometry === 'Point') {
        layer = {
            source: sourceId,
            id: hat(),
            filter: [
                '==',
                '_id',
                feature.properties._id
            ]
        };

        if ('marker-symbol' in feature.properties) {
            layer.type = 'symbol';
            layer.layout = {};
            layer.layout = {
                'icon-image': feature.properties['marker-symbol'],
                'icon-size': 'marker-size' in feature.properties && markerSize[feature.properties['marker-size']] ? markerSize[feature.properties['marker-size']] : 1
            };
        } else {
            layer.paint = {};
            layer.type = 'circle';
            layer.paint = {
                'circle-color': 'marker-color' in feature.properties ? feature.properties['marker-color'] : '#555555',
                'circle-radius': 'marker-size' in feature.properties && markerSize[feature.properties['marker-size']] ? feature.properties['marker-size'] * 5 : 5
            };
        }

    } else if (geometry === 'LineString') {
        layer = {
            type: 'line',
            source: sourceId,
            id: hat(),
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
            id: hat(),
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

function makeSource(geojson, sourceId) {
    var sources = {};
    sources[sourceId] = {
        type: 'geojson',
        data: geojson
    };
    return sources;
}

module.exports = convert;
