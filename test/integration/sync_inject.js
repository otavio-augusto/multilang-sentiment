var test = require('tap').test;
var sentiment = require('../../lib/index');

var dataset = 'This is so cool';
var result = sentiment(dataset, {'cool': 100});

test('synchronous inject', function (t) {
    t.type(result, 'object');
    t.equal(result.score, 102);
    t.equal(result.comparative, 25.5);
    t.equal(result.tokens.length, 4);
    t.equal(result.words.length, 2);
    t.end();
});
