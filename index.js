var hat = require('hat');

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
    if (geometry === 'Point') {
        layer = {
            source: sourceId,
            id: hat(),
            type: 'symbol',
            layout: {
                'icon-image': feature.properties._id,
                'icon-size': 1
            },
            filter: [
                '==',
                '_id',
                feature.properties._id
            ]
        };
    } else if (geometry === 'LineString') {
        layer = {
            type: 'line',
            source: sourceId,
            id: hat(),
            paint: {
                'line-color': 'stroke' in feature.properties ? feature.properties.stroke : '#555555',
                'line-opacity': 'stroke-opacity' in feature.properties ? +feature.properties['stroke-opacity'] : 1.0,
                'line-width': 'stroke-width' in feature.properties ? +feature.properties['stroke-width'] : 2
            },
            layout: {
                'line-cap': 'round',
                'line-join': 'bevel'
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
                'fill-opacity': 'fill-opacity' in feature.properties ? +feature.properties['fill-opacity'] : 0.5
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
