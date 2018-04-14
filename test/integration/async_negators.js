var test = require('tap').test;
var sentiment = require('../../lib/index');

var datasetEn = 'This is not cool';
var datasetIt = 'Questo non è bello';

sentiment(datasetEn, function (err, result) {
    test('[EN] asynchronous negators', function (t) {
        t.type(result, 'object');
        t.equal(result.score, -1);
        t.equal(result.comparative, -0.25);
        t.equal(result.tokens.length, 4);
        t.equal(result.words.length, 1);
        t.end();
    });
});

sentiment(datasetIt, function (err, result) {
    test('[IT] asynchronous negators', function (t) {
        t.type(result, 'object');
        t.equal(result.score, 1);
        t.equal(result.comparative, 0.25);
        t.equal(result.tokens.length, 4);
        t.equal(result.words.length, 2);
        t.end();
    });
});
