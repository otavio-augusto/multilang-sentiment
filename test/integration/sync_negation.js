/* eslint quotes: [1, "double"] */

var test = require('tap').test;
var sentiment = require('../../lib/index');

var dataset = "I don't hate you";
var result = sentiment(dataset, 'en');

test('synchronous negation', function (t) {
  t.type(result, 'object');
  t.equal(result.score, 3);
  t.equal(result.comparative, 3.75);
  t.equal(result.tokens.length, 4);
  t.equal(result.words.length, 1);
  t.end();
});
