var test = require('tap').test;
var sentiment = require('../../lib/index');

var datasetIt = 'ok eventualmente anche io potrei fare un paio ' +
'di panini se pensi che tre siano pochi per entrambi';

sentiment(datasetIt, 'it', function (err, result) {
    test('[IT] asynchronous negators', function (t) {
        t.type(result, 'object');
        t.equal(result.score, 0);
        t.equal(result.comparative, 0);
        t.equal(result.tokens.length, 18);
        t.equal(result.words.length, 0);
        t.end();
    });
});
