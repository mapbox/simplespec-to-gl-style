var test = require('tape');
var simpleToGL = require('./index.js');

/* eslint-disable */
var validFeatureCollection = {"type":"FeatureCollection","features":[{"type":"Feature","properties":{"stroke":"#3eb367","stroke-width":2,"stroke-opacity":1},"geometry":{"type":"LineString","coordinates":[[40.78125,57.32652122521709],[10.546875,41.244772343082076],[57.65624999999999,18.312810846425442]]}},{"type":"Feature","properties":{"stroke":"#5bfa35","stroke-width":2,"stroke-opacity":1,"fill":"#b87acb","fill-opacity":0.5},"geometry":{"type":"Polygon","coordinates":[[[-23.5546875,23.88583769986199],[-31.640625,-8.05922962720018],[8.7890625,-8.05922962720018],[-23.5546875,23.88583769986199]]]}}]};
var validFeatureCollectionWithNoProperties = {"type":"FeatureCollection","features":[{"type":"Feature","geometry":{"type":"LineString","coordinates":[[40.78125,57.32652122521709],[10.546875,41.244772343082076],[57.65624999999999,18.312810846425442]]}},{"type":"Feature","geometry":{"type":"Polygon","coordinates":[[[-23.5546875,23.88583769986199],[-31.640625,-8.05922962720018],[8.7890625,-8.05922962720018],[-23.5546875,23.88583769986199]]]}}]};
var invalidFeatureCollection = {"type":"FeatureCollection","foobar":[{"type":"Feature","properties":{"stroke":"#3eb367","stroke-width":2,"stroke-opacity":1},"geometry":{"type":"LineString","coordinates":[[40.78125,57.32652122521709],[10.546875,41.244772343082076],[57.65624999999999,18.312810846425442]]}},{"type":"Feature","properties":{"stroke":"#5bfa35","stroke-width":2,"stroke-opacity":1,"fill":"#b87acb","fill-opacity":0.5},"geometry":{"type":"Polygon","coordinates":[[[-23.5546875,23.88583769986199],[-31.640625,-8.05922962720018],[8.7890625,-8.05922962720018],[-23.5546875,23.88583769986199]]]}}]};
var invalidFeatureCollectionType = {"type":"foobar","features":[{"type":"Feature","properties":{"stroke":"#3eb367","stroke-width":2,"stroke-opacity":1},"geometry":{"type":"LineString","coordinates":[[40.78125,57.32652122521709],[10.546875,41.244772343082076],[57.65624999999999,18.312810846425442]]}},{"type":"Feature","properties":{"stroke":"#5bfa35","stroke-width":2,"stroke-opacity":1,"fill":"#b87acb","fill-opacity":0.5},"geometry":{"type":"Polygon","coordinates":[[[-23.5546875,23.88583769986199],[-31.640625,-8.05922962720018],[8.7890625,-8.05922962720018],[-23.5546875,23.88583769986199]]]}}]};
var point = {"type":"FeatureCollection","features":[{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[15.8203125,28.613459424004414]}}]};
var pointWithImageAndSize = {"type":"FeatureCollection","features":[{"type":"Feature","properties":{"marker-color":"#7e7e7e","marker-symbol":"airport","marker-size":"large"},"geometry":{"type":"Point","coordinates":[28.4765625,16.63619187839765]}}]};
var singleGeoJSONFeature = {"type":"Feature","properties":{},"geometry":{"type":"Polygon","coordinates":[[[36.2109375,60.06484046010452],[-4.921875,47.98992166741417],[14.0625,3.8642546157214213],[61.52343749999999,16.63619187839765],[36.2109375,60.06484046010452]]]}};
var multiPolygon = {"type":"FeatureCollection","features":[{"type":"Feature","properties":{},"geometry":{"type":"MultiPolygon","coordinates":[[[[-84.71239,39.052056],[-84.368778,39.052056],[-84.368778,39.221037],[-84.71239,39.221037],[-84.71239,39.052056]]]]}}]};
var validFeatureCollectionWithPoints = {"type":"FeatureCollection","features":[{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[15.8203135,28.613459425004414]}},{"type":"Feature","properties":{"stroke":"#5bfa35","stroke-width":2,"stroke-opacity":1,"fill":"#b87acb","fill-opacity":0.5},"geometry":{"type":"Polygon","coordinates":[[[-23.5546875,23.88583769986199],[-31.640625,-8.05922962720018],[8.7890625,-8.05922962720018],[-23.5546875,23.88583769986199]]]}},{"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[15.8203125,28.613459424004414]}},{"type":"Feature","properties":{"stroke":"#3eb367","stroke-width":2,"stroke-opacity":1},"geometry":{"type":"LineString","coordinates":[[40.78125,57.32652122521709],[10.546875,41.244772343082076],[57.65624999999999,18.312810846425442]]}}, {"type":"Feature","properties":{},"geometry":{"type":"Point","coordinates":[15.8203235,28.613489425004414]}}]};
/* eslint-enable */

test('valid', function(t) {
    var style = simpleToGL(validFeatureCollection);
    t.deepEqual(style.version, 8, 'Version should be 8');

    for (var key in style.sources) {
       var source = style.sources[key];
       for (var i = 0; i < source.data.features.length; i++) {
           t.deepEqual(style.layers[i].filter[2], source.data.features[i].properties._id, 'ids match between geojson source and layer');
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
    t.deepEqual(style.version, 8, 'Version should be 8');

    for (var key in style.sources) {
       var source = style.sources[key];
       for (var i = 0; i < source.data.features.length; i++) {
           t.deepEqual(style.layers[i].filter[2], source.data.features[i].properties._id, 'ids match between geojson source and layer');
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

test('valid multiPolygon no properties', function(t) {
    var style = simpleToGL(multiPolygon);
    t.deepEqual(style.version, 8, 'Version should be 8');

    for (var key in style.sources) {
       var source = style.sources[key];
       for (var i = 0; i < source.data.features.length; i++) {
           t.deepEqual(style.layers[i].filter[2], source.data.features[i].properties._id, 'ids match between geojson source and layer');
       }
    }

    t.deepEqual(style.layers[0].paint['line-color'], '#555555', 'LineString line-color is default value');
    t.deepEqual(style.layers[0].paint['line-opacity'], 1.0, 'LineString line-opacity is default value');
    t.deepEqual(style.layers[0].paint['line-width'], 2.0, 'LineString line-width is default value');

    t.deepEqual(style.layers[1].paint['fill-color'], '#555555', 'Polygon fill-color is default value');
    t.deepEqual(style.layers[1].paint['fill-opacity'], 0.5, 'Polygon fill-opacity is default value');

    t.end();
});

test('valid single feature', function(t) {
    var style = simpleToGL(singleGeoJSONFeature);
    t.deepEqual(style.version, 8, 'Version should be 8');

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

test('valid single point defaults to point', function(t) {
    var style = simpleToGL(point);
    t.deepEqual(style.version, 8, 'Version should be 8');
    t.deepEqual(style.layers[0].type, 'symbol', 'Default symbol');
    t.deepEqual(style.layers[0].layout['icon-size'], 1);
    t.end();
});

test('valid single point with image', function(t) {
    var style = simpleToGL(pointWithImageAndSize);
    t.deepEqual(style.version, 8, 'Version should be 8');
    t.deepEqual(style.layers[0].type, 'symbol');
    t.ok(style.layers[0].layout['icon-image'], 'Custom marker');
    t.ok(style.layers[0].layout['icon-allow-overlap'], 'Allow marker overlap');
    t.deepEqual(style.layers[0].layout['icon-size'], 1, 'Custom size');

    t.end();
});

test('invalid image size defaults to 1', function(t) {
    var invalid = {"type":"FeatureCollection","features":[{"type":"Feature","properties":{"marker-color":"#7e7e7e","marker-symbol":"airport","marker-size":"super-large"},"geometry":{"type":"Point","coordinates":[28.4765625,16.63619187839765]}}]}; // eslint-disable-line
    var style = simpleToGL(invalid);
    t.deepEqual(style.version, 8, 'Version should be 8');
    t.deepEqual(style.layers[0].layout['icon-size'], 1, 'Default size');
    t.end();
});

test('invalid FeatureCollection', function(t) {
    t.throws(function() {
        simpleToGL(invalidFeatureCollectionType);
    }, {
      message: 'unknown or unsupported GeoJSON type'
    }, 'Invalid GeoJSON type');
    t.end();
});


test('LineString with fill properties', function(t) {
    var geojson = {"type":"FeatureCollection","features":[{"type":"Feature","properties":{"stroke-width":"2","stroke":"#000000","stroke-opacity":"1.0","fill":"#ff0000","fill-opacity":"0.25"},"geometry":{"type":"LineString","coordinates":[[-122.68209,45.52475],[-122.67488,45.52451],[-122.67608,45.51681],[-122.68998,45.51693],[-122.68964,45.5203],[-122.68209,45.52475]]}}]};  // eslint-disable-line
    var style = simpleToGL(geojson);

    t.equal(style.layers.length, 2, 'Has two layers');
    t.equal(style.layers[1].type, 'fill');
    t.equal(style.layers[1].paint['fill-color'], '#ff0000');
    t.equal(style.layers[1].paint['fill-opacity'], 0.25);
    t.end();
});

test('features get ordered correctly', function(t) {
  var style = simpleToGL(validFeatureCollectionWithPoints);

  t.equal(style.layers[style.layers.length - 1].type, 'symbol', 'points should be sorted to the end of the list');
  t.equal(style.layers[style.layers.length - 2].type, 'symbol', 'points should be sorted to the end of the list');
  t.equal(style.layers[style.layers.length - 3].type, 'symbol', 'points should be sorted to the end of the list');
  t.equal(style.layers[0].type, 'line');
  t.end();
})
