var test = require('tape');
simpleToGL = require('./index.js');

var validFeatureCollection = {"type":"FeatureCollection","features":[{"type":"Feature","properties":{"stroke":"#3eb367","stroke-width":2,"stroke-opacity":1},"geometry":{"type":"LineString","coordinates":[[40.78125,57.32652122521709],[10.546875,41.244772343082076],[57.65624999999999,18.312810846425442]]}},{"type":"Feature","properties":{"stroke":"#5bfa35","stroke-width":2,"stroke-opacity":1,"fill":"#b87acb","fill-opacity":0.5},"geometry":{"type":"Polygon","coordinates":[[[-23.5546875,23.88583769986199],[-31.640625,-8.05922962720018],[8.7890625,-8.05922962720018],[-23.5546875,23.88583769986199]]]}}]};
var invalidFeatureCollection = {"type":"FeatureCollection","foobar":[{"type":"Feature","properties":{"stroke":"#3eb367","stroke-width":2,"stroke-opacity":1},"geometry":{"type":"LineString","coordinates":[[40.78125,57.32652122521709],[10.546875,41.244772343082076],[57.65624999999999,18.312810846425442]]}},{"type":"Feature","properties":{"stroke":"#5bfa35","stroke-width":2,"stroke-opacity":1,"fill":"#b87acb","fill-opacity":0.5},"geometry":{"type":"Polygon","coordinates":[[[-23.5546875,23.88583769986199],[-31.640625,-8.05922962720018],[8.7890625,-8.05922962720018],[-23.5546875,23.88583769986199]]]}}]};
var point = {"type":"FeatureCollection","features":[{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[15.8203125,28.613459424004414]}}]};

test('valid', function(t) {
    var style = simpleToGL(validFeatureCollection);
    t.deepEqual(style.version, 8, 'Version should be 8');

    for (var i = 0; i < style.sources.geojson.data.features.length; i++) {
        t.deepEqual(style.layers[i].filter[2], style.sources.geojson.data.features[i].properties._id, 'ids match between geojson source and layer')
    }

    t.deepEqual(style.layers[0].paint['line-color'], validFeatureCollection.features[0].properties['stroke'], 'LineString line-color the same');
    t.deepEqual(style.layers[0].paint['line-width'], validFeatureCollection.features[0].properties['stroke-width'], 'LineString line-width the same');
    t.deepEqual(style.layers[0].paint['line-opacity'], validFeatureCollection.features[0].properties['stroke-opacity'], 'LineString line-opacity the same');

    t.deepEqual(style.layers[1].paint['line-color'], validFeatureCollection.features[1].properties['stroke'], 'Polyong line-color the same');
    t.deepEqual(style.layers[1].paint['line-width'], validFeatureCollection.features[1].properties['stroke-width'], 'Polyong line-width the same');
    t.deepEqual(style.layers[1].paint['line-opacity'], validFeatureCollection.features[1].properties['stroke-opacity'], 'Polyong line-opacity the same');
    t.deepEqual(style.layers[1].paint['fill-color'], validFeatureCollection.features[1].properties['fill'], 'Polyong fill-color the same');
    t.deepEqual(style.layers[1].paint['fill-opacity'], validFeatureCollection.features[1].properties['fill-opacity'], 'Polyong fill-opacity the same');

    t.end();
});

test('invalid point', function(t) {
    var style = simpleToGL(point);
    t.deepEqual(style.message, 'Unsupported geometry type');
    t.end();
});
