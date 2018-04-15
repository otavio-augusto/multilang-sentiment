var test = require('tap').test;
var sentiment = require('../../lib/index');

var datasetIt = 'ok eventualmente anche io potrei fare un paio ' +
'di panini se pensi che tre siano pochi per entrambi';

var datasetEn = 'I left the theater with a lilt in my step, joy ' +
'in my heart and hope for the human race.';

sentiment(datasetIt, 'it', function (err, result) {
    test('[IT] asynchronous misc', function (t) {
        t.type(result, 'object');
        t.equal(result.score, 0);
        t.equal(result.comparative, 0);
        t.equal(result.tokens.length, 18);
        t.equal(result.words.length, 0);
        t.end();
    });
});

sentiment(datasetEn, 'en', function (err, result) {
    test('[EN] asynchronous misc', function (t) {
        t.type(result, 'object');
        t.equal(result.score, 5);
        t.equal(result.comparative, 0.25);
        t.equal(result.tokens.length, 20);
        t.equal(result.words.length, 2);
        t.end();
    });
});
