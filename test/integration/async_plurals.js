var test = require('tap').test;
var sentiment = require('../../lib/index');

var datasetEn = 'Cats are cool!';
var datasetIt = 'I gatti sono meravigliosi!';
var datasetItAlt = 'I gatti sono stupidi';

sentiment(datasetEn, 'en', function (err, result) {
    test('[EN] asynchronous negators', function (t) {
        t.type(result, 'object');
        t.equal(result.score, 1);
        t.equal(result.comparative, 0.33);
        t.equal(result.tokens.length, 3);
        t.equal(result.words.length, 1);
        t.end();
    });
});

sentiment(datasetIt, 'it', function (err, result) {
    test('[IT] asynchronous negators', function (t) {
        t.type(result, 'object');
        t.equal(result.score, 3);
        t.equal(result.comparative, 0.75);
        t.equal(result.tokens.length, 4);
        t.equal(result.words.length, 1);
        t.end();
    });
});

sentiment(datasetItAlt, 'it', function (err, result) {
    test('[IT] asynchronous negators', function (t) {
        t.type(result, 'object');
        t.equal(result.score, -2);
        t.equal(result.comparative, -0.5);
        t.equal(result.tokens.length, 4);
        t.equal(result.words.length, 1);
        t.end();
    });
});
