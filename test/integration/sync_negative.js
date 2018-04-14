var test = require('tap').test;
var sentiment = require('../../lib/index');

var datasetEn = 'Hey you worthless scumbag';
var resultEn = sentiment(datasetEn, 'en');
var datasetRu = 'мудак!';
var resultRu = sentiment(datasetRu, 'ru');

test('[EN] synchronous negative', function (t) {
    t.type(resultEn, 'object');
    t.equal(resultEn.score, -6);
    t.equal(resultEn.comparative, -1.5);
    t.equal(resultEn.tokens.length, 4);
    t.equal(resultEn.words.length, 2);
    t.end();
});

test('[RU] synchronous negative', function (t) {
    t.type(resultRu, 'object');
    t.equal(resultRu.score, -4);
    t.equal(resultRu.comparative, -4);
    t.equal(resultRu.tokens.length, 1);
    t.equal(resultRu.words.length, 1);
    t.end();
});
