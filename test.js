var test = require('tape');
simpleToGL = require('./index.js');

var validFeatureCollection = {"type":"FeatureCollection","features":[{"type":"Feature","properties":{"stroke":"#3eb367","stroke-width":2,"stroke-opacity":1},"geometry":{"type":"LineString","coordinates":[[40.78125,57.32652122521709],[10.546875,41.244772343082076],[57.65624999999999,18.312810846425442]]}},{"type":"Feature","properties":{"stroke":"#5bfa35","stroke-width":2,"stroke-opacity":1,"fill":"#b87acb","fill-opacity":0.5},"geometry":{"type":"Polygon","coordinates":[[[-23.5546875,23.88583769986199],[-31.640625,-8.05922962720018],[8.7890625,-8.05922962720018],[-23.5546875,23.88583769986199]]]}}]};
var validFeatureCollectionWithNoProperties = {"type":"FeatureCollection","features":[{"type":"Feature","geometry":{"type":"LineString","coordinates":[[40.78125,57.32652122521709],[10.546875,41.244772343082076],[57.65624999999999,18.312810846425442]]}},{"type":"Feature","geometry":{"type":"Polygon","coordinates":[[[-23.5546875,23.88583769986199],[-31.640625,-8.05922962720018],[8.7890625,-8.05922962720018],[-23.5546875,23.88583769986199]]]}}]};
var invalidFeatureCollection = {"type":"FeatureCollection","foobar":[{"type":"Feature","properties":{"stroke":"#3eb367","stroke-width":2,"stroke-opacity":1},"geometry":{"type":"LineString","coordinates":[[40.78125,57.32652122521709],[10.546875,41.244772343082076],[57.65624999999999,18.312810846425442]]}},{"type":"Feature","properties":{"stroke":"#5bfa35","stroke-width":2,"stroke-opacity":1,"fill":"#b87acb","fill-opacity":0.5},"geometry":{"type":"Polygon","coordinates":[[[-23.5546875,23.88583769986199],[-31.640625,-8.05922962720018],[8.7890625,-8.05922962720018],[-23.5546875,23.88583769986199]]]}}]};
var invalidFeatureCollectionType = {"type":"foobar","features":[{"type":"Feature","properties":{"stroke":"#3eb367","stroke-width":2,"stroke-opacity":1},"geometry":{"type":"LineString","coordinates":[[40.78125,57.32652122521709],[10.546875,41.244772343082076],[57.65624999999999,18.312810846425442]]}},{"type":"Feature","properties":{"stroke":"#5bfa35","stroke-width":2,"stroke-opacity":1,"fill":"#b87acb","fill-opacity":0.5},"geometry":{"type":"Polygon","coordinates":[[[-23.5546875,23.88583769986199],[-31.640625,-8.05922962720018],[8.7890625,-8.05922962720018],[-23.5546875,23.88583769986199]]]}}]};
var point = {"type":"FeatureCollection","features":[{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[15.8203125,28.613459424004414]}}]};
var pointWithImageAndSize = {"type":"FeatureCollection","features":[{"type":"Feature","properties":{"marker-color":"#7e7e7e","marker-symbol":"airport-11","marker-size":"large"},"geometry":{"type":"Point","coordinates":[28.4765625,16.63619187839765]}}]};
var singleGeoJSONFeature = {"type":"Feature","properties":{},"geometry":{"type":"Polygon","coordinates":[[[36.2109375,60.06484046010452],[-4.921875,47.98992166741417],[14.0625,3.8642546157214213],[61.52343749999999,16.63619187839765],[36.2109375,60.06484046010452]]]}};

test('valid', function(t) {
    var style = simpleToGL(validFeatureCollection);
    t.deepEqual(style.version, 9, 'Version should be 9');

    for (var key in style.sources) {
       var source = style.sources[key];
       for (var i = 0; i < source.data.features.length; i++) {
           t.deepEqual(style.layers[i].filter[2], source.data.features[i].properties._id, 'ids match between geojson source and layer')
       }
    }

    t.deepEqual(style.layers.length, 3, 'Should create 3 layers: 1 for LineString, and 2 for polygon');

    t.deepEqual(style.layers[0].paint['line-color'], validFeatureCollection.features[0].properties['stroke'], 'LineString line-color the same');
    t.deepEqual(style.layers[0].paint['line-width'], validFeatureCollection.features[0].properties['stroke-width'], 'LineString line-width the same');
    t.deepEqual(style.layers[0].paint['line-opacity'], validFeatureCollection.features[0].properties['stroke-opacity'], 'LineString line-opacity the same');

    t.deepEqual(style.layers[1].paint['line-color'], validFeatureCollection.features[1].properties['stroke'], 'LineString line-color the same');
    t.deepEqual(style.layers[1].paint['line-width'], validFeatureCollection.features[1].properties['stroke-width'], 'LineString line-width the same');
    t.deepEqual(style.layers[1].paint['line-opacity'], validFeatureCollection.features[1].properties['stroke-opacity'], 'LineString line-opacity the same');

    t.deepEqual(style.layers[2].paint['fill-color'], validFeatureCollection.features[1].properties['fill'], 'Polyong fill-color the same');
    t.deepEqual(style.layers[2].paint['fill-opacity'], validFeatureCollection.features[1].properties['fill-opacity'], 'Polyong fill-opacity the same');

    t.deepEqual(style.layers[0].source, style.layers[1].source, 'Sources should be the same');
    t.end();
});

