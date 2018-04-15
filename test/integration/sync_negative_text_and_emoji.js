var test = require('tap').test;
var sentiment = require('../../lib/index');

var datasetEn = 'Hey you worthless scumbag 😦';
var datasetIt = 'Hey brutta testa di cazzo 😦';
var resultEn = sentiment(datasetEn, 'en');
var resultIt = sentiment(datasetIt, 'it');

test('[EN] synchronous negative with emoji', function (t) {
    t.type(resultEn, 'object');
    t.equal(resultEn.score, -8);
    t.equal(resultEn.comparative, -1.6);
    t.equal(resultEn.tokens.length, 5);
    t.equal(resultEn.words.length, 3);
    t.end();
});

test('[IT] synchronous negative with emoji', function (t) {
    t.type(resultIt, 'object');
    t.equal(resultIt.score, -9);
    t.equal(resultIt.comparative, -1.5);
    t.equal(resultIt.tokens.length, 6);
    t.equal(resultIt.words.length, 3);
    t.end();
});
