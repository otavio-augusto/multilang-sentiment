var test = require('tap').test;
var sentiment = require('../../lib/index');

var datasetEnNeg = 'This is not cool';
var datasetItNeg = 'Questo non è bello';
var datasetEnPos = 'This is cool';
var datasetItPos = 'Questo è bello';
var dataSetItFarNeg = 'Questo non credo sia bello';
var dataSetItFarAltNeg = 'Non mi sento molto bene';

sentiment(datasetEnNeg, 'en', function (err, result) {
    test('[EN][NEG] asynchronous negators', function (t) {
        t.type(result, 'object');
        t.equal(result.score, -1);
        t.equal(result.comparative, -0.25);
        t.equal(result.tokens.length, 4);
        t.equal(result.words.length, 1);
        t.end();
    });
});

sentiment(datasetItNeg, 'it', function (err, result) {
    test('[IT][NEG] asynchronous negators', function (t) {
        t.type(result, 'object');
        t.equal(result.score, -3);
        t.equal(result.comparative, -1);
        t.equal(result.tokens.length, 3);
        t.equal(result.words.length, 1);
        t.end();
    });
});

sentiment(dataSetItFarNeg, 'it', function (err, result) {
    test('[IT][FAR NEG] asynchronous negators', function (t) {
        t.type(result, 'object');
        t.equal(result.score, -3);
        t.equal(result.comparative, -0.6);
        t.equal(result.tokens.length, 5);
        t.equal(result.words.length, 1);
        t.end();
    });
});

sentiment(dataSetItFarAltNeg, 'it', function (err, result) {
    test('[IT][FAR ALT NEG] asynchronous negators', function (t) {
        t.type(result, 'object');
        t.equal(result.score, -3);
        t.equal(result.comparative, -0.6);
        t.equal(result.tokens.length, 5);
        t.equal(result.words.length, 1);
        t.end();
    });
});

sentiment(datasetEnPos, 'en', function (err, result) {
    test('[EN][POS] asynchronous negators', function (t) {
        t.type(result, 'object');
        t.equal(result.score, 1);
        t.equal(result.comparative, 0.33);
        t.equal(result.tokens.length, 3);
        t.equal(result.words.length, 1);
        t.end();
    });
});

sentiment(datasetItPos, 'it', function (err, result) {
    test('[IT][POS] asynchronous negators', function (t) {
        t.type(result, 'object');
        t.equal(result.score, 3);
        t.equal(result.comparative, 1);
        t.equal(result.tokens.length, 3);
        t.equal(result.words.length, 1);
        t.end();
    });
});
