var test = require('tap').test;
var sentiment = require('../../lib/index');

var dataset = '世界就是一个疯子的囚笼';
var tokens = ['世界','就','是','一个','疯子','的','囚笼'];

sentiment(dataset, 'zh', {tokens: tokens}, function (err, result) {
    test('[ZH] asynchronous misc', function (t) {
        t.type(result, 'object');
        t.equal(result.score, -3);
        t.equal(result.comparative, -0.43);
        t.equal(result.tokens.length, tokens.length);
        t.equal(result.words.length, 1);
        t.end();
    });
});