test('valid with no properties', function(t) {
    var style = simpleToGL(validFeatureCollectionWithNoProperties);
    t.deepEqual(style.version, 9, 'Version should be 9');

    for (var key in style.sources) {
       var source = style.sources[key];
       for (var i = 0; i < source.data.features.length; i++) {
           t.deepEqual(style.layers[i].filter[2], source.data.features[i].properties._id, 'ids match between geojson source and layer')
       }
    }

    t.deepEqual(style.layers[0].paint['line-color'], '#555555', 'LineString line-color is default value');
    t.deepEqual(style.layers[0].paint['line-opacity'], 1.0, 'LineString line-opacity is default value');
    t.deepEqual(style.layers[0].paint['line-width'], 2.0, 'LineString line-width is default value');

    t.deepEqual(style.layers[1].paint['line-color'], '#555555', 'LineString line-color is default value');
    t.deepEqual(style.layers[1].paint['line-opacity'], 1.0, 'LineString line-opacity is default value');
    t.deepEqual(style.layers[1].paint['line-width'], 2.0, 'LineString line-width is default value');

    t.deepEqual(style.layers[2].paint['fill-color'], '#555555', 'Polyong fill-color is default value');
    t.deepEqual(style.layers[2].paint['fill-opacity'], 0.5, 'Polyong fill-opacity is default value');

    t.end();
});

test('valid single feature', function(t) {
    var style = simpleToGL(singleGeoJSONFeature);
    t.deepEqual(style.version, 9, 'Version should be 9');

    for (var key in style.sources) {
       var source = style.sources[key];
       for (var i = 0; i < style.layers.length; i++) {
           t.deepEqual(style.layers[i].filter[2], source.data.properties._id, 'ids match between geojson source and layer');
       }
    }

    t.deepEqual(style.layers[0].paint['line-color'], '#555555', 'LineString line-color is default value');
    t.deepEqual(style.layers[0].paint['line-opacity'], 1.0, 'LineString line-opacity is default value');
    t.deepEqual(style.layers[0].paint['line-width'], 2.0, 'LineString line-width is default value');

    t.deepEqual(style.layers[1].paint['fill-color'], '#555555', 'Polyong fill-color is default value');
    t.deepEqual(style.layers[1].paint['fill-opacity'], 0.5, 'Polyong fill-opacity is default value');

    t.end();
});

test('valid single point defaults to circle', function(t) {
    var style = simpleToGL(point);
    t.deepEqual(style.version, 9, 'Version should be 9');
    t.deepEqual(style.layers[0].paint['circle-radius'], 5, 'Default circle marker');
    t.deepEqual(style.layers[0].paint['circle-color'], '#555555', 'Default size');
    t.end();
});

test('valid single point with image', function(t) {
    var style = simpleToGL(pointWithImageAndSize);
    t.deepEqual(style.version, 9, 'Version should be 9');
    t.deepEqual(style.layers[0].layout['icon-image'], 'airport-11', 'Custom marker');
    t.deepEqual(style.layers[0].layout['icon-size'], 1.5, 'Custom size');
    t.end();
});

test('invalid image size defaults to 1', function(t) {
    var invalid = {"type":"FeatureCollection","features":[{"type":"Feature","properties":{"marker-color":"#7e7e7e","marker-symbol":"airport-11","marker-size":"super-large"},"geometry":{"type":"Point","coordinates":[28.4765625,16.63619187839765]}}]};
    var style = simpleToGL(invalid);
    t.deepEqual(style.version, 9, 'Version should be 9');
    t.deepEqual(style.layers[0].layout['icon-size'], 1, 'Default size');
    t.end();
});

test('invalid FeatureCollection', function(t) {
    t.throws(function() {
        var style = simpleToGL(invalidFeatureCollectionType);
    }, {
      message: 'unknown or unsupported GeoJSON type'
    }, 'Invalid GeoJSON type');
    t.end();
});
