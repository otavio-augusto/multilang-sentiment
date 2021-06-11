var test = require('tap').test;
var corpus = require('../fixtures/corpus');
var sentiment = require('../../lib/index');

var dataset = corpus;
var result = sentiment(dataset, 'en');

test('synchronous corpus', function (t) {
  t.type(result, 'object');
  t.equal(result.score, -9);
  t.equal(result.tokens.length, 1468);
  t.equal(result.words.length, 1460);
  t.end();
});
